import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import contactRouter from './contact';
import { fetchGitHubStats } from './github';

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

  app.use(contactRouter);

  const httpServer = createServer(app);
  return httpServer;
}
