import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import contactRouter from './contact';
import { fetchGitHubStats } from './github';
import { getStreakStatsSVG } from './streak-stats';

export async function registerRoutes(app: Express): Promise<Server> {
  // ── GitHub Stats ──────────────────────────────────────────────────────────
  app.get("/api/github/stats", async (_req: Request, res: Response) => {
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

  // Expose a simple `/stats` JSON endpoint for external tooling or health checks
  app.get("/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await fetchGitHubStats();
      res.json(stats);
    } catch (err: any) {
      console.error("[GitHub Stats /stats]", err?.message ?? err);
      res.status(503).json({ message: "Failed to fetch GitHub stats." });
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

  const httpServer = createServer(app);
  return httpServer;
}
