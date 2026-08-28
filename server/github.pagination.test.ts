// @vitest-environment node
/**
 * Regression tests for `paginate`'s page cap.
 *
 * The pre-fix loop was `while (nextUrl)` over a `const` that was never
 * reassigned and never read in the body — effectively `while (true)`. A Link
 * header that always advertised rel="next" would have spun forever, burning the
 * API quota. If that regresses, the first test here fails on vitest's 5s
 * timeout rather than hanging the suite indefinitely.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { paginate } from "./github";

const MAX_PAGES = 10;
const HEADERS = { Authorization: "token test" };
const ENDPOINT = "https://api.github.com/user/repos";

/**
 * A minimal stand-in for the parts of `Response` that `ghFetch`/`paginate`
 * touch. Deliberately omits `x-ratelimit-remaining`: `ghFetch` defaults it to
 * "999", so the rate-limit floor guard stays out of the way.
 */
function ghResponse(
  body: unknown,
  { status = 200, link }: { status?: number; link?: string } = {},
) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(link ? { link } : {}),
    json: async () => body,
  } as unknown as Response;
}

const nextLink = '<https://api.github.com/user/repos?page=2>; rel="next"';

/** The page number `paginate` asked for, parsed out of a recorded call. */
function requestedPages(fetchMock: ReturnType<typeof vi.fn>): number[] {
  return fetchMock.mock.calls.map((call) =>
    Number(new URL(String(call[0])).searchParams.get("page")),
  );
}

let fetchMock: ReturnType<typeof vi.fn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  warnSpy.mockRestore();
});

describe("paginate page cap", () => {
  it("stops at MAX_PAGES when the Link header always advertises rel=next", async () => {
    // Every page claims there's another one. Only the cap can end this.
    fetchMock.mockImplementation(async () =>
      ghResponse([{ id: 1 }, { id: 2 }], { link: nextLink }),
    );

    const results = await paginate(ENDPOINT, HEADERS);

    expect(fetchMock).toHaveBeenCalledTimes(MAX_PAGES);
    expect(results).toHaveLength(MAX_PAGES * 2);
    expect(requestedPages(fetchMock)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("warns exactly once when it truncates at the cap", async () => {
    fetchMock.mockImplementation(async () =>
      ghResponse([{ id: 1 }], { link: nextLink }),
    );

    await paginate(ENDPOINT, HEADERS);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0][0])).toContain("pagination cap");
  });

  it("does not warn when pagination finishes on its own", async () => {
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 1 }], { link: nextLink }));
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 2 }])); // no rel="next"

    const results = await paginate(ENDPOINT, HEADERS);

    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe("paginate termination conditions", () => {
  it("stops when no rel=next is advertised", async () => {
    fetchMock.mockResolvedValue(ghResponse([{ id: 1 }]));

    await expect(paginate(ENDPOINT, HEADERS)).resolves.toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops on a non-ok response and keeps what it already collected", async () => {
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 1 }], { link: nextLink }));
    // 403, not 429/503/5xx — those paths sleep and retry.
    fetchMock.mockResolvedValueOnce(ghResponse({ message: "Forbidden" }, { status: 403 }));

    const results = await paginate(ENDPOINT, HEADERS);

    expect(results).toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("stops on an empty page", async () => {
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 1 }], { link: nextLink }));
    fetchMock.mockResolvedValueOnce(ghResponse([], { link: nextLink }));

    const results = await paginate(ENDPOINT, HEADERS);

    expect(results).toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("degrades to the collected results when the body is not an array", async () => {
    // Pre-fix this spread threw a TypeError instead of returning cleanly.
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 1 }], { link: nextLink }));
    fetchMock.mockResolvedValueOnce(
      ghResponse({ message: "API rate limit exceeded" }, { link: nextLink }),
    );

    await expect(paginate(ENDPOINT, HEADERS)).resolves.toEqual([{ id: 1 }]);
  });
});

describe("paginate request URLs", () => {
  it("appends its params with ? when the endpoint has no query string", async () => {
    fetchMock.mockResolvedValue(ghResponse([{ id: 1 }]));

    await paginate(ENDPOINT, HEADERS);

    expect(fetchMock.mock.calls[0][0]).toBe(`${ENDPOINT}?per_page=100&page=1`);
  });

  it("appends its params with & when the endpoint already has a query string", async () => {
    fetchMock.mockResolvedValue(ghResponse([{ id: 1 }]));

    await paginate(`${ENDPOINT}?type=owner`, HEADERS);

    expect(fetchMock.mock.calls[0][0]).toBe(`${ENDPOINT}?type=owner&per_page=100&page=1`);
  });

  it("forwards the auth headers on every request", async () => {
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 1 }], { link: nextLink }));
    fetchMock.mockResolvedValueOnce(ghResponse([{ id: 2 }]));

    await paginate(ENDPOINT, HEADERS);

    for (const call of fetchMock.mock.calls) {
      expect(call[1]).toMatchObject({ headers: HEADERS });
    }
  });
});
