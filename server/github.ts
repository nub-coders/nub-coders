/**
 * GitHub Stats Fetcher
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches live stats from the GitHub REST API v3 (public + private repos).
 * Features:
 *   • Per-request timeout (AbortController)
 *   • Exponential-backoff retry with jitter (honours Retry-After on 429/503)
 *   • Rate-limit awareness — aborts early when budget is critically low
 *   • Safe error reporting — never leaks the raw token to the client
 *   • In-memory cache so repeated page loads don't hammer the API
 */

import { refreshStreakCapsulesSVG } from './streak-stats';
import { refreshContributionGraphSVG } from './contribution-graph';
import { refreshContributionsCache } from './github-contributions';

const BASE = "https://api.github.com";

// ── Cache ─────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cached: { data: GitHubStats; at: number } | null = null;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
}


export interface SkillEntry {
  name: string;
  proficiency: number; // 0–100, GitHub-derived
  category: "frontend" | "backend" | "devops" | "database" | "other";
}

// Minimal shape of the GitHub REST repo object — only the fields we read.
interface GitHubRepo {
  full_name: string;
  private: boolean;
  stargazers_count?: number;
  forks_count?: number;
}

export interface GitHubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  prsOpen: number;
  prsMerged: number;
  issuesOpen: number;
  issuesClosed: number;
  gists: number;
  topLanguages: LanguageStat[];
  skillsMap: SkillEntry[];  // derived from language bytes
  fetchedAt: string; // ISO timestamp
}

// ── Config ────────────────────────────────────────────────────────────────────
const TIMEOUT_MS = 15_000;   // 15 s per request
const MAX_RETRIES = 3;
const RATE_LIMIT_FLOOR = 10; // stop crawling while this many calls are still left
// Hard ceiling on pagination: 100 items/page x 10 = 1 000, far beyond any
// personal account's repo or gist count. Without it, termination depends purely
// on GitHub's Link header, and every extra repo page fans out into two more
// requests per repo downstream.
const MAX_PAGES = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Thrown when the remaining API budget drops under `RATE_LIMIT_FLOOR`.
 *
 * A distinct type because several helpers below deliberately swallow their own
 * failures and degrade to 0 or {}. Swallowing this one would cache a crawl that
 * silently under-reports commits and languages as if it were real data, which is
 * worse than having no fresh data at all — so those handlers re-throw it.
 */
export class RateLimitFloorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitFloorError";
  }
}

function authHeaders(token: string) {
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nub-coders-portfolio",
  };
}

/**
 * Fetch with:
 *  - AbortController timeout
 *  - Exponential-backoff retry
 *  - Rate-limit header inspection
 */
async function ghFetch(
  url: string,
  headers: Record<string, string>,
  attempt = 1
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, { headers, signal: controller.signal });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`GitHub API timeout after ${TIMEOUT_MS}ms: ${url}`);
    }
    throw err;
  }
  clearTimeout(timer);

  // ── Rate-limit guard ───────────────────────────────────────────────────────
  const remaining = parseInt(res.headers.get("x-ratelimit-remaining") ?? "999", 10);
  const resetEpoch = parseInt(res.headers.get("x-ratelimit-reset") ?? "0", 10);

  // No `res.status === 200` qualifier: a 200 is exactly when this needs to fire.
  // Waiting for GitHub to start rejecting meant the budget was already spent and
  // the guard only reported history. Reserving the last few calls leaves room for
  // the rest of the app (and the next crawl's cheap paths) to work.
  if (remaining < RATE_LIMIT_FLOOR) {
    const resetIn = Math.max(0, resetEpoch * 1000 - Date.now());
    throw new RateLimitFloorError(
      `GitHub rate limit critically low (${remaining} remaining). Resets in ${Math.ceil(resetIn / 1000)}s.`
    );
  }

  // ── Retry on 429 / 503 ────────────────────────────────────────────────────
  if ((res.status === 429 || res.status === 503) && attempt <= MAX_RETRIES) {
    const retryAfterHeader = res.headers.get("retry-after");
    const retryAfterSec = retryAfterHeader
      ? parseInt(retryAfterHeader, 10)
      : 2 ** attempt + Math.random(); // exponential + jitter
    const waitMs = retryAfterSec * 1000;
    await sleep(waitMs);
    return ghFetch(url, headers, attempt + 1);
  }

  // ── Retry on transient 5xx ────────────────────────────────────────────────
  if (res.status >= 500 && attempt <= MAX_RETRIES) {
    const waitMs = (2 ** attempt + Math.random()) * 1000;
    await sleep(waitMs);
    return ghFetch(url, headers, attempt + 1);
  }

  return res;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Paginate through all pages of a GitHub API endpoint.
 *
 * Exported for unit tests — not part of the module's public surface.
 */
