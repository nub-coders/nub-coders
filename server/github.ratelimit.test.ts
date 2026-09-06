// @vitest-environment node
/**
 * The rate-limit floor guard.
 *
 * It used to read `remaining < FLOOR && res.status !== 200`, so it could only
 * fire once GitHub had already started rejecting — by which point the budget was
 * spent and the guard was reporting history rather than preserving anything. The
 * status qualifier is gone, and because several crawl helpers deliberately
 * swallow their own failures, the guard throws a distinct error type that those
 * handlers re-throw instead of degrading to 0 / {}.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const FLOOR = 10;
const HEADERS = { Authorization: "token test" };
const ENDPOINT = "https://api.github.com/user/repos";

function ghResponse(
  body: unknown,
  {
    status = 200,
    remaining,
    reset,
    link,
  }: { status?: number; remaining?: number; reset?: number; link?: string } = {},
) {
  const headers = new Headers();
  if (remaining !== undefined) headers.set("x-ratelimit-remaining", String(remaining));
  if (reset !== undefined) headers.set("x-ratelimit-reset", String(reset));
  if (link) headers.set("link", link);

  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => body,
  } as unknown as Response;
}

async function loadModule() {
  vi.resetModules();
  return import("./github");
}

beforeEach(() => {
  process.env.GITHUB_TOKEN = "test-token";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.GITHUB_TOKEN;
});

describe("rate-limit floor guard", () => {
  it("aborts on a successful response once the budget is under the floor", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse([{ id: 1 }], { remaining: FLOOR - 1 })));
    const { paginate } = await loadModule();

    // Pre-fix a 200 could never trip this, no matter how low the budget went.
    await expect(paginate(ENDPOINT, HEADERS)).rejects.toThrow(/rate limit critically low/);
  });

  it("throws a RateLimitFloorError, not a bare Error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse([{ id: 1 }], { remaining: 0 })));
    const { paginate, RateLimitFloorError } = await loadModule();

    await expect(paginate(ENDPOINT, HEADERS)).rejects.toBeInstanceOf(RateLimitFloorError);
  });

  it("reports how long until the budget resets", async () => {
    const resetEpoch = Math.floor(Date.now() / 1000) + 120;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ghResponse([{ id: 1 }], { remaining: 3, reset: resetEpoch })),
    );
    const { paginate } = await loadModule();

    await expect(paginate(ENDPOINT, HEADERS)).rejects.toThrow(/\(3 remaining\).*Resets in 1[12]\ds/);
  });

  it("allows a response sitting exactly on the floor", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse([{ id: 1 }], { remaining: FLOOR })));
    const { paginate } = await loadModule();

    await expect(paginate(ENDPOINT, HEADERS)).resolves.toEqual([{ id: 1 }]);
  });

  it("does not fire when GitHub omits the header", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse([{ id: 1 }])));
    const { paginate } = await loadModule();

    await expect(paginate(ENDPOINT, HEADERS)).resolves.toEqual([{ id: 1 }]);
  });

  it("still fires on a rejected response below the floor", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ghResponse({ message: "rate limited" }, { status: 403, remaining: 0 })),
    );
    const { paginate } = await loadModule();

    // The pre-fix behaviour, preserved.
    await expect(paginate(ENDPOINT, HEADERS)).rejects.toThrow(/rate limit critically low/);
  });
});

/**
 * The crawl fans out through `countCommits`, `repoLanguages` and `searchCount`,
 * each of which catches everything and returns 0 or {}. Those handlers are where
 * a bare Error would have been swallowed and cached as real data.
 */
describe("floor guard inside the crawl fan-out", () => {
  /** /user and the repo list succeed; the per-repo calls report a spent budget. */
  function mockCrawlWithLowQuotaFanOut(lowQuota = { value: true }) {
    return vi.fn(async (input: unknown) => {
      const url = String(input);
      const remaining = lowQuota.value ? 1 : 500;

      if (url.endsWith("/orgs/nub-coders") || url.includes("/orgs/nub-coders?") || url.includes("/user?") || url.endsWith("/user")) {
        return ghResponse(
          { login: "nub-coders", avatar_url: "a", html_url: "h" },
          { remaining: 500 },
        );
      }
      if (url.includes("/orgs/nub-coders/repos") || url.includes("/user/repos")) {
        return ghResponse([{ full_name: "nub-coders/one", private: false }], { remaining: 500 });
      }
      if (url.includes("/commits")) {
        return ghResponse([{ sha: "x" }], { remaining });
      }
      if (url.includes("/languages")) {
        return ghResponse({ TypeScript: 100 }, { remaining });
      }
      if (url.includes("/search/issues")) {
        return ghResponse({ total_count: 4 }, { remaining });
      }
      if (url.includes("/gists")) {
        return ghResponse([], { remaining });
      }
      throw new Error(`unexpected request: ${url}`);
    });
  }

  it("fails the crawl instead of caching zeroed commits and languages", async () => {
    vi.stubGlobal("fetch", mockCrawlWithLowQuotaFanOut());
    const { fetchGitHubStats } = await loadModule();

    // Pre-fix this resolved with totalCommits: 0 and an empty language map, and
    // that hollow result was cached and served for the next ten minutes.
    await expect(fetchGitHubStats()).rejects.toThrow(/rate limit critically low/);
  });

  it("serves the last good cache when a refresh hits the floor", async () => {
    const lowQuota = { value: false };
    vi.stubGlobal("fetch", mockCrawlWithLowQuotaFanOut(lowQuota));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetchGitHubStats } = await loadModule();

    const fresh = await fetchGitHubStats();
    expect(fresh.totalCommits).toBeGreaterThan(0);

    // The budget drops, then the refresher forces a crawl.
    lowQuota.value = true;

    // Aborting is safe precisely because stale-while-revalidate has a fallback.
    await expect(fetchGitHubStats(true)).resolves.toBe(fresh);
    expect(warn).toHaveBeenCalled();
  });
});
