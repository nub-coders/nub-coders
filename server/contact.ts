import express, { type Request, type Response } from "express";
import { verifyTurnstile } from "./turnstile";

const router = express.Router();

const EMAIL_API_URL = process.env.EMAIL_API_URL || "https://mails.nubcoders.com/api/emails/send-api";
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "support@nubcoders.com";
const TO_EMAIL = process.env.EMAIL_TO || "nubcoders@gmail.com";

// ── Minimal in-memory per-IP rate limiter (no external dependency) ──────────
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
// Ceiling on tracked IPs. This map is the only structure here that grows with
// traffic rather than with the window, and a scanner walking a /16 would
// otherwise expand it without bound inside a 512 MB container.
const RATE_LIMIT_MAX_IPS = 10_000;
const SWEEP_INTERVAL_MS = 60 * 1000;

const hits = new Map<string, number[]>();
let lastSweepAt = 0;

/**
 * Drop IPs whose newest hit has aged out of the window. Runs inline, at most
 * once a minute: a setInterval would have to be unref'd and torn down on
 * shutdown, and this map only changes when a request arrives anyway.
 */
function sweep(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  // Collect first, delete after: mutating a Map mid-iteration is asking for it.
  const stale: string[] = [];
  hits.forEach((timestamps, key) => {
    const newest = timestamps[timestamps.length - 1] ?? 0;
    if (now - newest >= RATE_LIMIT_WINDOW_MS) stale.push(key);
  });
  for (const key of stale) hits.delete(key);
}

/**
 * Sliding window over *accepted* requests: `RATE_LIMIT_MAX` per window per IP.
 *
 * Exported for tests — the route below is the only production caller.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  sweep(now);

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT_MAX;

  // Rejected attempts are counted but not recorded. Appending them would let a
  // flood grow one array without bound and pay an O(n) filter on every hit.
  if (!limited) recent.push(now);

  // delete-then-set re-appends the key, so the Map's insertion order doubles as
  // a recency order and the eviction below is a true LRU.
  hits.delete(ip);
  hits.set(ip, recent);

  if (hits.size > RATE_LIMIT_MAX_IPS) {
    const overflow = hits.size - RATE_LIMIT_MAX_IPS;
    // forEach visits in insertion order, so the first entries are the least
    // recently active. Only `overflow` keys are collected, never the whole map.
    const evict: string[] = [];
    hits.forEach((_timestamps, key) => {
      if (evict.length < overflow) evict.push(key);
    });
    for (const key of evict) hits.delete(key);
  }

  return limited;
}

/** Number of IPs currently tracked. Exported so tests can pin the memory bound. */
export function trackedIpCount(): number {
  return hits.size;
}

const MAX_LEN = { name: 100, email: 200, subject: 200, message: 5000 };

// C0 controls plus DEL. CR and LF are the ones that matter: `subject` is
// interpolated into the outbound mail subject, so if the mail API ever writes
// that value into a raw header, an embedded CRLF could inject headers of its own
// (Bcc, Reply-To, a second body). Stripping here means that can't reach it.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL_CHARS = /[\u0000-\u001F\u007F]+/g;
// The same set minus tab, CR and LF — whitespace a multi-line body legitimately
// contains.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL_CHARS_KEEP_BREAKS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g;

/**
 * Coerce to a trimmed, length-capped string with control characters removed.
 * Stripping runs before the slice so the cap applies to the sanitized value.
 *
 * Exported for tests.
 */
export function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  const stripped = multiline
    ? value.replace(CONTROL_CHARS_KEEP_BREAKS, "")
    : value.replace(CONTROL_CHARS, " ");
  return stripped.trim().slice(0, max);
}

// Mail API budget. Express applies no request timeout of its own, so without
// this a stalled upstream would hold the client connection open indefinitely.
const EMAIL_TIMEOUT_MS = 15_000;

function apiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (EMAIL_API_KEY) headers["X-Api-Key"] = EMAIL_API_KEY;
  return headers;
}

router.post("/api/contact", async (req: Request, res: Response) => {
  // req.ip is the real client IP because the app sets `trust proxy: 1`.
  // Never parse X-Forwarded-For directly — its leftmost entry is client-spoofable.
  const ip = req.ip || "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: "Too many messages. Please try again later." });
  }

  const name = clean(req.body?.name, MAX_LEN.name);
  const email = clean(req.body?.email, MAX_LEN.email);
  const subject = clean(req.body?.subject, MAX_LEN.subject) || "No subject";
  const message = clean(req.body?.message, MAX_LEN.message, true);

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email format" });
  }

  // Bot check runs after the cheap local validation but before any outbound
  // email, so a failed challenge never costs an API call.
  const captcha = await verifyTurnstile(req.body?.turnstileToken, ip);
  if (!captcha.ok) {
    console.warn("[Contact] Turnstile", captcha.reason, captcha.codes?.join(",") ?? "");
    // An unreachable or unconfigured verification service is our fault, not the
    // visitor's: answer 503 so the form surfaces the direct-email fallback
    // instead of telling them to retry a challenge that can't succeed.
    const serverFault =
      captcha.reason === "timeout" ||
      captcha.reason === "network-error" ||
      captcha.reason === "not-configured";
    return res.status(serverFault ? 503 : 403).json({
      success: false,
      error: serverFault
        ? "Verification is temporarily unavailable. Please try again shortly."
        : "Verification failed. Please retry the challenge.",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  try {
    // Only notify the site owner. We deliberately do NOT send an auto-reply to
    // the submitted `email` — it's unverified, so doing so would let anyone use
    // this endpoint as a spam relay pointed at arbitrary third-party addresses.
    const ownerResponse = await fetch(EMAIL_API_URL, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Contact Form: ${subject}`,
        text: `New Contact Form Submission\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n`,
      }),
      signal: controller.signal,
    });

    if (!ownerResponse.ok) {
      return res.status(502).json({ success: false, error: "Failed to send message. Please try again later." });
    }

    res.json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error(
      "[Contact]",
      aborted
        ? `mail API timeout after ${EMAIL_TIMEOUT_MS}ms`
        : error instanceof Error
          ? error.message
          : error,
    );
    res.status(aborted ? 504 : 500).json({
      success: false,
      error: aborted
        ? "Sending timed out. Please try again shortly."
        : "An error occurred while sending your message",
    });
  } finally {
    clearTimeout(timer);
  }
});

export default router;
