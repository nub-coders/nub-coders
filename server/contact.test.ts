// @vitest-environment node
/**
 * Contact endpoint: input sanitisation and the in-memory rate limiter.
 *
 * Both live in module state with no reset hook, so every test re-imports the
 * module through `vi.resetModules()`.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import http from "http";
import type { AddressInfo } from "net";

// Captured before any stubbing so the test client can still reach the loopback
// server after `global.fetch` is replaced by the mail-API mock.
const realFetch = globalThis.fetch.bind(globalThis);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_IPS = 10_000;
const MAIL_URL = "https://mail.test/api/send";

async function loadModule() {
  vi.resetModules();
  return import("./contact");
}

const servers: http.Server[] = [];

/** Mounts the real router the way server/index.ts does and starts it on a free port. */
async function startServer(router: express.Router): Promise<string> {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(router);

  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

function post(base: string, body: unknown, ip = "203.0.113.7") {
  return realFetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    body: JSON.stringify(body),
  });
}

const validSubmission = {
  name: "Ankit",
  email: "someone@example.com",
  subject: "Hello",
  message: "Hi there",
};

/** Stubs the outbound mail API and returns the captured request bodies. */
function stubMailAPI() {
  const sent: { subject: string; text: string; to: string }[] = [];
  const inits: any[] = [];

  const fetchMock = vi.fn(async (_url: unknown, init: any) => {
    inits.push(init);
    sent.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ ok: true }) } as unknown as Response;
  });

  vi.stubGlobal("fetch", fetchMock);
  return { sent, inits, fetchMock };
}

beforeEach(() => {
  // Keep the Turnstile bypass deterministic: it only fails closed in production.
  delete process.env.TURNSTILE_SECRET_KEY;
  process.env.EMAIL_API_URL = MAIL_URL;
  vi.useFakeTimers({ toFake: ["Date"] }); // real setTimeout: sockets and abort timers must stay live
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.EMAIL_API_URL;
  await Promise.all(
    servers.splice(0).map((s) => new Promise<void>((resolve) => s.close(() => resolve()))),
  );
});

describe("clean", () => {
  it("strips CR and LF from single-line fields", async () => {
    const { clean } = await loadModule();

    const injected = clean("Project enquiry\r\nBcc: evil@example.com", 200);

    expect(injected).not.toMatch(/[\r\n]/);
    expect(injected).toBe("Project enquiry Bcc: evil@example.com");
  });

  it("strips NUL, DEL and other C0 controls", async () => {
    const { clean } = await loadModule();

    expect(clean("a\u0000b\u007Fc\u001Bd", 200)).toBe("a b c d");
  });

  it("keeps line breaks and tabs in multiline mode", async () => {
    const { clean } = await loadModule();

    expect(clean("line one\nline two\tindented", 5000, true)).toBe("line one\nline two\tindented");
  });

  it("still removes non-whitespace controls in multiline mode", async () => {
    const { clean } = await loadModule();

    expect(clean("body\u0000text\nsecond", 5000, true)).toBe("bodytext\nsecond");
  });

  it("strips before slicing so the cap can't leave a control character behind", async () => {
    const { clean } = await loadModule();

    // Slicing first would yield "ab\u0000c" — a control character inside the cap.
    expect(clean("ab\u0000cd", 4)).toBe("ab cd".slice(0, 4));
    expect(clean("ab\u0000cd", 4)).not.toContain("\u0000");
  });

  it("trims and caps length", async () => {
    const { clean } = await loadModule();

    expect(clean("   padded   ", 200)).toBe("padded");
    expect(clean("x".repeat(500), 100)).toHaveLength(100);
  });

  it("returns an empty string for anything that isn't a string", async () => {
    const { clean } = await loadModule();

    for (const value of [undefined, null, 42, {}, [], true]) {
      expect(clean(value, 200)).toBe("");
    }
  });
});

