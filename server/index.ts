import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";
import { startGitHubRefresher } from "./github";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Content Security Policy — origins match what the page actually loads
  // (Google Analytics, Google Fonts, cdnjs Font Awesome fallback).
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com",
      "font-src 'self' fonts.gstatic.com cdnjs.cloudflare.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https: www.google-analytics.com",
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join("; ") + ";"
  );
  
  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Enforce HTTPS (only in production)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  
  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Start periodic refresh of GitHub stats cache. Interval (minutes) can be
  // configured via `GITHUB_STATS_REFRESH_MINUTES` (defaults to 10).
  try {
    const minutes = Number(process.env.GITHUB_STATS_REFRESH_MINUTES) || 10;
    startGitHubRefresher(minutes);
    log(`GitHub stats refresher started (every ${minutes}m)`);
  } catch (err: any) {
    console.error("Failed to start GitHub refresher:", err?.message ?? err);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log server-side; do NOT re-throw after responding (that crashes the process).
    console.error("[Unhandled]", err?.stack ?? err?.message ?? err);

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

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
})();