export async function paginate<T = any>(
  url: string,
  headers: Record<string, string>
): Promise<T[]> {
  const results: T[] = [];
  const separator = url.includes("?") ? "&" : "?";

  // A bounded loop, deliberately. This used to be `while (nextUrl)` over a const
  // that was never reassigned and never read in the body — i.e. `while (true)`
  // with three breaks — so a Link header that always claimed rel="next" would
  // have spun forever, burning the API quota.
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await ghFetch(`${url}${separator}per_page=100&page=${page}`, headers);
    if (!res.ok) break;

    const data = await res.json();
    // The body is type-asserted, never validated: an error object here would
    // throw inside the spread below rather than degrading to an empty result.
    if (!Array.isArray(data) || data.length === 0) break;
    results.push(...(data as T[]));

    // No further page advertised — a clean finish, not a truncation.
    if (!(res.headers.get("link") ?? "").includes('rel="next"')) return results;

    if (page === MAX_PAGES) {
      console.warn(
        `[GitHub] pagination cap of ${MAX_PAGES} pages hit for ${url} — results truncated at ${results.length} items.`,
      );
    }
  }

  return results;
}

/** Count commits for a user in a repo using the Link header trick (1 request) */
async function countCommits(
  repoFullName: string,
  username: string,
  headers: Record<string, string>
): Promise<number> {
  try {
    const res = await ghFetch(
      `${BASE}/repos/${repoFullName}/commits?author=${encodeURIComponent(username)}&per_page=1`,
      headers
    );
    if (!res.ok) return 0;
    const link = res.headers.get("link") ?? "";
    const match = link.match(/[?&]page=(\d+)>; rel="last"/);
    if (match) return parseInt(match[1], 10);
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch (err) {
    // A spent budget must not be reported as "0 commits".
    if (err instanceof RateLimitFloorError) throw err;
    return 0;
  }
}

/** Get language bytes for a repo */
async function repoLanguages(
  repoFullName: string,
  headers: Record<string, string>
): Promise<Record<string, number>> {
  try {
    const res = await ghFetch(`${BASE}/repos/${repoFullName}/languages`, headers);
    if (!res.ok) return {};
    return res.json();
  } catch (err) {
    // A spent budget must not be reported as "no languages".
    if (err instanceof RateLimitFloorError) throw err;
    return {};
  }
}

/** Search-API count helper */
async function searchCount(
  q: string,
  headers: Record<string, string>
): Promise<number> {
  try {
    const res = await ghFetch(
      `${BASE}/search/issues?q=${encodeURIComponent(q)}&per_page=1`,
      headers
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total_count ?? 0;
  } catch (err) {
    // A spent budget must not be reported as "0 results".
    if (err instanceof RateLimitFloorError) throw err;
    return 0;
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

let inflight: Promise<GitHubStats> | null = null;

/**
 * The full crawl: profile, repo list, then ~2 requests per public repo, plus
 * four search calls and the gist list. Tens of requests and potentially tens of
 * seconds. Never call this directly — `fetchGitHubStats` owns the cache and
 * guarantees only one crawl runs at a time.
 */
async function crawlGitHubStats(token: string): Promise<GitHubStats> {
  const hdrs = authHeaders(token);

  // ── 1. User profile ────────────────────────────────────────────────────────
  const userRes = await ghFetch(`${BASE}/user`, hdrs);
  if (!userRes.ok) {
    const status = userRes.status;
    if (status === 401) throw new Error("GitHub token is invalid or expired.");
    if (status === 403) throw new Error("GitHub token lacks required scopes.");
    throw new Error(`GitHub API error ${status} while fetching user profile.`);
  }
  const user = await userRes.json();

  // ── 2. All repositories ────────────────────────────────────────────────────
  // We fetch `visibility=all` so the private/public split is accurate, but only
  // PUBLIC repos feed the aggregate stats below — this endpoint is unauthenticated
  // and must not leak stars/commits/languages derived from private work.
  const allRepos: GitHubRepo[] = await paginate(
    `${BASE}/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&sort=updated`,
    hdrs
  );
  const privateCount = allRepos.filter((r) => r.private).length;
  const publicCount = allRepos.length - privateCount;
  const repos = allRepos.filter((r) => !r.private);

  let totalStars = 0;
  let totalForks = 0;
  let totalCommits = 0;
  const langBytes: Record<string, number> = {};

  // Process repos in small parallel batches to respect rate limits
  const BATCH = 5;
  for (let i = 0; i < repos.length; i += BATCH) {
    const batch = repos.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (repo: GitHubRepo) => {
        totalStars += repo.stargazers_count ?? 0;
        totalForks += repo.forks_count ?? 0;

        const [commits, langs] = await Promise.all([
          countCommits(repo.full_name, user.login, hdrs),
          repoLanguages(repo.full_name, hdrs),
        ]);
        totalCommits += commits;
        for (const [lang, bytes] of Object.entries(langs)) {
          langBytes[lang] = (langBytes[lang] ?? 0) + (bytes as number);
        }
      })
    );
  }

  // ── 3. PRs & Issues ───────────────────────────────────────────────────────
  const [prsMerged, prsOpen, issuesOpen, issuesClosed, gists] =
    await Promise.all([
      searchCount(`type:pr author:${user.login} is:merged`, hdrs),
      searchCount(`type:pr author:${user.login} is:open`, hdrs),
      searchCount(`type:issue author:${user.login} is:open`, hdrs),
      searchCount(`type:issue author:${user.login} is:closed`, hdrs),
      // Same reasoning as the helpers above: a missing gist list is fine to
      // shrug off, a spent budget is not.
      paginate(`${BASE}/gists`, hdrs)
        .then((g) => g.length)
        .catch((err) => {
          if (err instanceof RateLimitFloorError) throw err;
          return 0;
        }),
    ]);

  // ── 4. Top languages ──────────────────────────────────────────────────────
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
  const topLanguages: LanguageStat[] = Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    }));

  // ── 5. Skills map ─────────────────────────────────────────────────────────
  // Normalize language percentages → proficiency score in [60, 98]
  // Top language = 98, everything else scales linearly down to 60.
  const PROF_MAX = 98;
  const PROF_MIN = 60;
  const topPct = topLanguages[0]?.percentage ?? 1;

  // Language → category lookup
  const LANG_CATEGORY: Record<string, SkillEntry["category"]> = {
    // Frontend
    JavaScript: "frontend", TypeScript: "frontend", HTML: "frontend",
    CSS: "frontend", SCSS: "frontend", Sass: "frontend", Vue: "frontend",
    Svelte: "frontend", Astro: "frontend", Handlebars: "frontend",
    // Backend
    Python: "backend", "C#": "backend", Ruby: "backend", Go: "backend",
    Java: "backend", Kotlin: "backend", Rust: "backend", PHP: "backend",
    Swift: "backend", Elixir: "backend", Scala: "backend", Dart: "backend",
    "C++": "backend", C: "backend", Lua: "backend", Perl: "backend",
    // DevOps / infra
    Dockerfile: "devops", HCL: "devops", Shell: "devops",
    Makefile: "devops", "Nix": "devops", Batchfile: "devops", PowerShell: "devops",
    YAML: "devops",
    // Database
    PLpgSQL: "database", PLSQL: "database", SQL: "database",
    TSQL: "database",
  };

  // Display name overrides (GitHub lang name → human-friendly)
  const DISPLAY: Record<string, string> = {
    JavaScript: "JavaScript", TypeScript: "TypeScript", Python: "Python",
    HTML: "HTML/CSS", CSS: "CSS", Shell: "Shell Script", Dockerfile: "Docker",
    "C++": "C++", "C#": "C#",
  };

  const skillsMap: SkillEntry[] = topLanguages.map((l) => {
    const pct = l.percentage;
    const proficiency = Math.round(
      PROF_MIN + ((pct / topPct) * (PROF_MAX - PROF_MIN))
    );
    return {
      name: DISPLAY[l.name] ?? l.name,
      proficiency: Math.min(PROF_MAX, Math.max(PROF_MIN, proficiency)),
      category: LANG_CATEGORY[l.name] ?? "other",
    };
  });

  const stats: GitHubStats = {
    username: user.login,
    name: user.name ?? null,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    publicRepos: publicCount,
    totalRepos: publicCount,
    totalStars,
    totalForks,
    totalCommits,
    prsOpen,
    prsMerged,
    issuesOpen,
    issuesClosed,
    gists,
    topLanguages,
    skillsMap,
    fetchedAt: new Date().toISOString(),
  };

  // No cache write here on purpose: `fetchGitHubStats` owns the cache entry so
  // there is exactly one place that decides what "fresh" means.
  return stats;
}

