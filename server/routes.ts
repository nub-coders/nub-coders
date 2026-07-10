import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import contactRouter from './contact';
import { fetchGitHubStats } from './github';
import { getStreakStatsSVG } from './streak-stats';
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
        if (m.includes("GITHUB_TOKEN")) return "GitHub token is not configured.";
        if (m.includes("invalid or expired")) return "GitHub token is invalid or expired.";
        if (m.includes("rate limit")) return "GitHub rate limit reached. Try again later.";
        if (m.includes("timeout")) return "GitHub API timed out. Try again shortly.";
        if (m.includes("scopes")) return "GitHub token is missing required scopes.";
        return "Failed to fetch GitHub stats. Please try again later.";
      })();

      res.status(503).json({ message });
    }
  });

  app.use(contactRouter);

  // ── Streak Stats SVG ────────────────────────────────────────────────────────
  app.get("/api/github/streak-stats.svg", async (_req: Request, res: Response) => {
    try {
      const svg = await getStreakStatsSVG();
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=600");
      res.send(svg);
    } catch (err: any) {
      console.error("[Streak Stats]", err?.message ?? err);
      res.status(503).setHeader("Content-Type", "image/svg+xml").send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195">
          <rect width="495" height="195" rx="4.5" fill="#0d1117" stroke="#6e40c9" stroke-opacity="0.4"/>
          <text x="247.5" y="105" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, sans-serif" font-size="14">Streak stats temporarily unavailable</text>
        </svg>`
      );
    }
  });

  // ── Contribution Graph SVG ──────────────────────────────────────────────────
  app.get("/api/github/contribution-graph.svg", async (_req: Request, res: Response) => {
    try {
      const svg = await getContributionGraphSVG();
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=600");
      res.send(svg);
    } catch (err: any) {
      console.error("[Contribution Graph]", err?.message ?? err);
      res.status(503).setHeader("Content-Type", "image/svg+xml").send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="320" viewBox="0 0 850 320">
          <rect width="850" height="320" rx="6" fill="#0d1117"/>
          <text x="425" y="165" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, sans-serif" font-size="14">Contribution graph temporarily unavailable</text>
        </svg>`
      );
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
