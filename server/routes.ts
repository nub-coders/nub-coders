import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import contactRouter from './contact';
import { fetchGitHubStats } from './github';
import { getStreakCapsulesSVG } from './streak-stats';
import { getContributionGraphSVG } from './contribution-graph';

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Health check ──────────────────────────────────────────────────────────
  // Lightweight liveness probe for Docker/orchestrators. No external calls.
  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  // ── GitHub Stats ──────────────────────────────────────────────────────────
  // Same handler on both paths: /api/github/stats (client) and /stats (external tooling).
  app.get(["/api/github/stats", "/stats"], async (_req: Request, res: Response) => {
    try {
      const stats = await fetchGitHubStats();
      res.json(stats);
    } catch (err: any) {
      // Log full error server-side, never leak token or internal details
      console.error("[GitHub Stats]", err?.message ?? err);

      const message: string = (() => {
        const m: string = err?.message ?? "";
        if (m.includes("rate limit")) return "GitHub rate limit reached. Try again later.";
        if (m.includes("timeout")) return "GitHub API timed out. Try again shortly.";
        return "Failed to fetch GitHub stats. Please try again later.";
      })();

      res.status(503).json({ message });
    }
  });

  app.use(contactRouter);


  const SVG_CACHE_CONTROL = "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400";

  // ── Streak Capsules SVG ─────────────────────────────────────────────────────
  app.get("/api/github/streak-capsules.svg", async (_req: Request, res: Response) => {
    try {
      const svg = await getStreakCapsulesSVG();
      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
      res.setHeader("Cache-Control", SVG_CACHE_CONTROL);
      res.send(svg);
    } catch (err: any) {
      console.error("[Streak Capsules]", err?.message ?? err);
      res.status(503).setHeader("Content-Type", "image/svg+xml; charset=utf-8").setHeader("Cache-Control", "no-cache").send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="28" viewBox="0 0 620 28">
          <rect x="0.5" y="0.5" width="619" height="27" fill="#1a1a1f" stroke="#2a2a3a"/>
          <text x="310" y="14.5" text-anchor="middle" dominant-baseline="middle" fill="#c9c9d4" font-family="ui-monospace, monospace" font-size="11">Streak stats temporarily unavailable</text>
        </svg>`
      );
    }
  });

  // ── Contribution Graph SVG ──────────────────────────────────────────────────
  app.get("/api/github/contribution-graph.svg", async (_req: Request, res: Response) => {
    try {
      const svg = await getContributionGraphSVG();
      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
      res.setHeader("Cache-Control", SVG_CACHE_CONTROL);
      res.send(svg);
    } catch (err: any) {
      console.error("[Contribution Graph]", err?.message ?? err);
      res.status(503).setHeader("Content-Type", "image/svg+xml; charset=utf-8").setHeader("Cache-Control", "no-cache").send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="320" viewBox="0 0 850 320">
          <rect width="850" height="320" rx="6" fill="#0d1117"/>
          <text x="425" y="165" text-anchor="middle" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14">Contribution graph temporarily unavailable</text>
        </svg>`
      );
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
