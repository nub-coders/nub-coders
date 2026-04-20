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

export interface GitHubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  privateRepos: number;
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
  fetchedAt: string; // ISO timestamp
}

// ── Config ────────────────────────────────────────────────────────────────────
const TIMEOUT_MS = 15_000;   // 15 s per request
const MAX_RETRIES = 3;
const RATE_LIMIT_FLOOR = 10; // abort if remaining calls drop below this

// ── Helpers ───────────────────────────────────────────────────────────────────

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

  if (remaining < RATE_LIMIT_FLOOR && res.status !== 200) {
    const resetIn = Math.max(0, resetEpoch * 1000 - Date.now());
    throw new Error(
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

/** Paginate through all pages of a GitHub API endpoint */
async function paginate<T = any>(
  url: string,
  headers: Record<string, string>
): Promise<T[]> {
  const results: T[] = [];
  let nextUrl: string | null = url + (url.includes("?") ? "&" : "?") + "per_page=100&page=1";
  let page = 1;

  while (nextUrl) {
    const pageUrl = url + (url.includes("?") ? "&" : "?") + `per_page=100&page=${page}`;
    const res = await ghFetch(pageUrl, headers);
    if (!res.ok) break;
    const data: T[] = await res.json();
    if (!data.length) break;
    results.push(...data);
    // Check for next page via Link header
    const link = res.headers.get("link") ?? "";
    if (!link.includes('rel="next"')) break;
    page++;
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
  } catch {
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
  } catch {
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
  } catch {
    return 0;
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function fetchGitHubStats(): Promise<GitHubStats> {
  // Serve from cache if fresh
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set.");
  }

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
  const repos: any[] = await paginate(
    `${BASE}/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&sort=updated`,
    hdrs
  );

  let totalStars = 0;
  let totalForks = 0;
  let totalCommits = 0;
  let publicCount = 0;
  let privateCount = 0;
  const langBytes: Record<string, number> = {};

  // Process repos in small parallel batches to respect rate limits
  const BATCH = 5;
  for (let i = 0; i < repos.length; i += BATCH) {
    const batch = repos.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (repo: any) => {
        if (repo.private) privateCount++; else publicCount++;
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
      paginate(`${BASE}/gists`, hdrs).then((g) => g.length).catch(() => 0),
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

  const stats: GitHubStats = {
    username: user.login,
    name: user.name ?? null,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    publicRepos: publicCount,
    privateRepos: privateCount,
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalCommits,
    prsOpen,
    prsMerged,
    issuesOpen,
    issuesClosed,
    gists,
    topLanguages,
    fetchedAt: new Date().toISOString(),
  };

  cached = { data: stats, at: Date.now() };
  return stats;
}
