import express, { type Express, type Response } from "express";
import fs from "fs";
import path from "path";
import { fetchGitHubStats } from "./github";

function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Stamp every <script> tag with the request's CSP nonce so the production
 * policy (script-src 'nonce-…' 'strict-dynamic') allows the GA loader, the
 * ld+json block, the injected stats, and the Vite module bundle to run.
 */
function applyNonce(html: string, nonce: string) {
  return html.replace(/<script(?![^>]*\bnonce=)/g, `<script nonce="${nonce}"`);
}

async function injectGitHubStats(template: string, nonce: string) {
  try {
    const stats = await fetchGitHubStats();
    const payload = `<script nonce="${nonce}">window.__GITHUB_STATS__ = ${escapeJsonForHtml(stats)};</script>`;
    return template.replace("</head>", `${payload}</head>`);
  } catch (error) {
    console.warn(`Unable to inject GitHub stats: ${(error as Error).message}`);
    return template.replace(
      "</head>",
      `<script nonce="${nonce}">window.__GITHUB_STATS__ = null;</script></head>`,
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

  // `index: false` — never let express.static serve index.html directly. It
  // must fall through to the catch-all below so every response gets the stats
  // injection and a fresh per-request CSP nonce on its <script> tags.
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    index: false,
  }));

  app.use("*", async (req, res: Response, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      const nonce = res.locals.cspNonce as string;
      const withStats = await injectGitHubStats(template, nonce);
      const html = applyNonce(withStats, nonce);
      // Real assets are served by express.static above; anything else reaching
      // here is a client route. Only "/" exists — everything else renders the
      // NotFound page, so send a real 404 (not a soft-200) for crawlers.
      const status = req.originalUrl.split("?")[0] === "/" ? 200 : 404;
      res.status(status).type("html").send(html);
    } catch (error) {
      next(error);
    }
  });
}
