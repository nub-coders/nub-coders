import express, { type Express, type Response } from "express";
import fs from "fs";
import path from "path";
import { fetchGitHubStats } from "./github";
import { clientConfigScript } from "./client-config";

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

  // `index: false` below only disables directory-index resolution for "/" — an
  // explicit GET /index.html still matches the file on disk and would be served
  // raw by express.static: no stats injection, no window.__APP_CONFIG__ (so the
  // contact form's Turnstile widget never renders and every submission is
  // rejected server-side), and no CSP nonce on its <script> tags. Under the
  // production policy that last one is fatal rather than cosmetic: CSP3 makes
  // 'strict-dynamic' suppress host sources like 'self', so an un-nonced bundle
  // tag is blocked and the page renders blank.
  //
  // Redirecting also consolidates SEO onto the canonical URL the document
  // already declares (<link rel="canonical" href="https://nubcoders.com/">)
  // instead of serving the same page under two addresses.
  app.get("/index.html", (req, res) => {
    const query = req.originalUrl.split("?")[1];
    res.redirect(301, query ? `/?${query}` : "/");
  });

  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    index: false,
    setHeaders(res, filePath) {
      // Vite fingerprints asset filenames, so a year is safe for them — but it is
      // never safe for HTML. public/ ships a Google site-verification document,
      // and a long max-age there would pin a stale copy across deploys with no
      // way to bust it.
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }));

  app.use("*", async (req, res: Response, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      const nonce = res.locals.cspNonce as string;
      const withStats = await injectGitHubStats(template, nonce);
      const withConfig = withStats.replace("</head>", `${clientConfigScript(nonce)}</head>`);
      const html = applyNonce(withConfig, nonce);
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
