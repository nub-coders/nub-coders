const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 10_000;

// Read lazily, never at module scope: esbuild's code splitting can evaluate
// this module before `import "dotenv/config"` runs in server/index.ts.
function secretKey(): string {
  return process.env.TURNSTILE_SECRET_KEY || "";
}

/** Turnstile is only enforced when a secret is configured. */
export function isTurnstileEnabled(): boolean {
  return Boolean(secretKey());
}

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: string; codes?: string[] };

type SiteVerifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  action?: string;
};

/**
 * Validates a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * The token is single-use and bound to the issuing site key; `remoteip` is the
 * proxy-resolved client IP (never a raw X-Forwarded-For value).
 */
export async function verifyTurnstile(token: unknown, remoteIp?: string): Promise<TurnstileResult> {
  const secret = secretKey();
  if (!secret) {
    // Fail CLOSED in production. A missing or typo'd TURNSTILE_SECRET_KEY must
    // never silently downgrade the contact endpoint to unauthenticated — the
    // client only hides the widget, it can't stop a direct POST.
    if (process.env.NODE_ENV === "production") {
      console.error("[Turnstile] TURNSTILE_SECRET_KEY is not set — refusing to accept submissions.");
      return { ok: false, reason: "not-configured" };
    }
    // Development keeps the bypass so the form works without Cloudflare creds.
    return { ok: true };
  }

  if (typeof token !== "string" || !token || token.length > 2048) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  // Cloudflare rejects placeholder IPs, so only forward a real address.
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: `siteverify-http-${response.status}` };
    }

    const result = (await response.json()) as SiteVerifyResponse;
    if (!result.success) {
      return { ok: false, reason: "rejected", codes: result["error-codes"] };
    }

    return { ok: true };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network-error" };
  } finally {
    clearTimeout(timer);
  }
}
