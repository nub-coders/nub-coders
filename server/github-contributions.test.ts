// @vitest-environment node
/**
 * The contributions GraphQL call is the shared single-flight for both SVG
 * endpoints and the background refresher, so it had the worst possible place for
 * a missing timeout: one stalled connection would hang every consumer
 * indefinitely. These tests pin the AbortController budget in place.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const TIMEOUT_MS = 15_000;

/** Fresh module instance, so the contributions cache starts empty. */
async function loadModule() {
  vi.resetModules();
  return import("./github-contributions");
}

/** A request that never settles on its own — only an abort can end it. */
function hangingFetch() {
  return vi.fn(
    (_url: unknown, init: any) =>
      new Promise<Response>((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          reject(Object.assign(new Error("The operation was aborted"), { name: "AbortError" }));
        });
      }),
  );
}

function calendarResponse() {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              weeks: [{ contributionDays: [{ contributionCount: 2, date: "2026-01-01" }] }],
            },
          },
        },
      },
    }),
  } as unknown as Response;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchContributions request timeout", () => {
  it("passes an abort signal to the GraphQL request", async () => {
    const fetchMock = vi.fn(async () => calendarResponse());
    vi.stubGlobal("fetch", fetchMock);
    const { fetchContributions } = await loadModule();

    await fetchContributions("test-token", "nub-coders");

    const init = fetchMock.mock.calls[0][1] as any;
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.method).toBe("POST");
  });

  it("aborts a stalled request instead of hanging forever", async () => {
    vi.stubGlobal("fetch", hangingFetch());
    const { fetchContributions } = await loadModule();

    const pending = fetchContributions("test-token", "nub-coders");
    // Assert on the rejection before advancing, so the handler is already attached.
    const assertion = expect(pending).rejects.toThrow(
      `GitHub GraphQL API timeout after ${TIMEOUT_MS}ms`,
    );

    await vi.advanceTimersByTimeAsync(TIMEOUT_MS);
    await assertion;
  });

  it("does not abort before the budget is spent", async () => {
    vi.stubGlobal("fetch", hangingFetch());
    const { fetchContributions } = await loadModule();

    let settled = false;
    const pending = fetchContributions("test-token", "nub-coders").catch(() => {
      settled = true;
    });

    await vi.advanceTimersByTimeAsync(TIMEOUT_MS - 1);
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(settled).toBe(true);
  });

  it("clears the abort timer on success so nothing keeps the event loop alive", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => calendarResponse()));
    const { fetchContributions } = await loadModule();

    await fetchContributions("test-token", "nub-coders");

    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears the abort timer when the request rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNRESET");
      }),
    );
    const { fetchContributions } = await loadModule();

    // A non-abort failure propagates unchanged, not disguised as a timeout.
    await expect(fetchContributions("test-token", "nub-coders")).rejects.toThrow("ECONNRESET");
    expect(vi.getTimerCount()).toBe(0);
  });
});