/**
 * Cache-aware entry point for GitHub stats:
 *  - fresh cache hit → return immediately
 *  - crawl already running → join it instead of starting a second one
 *  - stale cache → serve stale now, revalidate in the background (SWR)
 *  - cold or forced → await the crawl, falling back to stale on failure
 *
 * The coalescing matters because the cache is only written after the whole crawl
 * finishes: without it, every request arriving at the TTL boundary kicked off its
 * own ~2-per-repo fan-out and they all raced to overwrite the same cache entry.
 */
export async function fetchGitHubStats(force = false): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    if (cached) return cached.data;
    throw new Error("GITHUB_TOKEN environment variable is not set.");
  }

  if (!force && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  if (inflight) {
    // Someone is already paying for the crawl. Prefer stale data over waiting.
    if (!force && cached) return cached.data;
    return inflight;
  }

  const crawl = () => {
    inflight = crawlGitHubStats(token)
      .then((stats) => {
        cached = { data: stats, at: Date.now() };
        return stats;
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  };

  if (!force && cached) {
    const stale = cached.data;
    // The .catch also marks `inflight` as handled, so a failed background
    // revalidation can't surface as an unhandled rejection.
    crawl().catch((err: any) => {
      console.error("[GitHub Stats] background revalidation failed:", err?.message ?? err);
    });
    return stale;
  }

  try {
    return await crawl();
  } catch (err: any) {
    if (cached) {
      console.warn("[GitHub Stats] crawl failed, serving stale cache:", err?.message ?? err);
      return cached.data;
    }
    throw err;
  }
}

let refresher: NodeJS.Timeout | null = null;

/**
 * Start a periodic background refresher that updates the in-memory cache
 * for GitHub stats, contribution calendar, and pre-rendered SVGs every `minutes` minutes.
 * Returns a stop function to cancel the refresher.
 */
export function startGitHubRefresher(minutes = Math.round(CACHE_TTL_MS / 60000)) {
  const ms = Math.max(1, minutes) * 60 * 1000;
  if (refresher) clearInterval(refresher);

  const run = async () => {
    try {
      await Promise.allSettled([
        // force: the refresher exists to guarantee a real crawl on its schedule.
        // Without it the stale-while-revalidate path would hand back the old
        // cache and log "pre-warmed" before the refresh had actually finished.
        fetchGitHubStats(true),
        (async () => {
          await refreshContributionsCache();
          await Promise.allSettled([
            refreshStreakCapsulesSVG(),
            refreshContributionGraphSVG(),
          ]);
        })(),
      ]);
      console.log(`[GitHub Refresher] stats & SVG caches pre-warmed at ${new Date().toISOString()}`);
    } catch (err: any) {
      console.error("[GitHub Refresher] failed to refresh cache:", err?.message ?? err);
    }
  };

  // Run immediately, then on interval
  run();
  refresher = setInterval(run, ms);

  const stop = () => {
    if (refresher) {
      clearInterval(refresher);
      refresher = null;
    }
  };

  // No signal handlers here on purpose. Registering SIGINT/SIGTERM listeners
  // overrides Node's default terminate action, and clearing an interval doesn't
  // release the listening socket — so the process would never exit. Lifecycle is
  // owned by server/index.ts, which calls this `stop` and then server.close().
  return stop;
}

