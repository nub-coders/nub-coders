import 'dotenv/config';
import { randomBytes } from "crypto";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";
import { startGitHubRefresher } from "./github";
import compression from "compression";

const app = express();
// Express advertises itself in every response by default. It tells an attacker
// which stack to target and buys nothing.
app.disable("x-powered-by");
// Behind one reverse proxy (Traefik). Trust exactly one hop so req.ip is the
// proxy-appended client IP — a client-supplied X-Forwarded-For can't spoof it.
app.set("trust proxy", 1);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers middleware
app.use((_req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Per-request nonce — attached to every inline <script> by serveStatic so the
  // production CSP can drop 'unsafe-inline'/'unsafe-eval'. Dev keeps the loose
  // policy because Vite's HMR client relies on eval + inline scripts.
  const nonce = randomBytes(16).toString("base64");
  res.locals.cspNonce = nonce;

  // 'strict-dynamic' lets a nonce'd script (e.g. gtag loader) pull its own
  // children without host allowlists; 'https:' is the fallback older browsers
  // use when they ignore strict-dynamic. Dev has no strict-dynamic, so the
  // Turnstile host is listed explicitly there.
  const scriptSrc = isProd
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com challenges.cloudflare.com";

  // Content Security Policy — origins match what the page actually loads
  // (Google Analytics, Google Fonts, cdnjs Font Awesome fallback).
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      scriptSrc,
      // style-src keeps 'unsafe-inline': React injects inline styles and nonces
      // don't apply to style attributes. Style-injection XSS is low-severity.
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com",
      "font-src 'self' fonts.gstatic.com cdnjs.cloudflare.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https: www.google-analytics.com",
      // Turnstile renders its challenge in an iframe from this host; without an
      // explicit frame-src it would fall back to default-src 'self' and break.
      "frame-src challenges.cloudflare.com",
      "frame-ancestors 'self'",
      "form-action 'self'",
      // Without base-uri an injected <base> tag can silently repoint every
      // relative URL on the page, including the script srcs above.
      "base-uri 'self'",
      // Nothing here uses <object>/<embed>/<applet>; they'd otherwise inherit
      // default-src 'self' and stay a live plugin vector.
      "object-src 'none'",
    ].join("; ") + ";"
  );

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Enforce HTTPS (only in production)
  if (isProd) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});

// A rejected promise with no handler terminates the process on Node 15+. For a
// site whose background refreshers are all network calls, dropping the whole
// server over one failed fetch is the wrong trade: log it and keep serving. The
// cost is that a genuine bug can now hide in the logs, so this stays loud.
process.on("unhandledRejection", (reason) => {
  console.error(
    "[UnhandledRejection]",
    reason instanceof Error ? (reason.stack ?? reason.message) : reason,
  );
});

(async () => {
  const server = await registerRoutes(app);

  // Start periodic refresh of GitHub stats cache. Interval (minutes) can be
  // configured via `GITHUB_STATS_REFRESH_MINUTES` (defaults to 10).
  let stopRefresher: (() => void) | undefined;
  try {
    const minutes = Number(process.env.GITHUB_STATS_REFRESH_MINUTES) || 10;
    stopRefresher = startGitHubRefresher(minutes);
    log(`GitHub stats refresher started (every ${minutes}m)`);
  } catch (err: any) {
    console.error("Failed to start GitHub refresher:", err?.message ?? err);
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Registered LAST: Express matches middleware in order, so an error handler
  // mounted above the Vite/static catch-alls would never see their next(err) —
  // those failures would fall through to Express's finalhandler, which returns a
  // full stack trace whenever NODE_ENV isn't "production".
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;

    // Log server-side; do NOT re-throw after responding (that crashes the process).
    console.error("[Unhandled]", err?.stack ?? err?.message ?? err);

    // Only echo the message for client errors. Server-side messages can carry
    // internals (e.g. absolute build paths from serveStatic).
    const message = status < 500 ? err.message || "Request failed" : "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // Serve the app on port 8080
  // this serves both the API and the client.
  const port = 8080;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown. Attaching these listeners replaces Node's default
  // terminate action, so the exit is ours to perform: stop the refresher, let
  // in-flight requests drain, then exit. Without the explicit close() the
  // listening socket keeps the event loop alive and `docker stop` waits out the
  // grace period before SIGKILL, dropping live requests.
  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log(`${signal} received — shutting down`);
    stopRefresher?.();

    const forceExit = setTimeout(() => {
      console.error("[Shutdown] connections did not drain in time — forcing exit");
      process.exit(1);
    }, 10_000);
    forceExit.unref();

    server.close((err) => {
      clearTimeout(forceExit);
      if (err) {
        console.error("[Shutdown]", err.message);
        process.exit(1);
      }
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})().catch((err: any) => {
  // serveStatic throws synchronously when dist/public is missing; without this
  // the bootstrap fails as a bare unhandled rejection with no usable log.
  console.error("[Fatal] failed to start server:", err?.stack ?? err?.message ?? err);
  process.exit(1);
});
