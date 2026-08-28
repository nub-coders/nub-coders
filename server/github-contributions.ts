const GRAPHQL = "https://api.github.com/graphql";

// Matches the REST client's per-request budget in github.ts. Without it this
// fetch could hang indefinitely, and because the promise below is shared as the
// single-flight for every contributions consumer, one stalled connection would
// hang both SVG endpoints and the refresher with it.
const TIMEOUT_MS = 15_000;

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cachedContributions: { data: ContributionDay[]; at: number } | null = null;
let inflightContributions: Promise<ContributionDay[]> | null = null;

async function fetchContributionsFromAPI(token: string, username: string): Promise<ContributionDay[]> {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const query = `query {
    user(login: "${username}") {
      contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${now.toISOString()}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "nub-coders-portfolio",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error(`GitHub GraphQL API timeout after ${TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API error: ${res.status}`);
  }

  interface ContributionsResponse {
    data?: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            weeks: { contributionDays: ContributionDay[] }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  }

  const json = (await res.json()) as ContributionsResponse;
  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0]?.message}`);
  }

  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) {
    throw new Error("Invalid GraphQL contributions response structure");
  }

  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push(day);
    }
  }
  return days;
}

/**
 * Fetch GitHub contribution days with:
 * - Shared in-memory caching across all SVG endpoints
 * - In-flight request coalescing (single-flight)
 * - Stale-while-revalidate (SWR) fallback
 */
export async function fetchContributions(token?: string, username?: string, force = false): Promise<ContributionDay[]> {
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  if (!effectiveToken) {
    if (cachedContributions?.data) {
      return cachedContributions.data;
    }
    throw new Error("GITHUB_TOKEN environment variable is not set.");
  }

  const effectiveUsername = username || process.env.GITHUB_USERNAME || "nub-coders";

  // Fresh cache hit
  if (!force && cachedContributions && Date.now() - cachedContributions.at < CACHE_TTL_MS) {
    return cachedContributions.data;
  }

  // If already fetching in-flight, return the existing promise
  if (inflightContributions) {
    if (!force && cachedContributions?.data) {
      return cachedContributions.data;
    }
    return inflightContributions;
  }

  // If stale cache exists and not forced, trigger background revalidation and return stale immediately (SWR)
  if (!force && cachedContributions?.data) {
    inflightContributions = fetchContributionsFromAPI(effectiveToken, effectiveUsername)
      .then((days) => {
        cachedContributions = { data: days, at: Date.now() };
        return days;
      })
      .catch((err) => {
        console.error("[GitHub Contributions Background Refresh Error]", err?.message ?? err);
        return cachedContributions!.data;
      })
      .finally(() => {
        inflightContributions = null;
      });
    return cachedContributions.data;
  }

  // Cold fetch (no cache yet or forced)
  inflightContributions = (async () => {
    try {
      const days = await fetchContributionsFromAPI(effectiveToken, effectiveUsername);
      cachedContributions = { data: days, at: Date.now() };
      return days;
    } catch (err: any) {
      if (cachedContributions?.data) {
        console.warn("[GitHub Contributions] Fetch failed, serving stale cache:", err?.message ?? err);
        return cachedContributions.data;
      }
      throw err;
    } finally {
      inflightContributions = null;
    }
  })();

  return inflightContributions;
}

/**
 * Helper to force a background refresh of the contribution cache
 */
export async function refreshContributionsCache(): Promise<ContributionDay[]> {
  return fetchContributions(undefined, undefined, true);
}

