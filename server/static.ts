import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fetchGitHubStats } from "./github";

function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function injectGitHubStats(template: string) {
  try {
    const stats = await fetchGitHubStats();
    const payload = `<script>window.__GITHUB_STATS__ = ${escapeJsonForHtml(stats)};</script>`;
    return template.replace("</head>", `${payload}</head>`);
  } catch (error) {
    console.warn(`Unable to inject GitHub stats: ${(error as Error).message}`);
    return template.replace(
      "</head>",
      `<script>window.__GITHUB_STATS__ = null;</script></head>`,
    );
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
  }));

  app.use("*", async (_req, res, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      const html = await injectGitHubStats(template);
      res.status(200).type("html").send(html);
    } catch (error) {
      next(error);
    }
  });
}
