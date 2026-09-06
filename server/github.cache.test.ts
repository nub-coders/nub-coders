// @vitest-environment node
/**
 * Coverage for `fetchGitHubStats`'s cache coordination.
 *
 * The crawl is ~2 requests per public repo on top of the profile, search and
 * gist calls, and the cache is only written once the whole thing finishes. Before
 * single-flight, every request arriving at the TTL boundary started its own
 * fan-out and they all raced to overwrite the same entry.
 *
 * Each test re-imports the module (`vi.resetModules`) because the cache and the
 * in-flight handle are module-level state with no reset hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { GitHubStats } from "./github";

const CACHE_TTL_MS = 10 * 60 * 1000;

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
}

function deferred(): Deferred {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function json(body: unknown, link?: string) {
  return {
    ok: true,
    status: 200,
    headers: new Headers(link ? { link } : {}),
    json: async () => body,
  } as unknown as Response;
}

/**
 * A router-style stand-in for the GitHub REST endpoints the crawl touches.
 * `gate`, if supplied, holds up the very first /user request so a second caller
 * can arrive while the crawl is still in flight.
 */
function mockGitHubAPI(gate?: Deferred) {
  const fetchMock = vi.fn(async (input: unknown) => {
    const url = String(input);

    if (url.includes("/orgs/nub-coders/repos") || url.includes("/user/repos")) {
      return json([
        { full_name: "nub-coders/one", private: false, stargazers_count: 3, forks_count: 1 },
        { full_name: "nub-coders/secret", private: true },
      ]);
    }
    if (url.includes("/orgs/nub-coders") || url.includes("/user?") || url.endsWith("/user")) {
      if (gate) await gate.promise;
      return json({ login: "nub-coders", name: "Ankit", avatar_url: "a", html_url: "h", followers: 1, following: 2 });
    }
    if (url.includes("/commits")) {
      return json([{ sha: "x" }], '<https://api.github.com/x?page=7>; rel="last"');
    }
    if (url.includes("/languages")) {
      return json({ TypeScript: 1000, CSS: 250 });
    }
    if (url.includes("/search/issues")) {
      return json({ total_count: 4 });
    }
    if (url.includes("/gists")) {
      return json([]);
    }
    throw new Error(`unexpected request: ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);

  return {
    fetchMock,
    /**
     * How many crawls started — /orgs or /user is a crawl's first request. Counted off the
     * mock's own call log, not the router above, so a `mockImplementationOnce`
     * that bypasses the router is still counted.
     */
    crawlCount: () =>
      fetchMock.mock.calls.filter((call) => {
        const url = String(call[0]);
        return url.endsWith("/orgs/nub-coders") || url.includes("/orgs/nub-coders?") || url.includes("/user?") || url.endsWith("/user");
      }).length,
  };
}

/** Fresh module instance, so `cached` and `inflight` start empty. */
async function loadModule() {
  vi.resetModules();
  return import("./github");
}

beforeEach(() => {
  process.env.GITHUB_TOKEN = "test-token";
  vi.useFakeTimers({ toFake: ["Date"] }); // real setTimeout: ghFetch's abort timer must stay live
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.GITHUB_TOKEN;
});

describe("fetchGitHubStats single-flight", () => {
  it("coalesces concurrent cold calls into one crawl", async () => {
    const gate = deferred();
    const api = mockGitHubAPI(gate);
    const { fetchGitHubStats } = await loadModule();

    const first = fetchGitHubStats();
    const second = fetchGitHubStats();
    gate.resolve();

    const [a, b] = await Promise.all([first, second]);

    // Same object, not merely equal values: they awaited one shared promise.
    expect(a).toBe(b);
    expect(api.crawlCount()).toBe(1);
  });

  it("only crawls once for three overlapping callers", async () => {
    const gate = deferred();
    const api = mockGitHubAPI(gate);
    const { fetchGitHubStats } = await loadModule();

    const all = Promise.all([fetchGitHubStats(), fetchGitHubStats(), fetchGitHubStats()]);
    gate.resolve();
    await all;

    expect(api.crawlCount()).toBe(1);
  });

  it("serves a fresh cache without touching the network again", async () => {
    const api = mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();

    const first = await fetchGitHubStats();
    const callsAfterCrawl = api.fetchMock.mock.calls.length;
    const second = await fetchGitHubStats();

    expect(second).toBe(first);
    expect(api.fetchMock.mock.calls.length).toBe(callsAfterCrawl);
  });

  it("releases the in-flight handle so a later expiry can crawl again", async () => {
    const api = mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();

    await fetchGitHubStats();
    vi.setSystemTime(Date.now() + CACHE_TTL_MS + 1);
    await fetchGitHubStats(true);

    expect(api.crawlCount()).toBe(2);
  });
});

describe("fetchGitHubStats stale-while-revalidate", () => {
  it("returns stale data immediately and revalidates in the background", async () => {
    const api = mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();

    const fresh = await fetchGitHubStats();
    vi.setSystemTime(Date.now() + CACHE_TTL_MS + 1);

    // Pre-fix this awaited a whole new crawl and returned a new object.
    const stale = await fetchGitHubStats();
    expect(stale).toBe(fresh);

    // Wait on the observable outcome, not on the crawl's first request: the
    // crawl commits to the cache many turns after /user comes back.
    await vi.waitFor(async () => {
      expect(await fetchGitHubStats()).not.toBe(fresh);
    });
    expect(api.crawlCount()).toBe(2);
  });

  it("keeps serving stale data while the revalidation is still running", async () => {
    const api = mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();
    const fresh = await fetchGitHubStats();

    // Second crawl blocks, so the revalidation stays in flight.
    const gate = deferred();
    api.fetchMock.mockImplementationOnce(async () => {
      await gate.promise;
      return json({ login: "nub-coders", avatar_url: "a", html_url: "h" });
    });

    vi.setSystemTime(Date.now() + CACHE_TTL_MS + 1);
    expect(await fetchGitHubStats()).toBe(fresh);
    expect(api.crawlCount()).toBe(2);

    // Further callers must neither wait nor pile on more crawls.
    expect(await fetchGitHubStats()).toBe(fresh);
    expect(await fetchGitHubStats()).toBe(fresh);
    expect(api.crawlCount()).toBe(2);

    gate.resolve();
    await vi.waitFor(async () => {
      expect(await fetchGitHubStats()).not.toBe(fresh);
    });
    expect(api.crawlCount()).toBe(2);
  });

  it("falls back to stale data when a forced crawl fails", async () => {
    const api = mockGitHubAPI();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetchGitHubStats } = await loadModule();
    const fresh = await fetchGitHubStats();

    api.fetchMock.mockImplementationOnce(async () => {
      throw new Error("ECONNRESET");
    });

    await expect(fetchGitHubStats(true)).resolves.toBe(fresh);
    expect(warn).toHaveBeenCalled();
  });

  it("does not leave an unhandled rejection when a background revalidation fails", async () => {
    const api = mockGitHubAPI();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { fetchGitHubStats } = await loadModule();
    const fresh = await fetchGitHubStats();

    api.fetchMock.mockImplementationOnce(async () => {
      throw new Error("background boom");
    });

    vi.setSystemTime(Date.now() + CACHE_TTL_MS + 1);
    expect(await fetchGitHubStats()).toBe(fresh);

    await vi.waitFor(() => expect(error).toHaveBeenCalled());
    expect(String(error.mock.calls[0][0])).toContain("background revalidation failed");

    // The stale entry survives a failed refresh, and the next call can retry.
    expect(await fetchGitHubStats()).toBe(fresh);
  });
});

describe("fetchGitHubStats without a token", () => {
  it("fetches stats without requiring GITHUB_TOKEN", async () => {
    mockGitHubAPI();
    delete process.env.GITHUB_TOKEN;
    const { fetchGitHubStats } = await loadModule();

    const stats = await fetchGitHubStats();
    expect(stats.username).toBe("nub-coders");
  });

  it("serves the cache if the token disappears after a successful crawl", async () => {
    mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();
    const fresh: GitHubStats = await fetchGitHubStats();

    delete process.env.GITHUB_TOKEN;
    vi.setSystemTime(Date.now() + CACHE_TTL_MS + 1);

    expect(await fetchGitHubStats()).toBe(fresh);
  });
});

describe("crawl output", () => {
  it("excludes private repos from the aggregate stats", async () => {
    mockGitHubAPI();
    const { fetchGitHubStats } = await loadModule();

    const stats = await fetchGitHubStats();

    // Two repos returned, one private: only the public one may contribute.
    expect(stats.totalRepos).toBe(1);
    expect(stats.publicRepos).toBe(1);
    expect(stats.totalStars).toBe(3);
    expect(stats.topLanguages.map((l) => l.name)).toEqual(["TypeScript", "CSS"]);
  });
});
