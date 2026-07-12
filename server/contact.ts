import express, { type Request, type Response } from "express";

const router = express.Router();

const EMAIL_API_URL = process.env.EMAIL_API_URL || "https://mails.nubcoders.com/api/emails/send-api";
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "support@nubcoders.com";
const TO_EMAIL = process.env.EMAIL_TO || "nubcoders@gmail.com";

// ── Minimal in-memory per-IP rate limiter (no external dependency) ──────────
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const MAX_LEN = { name: 100, email: 200, subject: 200, message: 5000 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

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
  const message = clean(req.body?.message, MAX_LEN.message);

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email format" });
  }

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
    });

    if (!ownerResponse.ok) {
      return res.status(502).json({ success: false, error: "Failed to send message. Please try again later." });
    }

    res.json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("[Contact]", error instanceof Error ? error.message : error);
    res.status(500).json({ success: false, error: "An error occurred while sending your message" });
  }
});

export default router;
