import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Express } from "express";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fetchGitHubStats } from "./github";

const viteLogger = createLogger();

function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function injectGitHubStats(template: string) {
  try {
    const stats = await fetchGitHubStats();
    const payload = `<script>window.__GITHUB_STATS__ = ${escapeJsonForHtml(stats)};</script>`;
    return template.replace("</head>", `${payload}</head>`);
  } catch (error) {
    viteLogger.warn(`Unable to inject GitHub stats: ${(error as Error).message}`);
    return template.replace(
      "</head>",
      `<script>window.__GITHUB_STATS__ = null;</script></head>`,
    );
  }
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      template = await injectGitHubStats(template);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