describe("isRateLimited", () => {
  it("allows exactly RATE_LIMIT_MAX requests per window, then blocks", async () => {
    const { isRateLimited } = await loadModule();

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(isRateLimited("198.51.100.1")).toBe(false);
    }
    expect(isRateLimited("198.51.100.1")).toBe(true);
    expect(isRateLimited("198.51.100.1")).toBe(true);
  });

  it("counts each IP separately", async () => {
    const { isRateLimited } = await loadModule();

    for (let i = 0; i < RATE_LIMIT_MAX; i++) isRateLimited("198.51.100.1");

    expect(isRateLimited("198.51.100.1")).toBe(true);
    expect(isRateLimited("198.51.100.2")).toBe(false);
  });

  it("lets an IP through again once its window has passed", async () => {
    const { isRateLimited } = await loadModule();

    for (let i = 0; i < RATE_LIMIT_MAX; i++) isRateLimited("198.51.100.1");
    expect(isRateLimited("198.51.100.1")).toBe(true);

    vi.setSystemTime(Date.now() + RATE_LIMIT_WINDOW_MS + 1);
    expect(isRateLimited("198.51.100.1")).toBe(false);
  });

  it("forgets IPs whose window has expired instead of holding them forever", async () => {
    const { isRateLimited, trackedIpCount } = await loadModule();

    isRateLimited("198.51.100.1");
    expect(trackedIpCount()).toBe(1);

    // Past the window and past the sweep interval, so the next request sweeps.
    vi.setSystemTime(Date.now() + RATE_LIMIT_WINDOW_MS + 1);
    isRateLimited("198.51.100.2");

    // The stale entry is gone, not merely filtered down to an empty array.
    expect(trackedIpCount()).toBe(1);
  });

  it("caps the number of tracked IPs", async () => {
    const { isRateLimited, trackedIpCount } = await loadModule();

    for (let i = 0; i < RATE_LIMIT_MAX_IPS + 100; i++) {
      isRateLimited(`10.0.${Math.floor(i / 256)}.${i % 256}`);
    }

    expect(trackedIpCount()).toBeLessThanOrEqual(RATE_LIMIT_MAX_IPS);
  });

  it("evicts the least recently active IP, not the most recent one", async () => {
    const { isRateLimited, trackedIpCount } = await loadModule();
    const keep = "198.51.100.99";

    // Spend `keep`'s allowance, so it is blocked as long as it stays tracked.
    for (let i = 0; i < RATE_LIMIT_MAX; i++) isRateLimited(keep);
    expect(isRateLimited(keep)).toBe(true);

    // Flood, touch `keep` halfway through, then flood past the cap.
    for (let i = 0; i < 5000; i++) isRateLimited(`10.1.${Math.floor(i / 256)}.${i % 256}`);
    isRateLimited(keep);
    for (let i = 0; i < 5200; i++) isRateLimited(`10.2.${Math.floor(i / 256)}.${i % 256}`);

    expect(trackedIpCount()).toBeLessThanOrEqual(RATE_LIMIT_MAX_IPS);
    // Still blocked: recency kept it while older entries were evicted.
    expect(isRateLimited(keep)).toBe(true);
  });
});

describe("POST /api/contact sanitisation", () => {
  it("never lets CRLF reach the outbound mail subject", async () => {
    const mail = stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);

    const res = await post(base, {
      ...validSubmission,
      subject: "Enquiry\r\nBcc: evil@example.com",
    });

    expect(res.status).toBe(200);
    expect(mail.sent).toHaveLength(1);
    expect(mail.sent[0].subject).toBe("Contact Form: Enquiry Bcc: evil@example.com");
    expect(mail.sent[0].subject).not.toMatch(/[\r\n]/);
  });

  it("keeps the message body's own line breaks", async () => {
    const mail = stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);

    await post(base, { ...validSubmission, message: "first line\nsecond line" });

    expect(mail.sent[0].text).toContain("first line\nsecond line");
  });

  it("rejects an email address that only looks valid once CRLF is stripped", async () => {
    const mail = stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);

    const res = await post(base, {
      ...validSubmission,
      email: "someone@example.com\r\nBcc: evil@example.com",
    });

    expect(res.status).toBe(400);
    expect(mail.fetchMock).not.toHaveBeenCalled();
  });

  it("sends the mail request with an abort signal", async () => {
    const mail = stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);

    await post(base, validSubmission);

    expect(mail.inits[0].signal).toBeInstanceOf(AbortSignal);
  });

  it("answers 504 when the mail API aborts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw Object.assign(new Error("The operation was aborted"), { name: "AbortError" });
      }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    const mod = await loadModule();
    const base = await startServer(mod.default);

    const res = await post(base, validSubmission);

    expect(res.status).toBe(504);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });
});

describe("POST /api/contact rate limiting", () => {
  it("returns 429 on the sixth request and sends no mail", async () => {
    const mail = stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);
    const ip = "203.0.113.50";

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect((await post(base, validSubmission, ip)).status).toBe(200);
    }

    const blocked = await post(base, validSubmission, ip);

    expect(blocked.status).toBe(429);
    // Five accepted submissions, five mail calls: the blocked one cost nothing.
    expect(mail.fetchMock).toHaveBeenCalledTimes(RATE_LIMIT_MAX);
  });

  it("limits per client IP, using the proxy-resolved address", async () => {
    stubMailAPI();
    const mod = await loadModule();
    const base = await startServer(mod.default);

    for (let i = 0; i < RATE_LIMIT_MAX; i++) await post(base, validSubmission, "203.0.113.60");

    expect((await post(base, validSubmission, "203.0.113.60")).status).toBe(429);
    expect((await post(base, validSubmission, "203.0.113.61")).status).toBe(200);
  });
});
