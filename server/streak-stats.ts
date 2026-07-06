const BASE = "https://api.github.com";
const GRAPHQL = "https://api.github.com/graphql";

const CACHE_TTL_MS = 10 * 60 * 1000;
let cached: { svg: string; at: number } | null = null;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface StreakData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string;
  currentStreakEnd: string;
  longestStreakStart: string;
  longestStreakEnd: string;
}

async function fetchContributions(token: string, username: string): Promise<ContributionDay[]> {
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

  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "nub-coders-portfolio",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API error: ${res.status}`);
  }

  const json: any = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0]?.message}`);
  }

  const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;
  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push(day);
    }
  }
  return days;
}

function calculateStreaks(days: ContributionDay[]): StreakData {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = sorted.reduce((sum, d) => sum + d.contributionCount, 0);

  let longestStreak = 0;
  let longestStart = "";
  let longestEnd = "";
  let currentStreak = 0;
  let currentStart = "";
  let currentEnd = "";
  let tempStreak = 0;
  let tempStart = "";

  const today = new Date().toISOString().split("T")[0];

  for (const day of sorted) {
    if (day.contributionCount > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStart = tempStart;
        longestEnd = day.date;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak: count backwards from today (or yesterday if today has no contributions yet)
  currentStreak = 0;
  currentStart = "";
  currentEnd = "";

  for (let i = sorted.length - 1; i >= 0; i--) {
    const day = sorted[i];
    if (day.date > today) continue;

    if (day.contributionCount > 0) {
      if (currentStreak === 0) currentEnd = day.date;
      currentStreak++;
      currentStart = day.date;
    } else {
      if (currentStreak > 0) break;
      // Allow today to have 0 contributions and check yesterday
      if (day.date === today) continue;
      break;
    }
  }

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    currentStreakStart: currentStart,
    currentStreakEnd: currentEnd,
    longestStreakStart: longestStart,
    longestStreakEnd: longestEnd,
  };
}

function formatDateRange(start: string, end: string): string {
  if (!start || !end) return "N/A";
  const fmt = (d: string) => {
    const date = new Date(d + "T00:00:00Z");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };
  if (start === end) return fmt(start);
  return `${fmt(start)} – ${fmt(end)}`;
}

function generateSVG(data: StreakData): string {
  const bg = "#0d1117";
  const border = "#6e40c9";
  const fireColor = "#f87171";
  const labelColor = "#8b949e";
  const valueColor = "#e6edf3";
  const streakColor = "#4ade80";
  const ringColor = "#6e40c9";

  const totalRange = formatDateRange(data.currentStreakStart || data.longestStreakStart, data.currentStreakEnd || data.longestStreakEnd);
  const longestRange = formatDateRange(data.longestStreakStart, data.longestStreakEnd);
  const currentRange = formatDateRange(data.currentStreakStart, data.currentStreakEnd);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none">
  <style>
    .stat-value { font: 700 28px 'Segoe UI', Ubuntu, sans-serif; fill: ${valueColor}; }
    .stat-label { font: 600 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${labelColor}; text-transform: uppercase; }
    .stat-range { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${labelColor}; }
    .streak-value { fill: ${streakColor}; }
    .fire { font-size: 18px; }
  </style>

  <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${bg}" stroke="${ringColor}" stroke-opacity="0.4"/>

  <!-- Total Contributions -->
  <g transform="translate(82.5, 48)">
    <text class="stat-value" text-anchor="middle" y="0">${data.totalContributions.toLocaleString()}</text>
    <text class="stat-label" text-anchor="middle" y="26">Total Contributions</text>
    <text class="stat-range" text-anchor="middle" y="44">Past Year</text>
  </g>

  <!-- Divider 1 -->
  <line x1="165" y1="18" x2="165" y2="170" stroke="${ringColor}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Current Streak -->
  <g transform="translate(247.5, 48)">
    <text class="fire" text-anchor="middle" y="-18">🔥</text>
    <text class="stat-value streak-value" text-anchor="middle" y="0">${data.currentStreak}</text>
    <text class="stat-label" text-anchor="middle" y="26">Current Streak</text>
    <text class="stat-range" text-anchor="middle" y="44">${currentRange}</text>
  </g>

  <!-- Divider 2 -->
  <line x1="330" y1="18" x2="330" y2="170" stroke="${ringColor}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Longest Streak -->
  <g transform="translate(412.5, 48)">
    <text class="stat-value" text-anchor="middle" y="0">${data.longestStreak}</text>
    <text class="stat-label" text-anchor="middle" y="26">Longest Streak</text>
    <text class="stat-range" text-anchor="middle" y="44">${longestRange}</text>
  </g>

  <!-- Bottom ring accent -->
  <rect x="0.5" y="165" width="494" height="30" rx="0" ry="0" fill="transparent"/>
  <rect x="0" y="190" width="495" height="5" rx="0 0 4.5 4.5" fill="${ringColor}" fill-opacity="0.15"/>
</svg>`;
}

export async function getStreakStatsSVG(): Promise<string> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.svg;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is not set.");

  const username = process.env.GITHUB_USERNAME || "nub-coders";
  const days = await fetchContributions(token, username);
  const streaks = calculateStreaks(days);
  const svg = generateSVG(streaks);

  cached = { svg, at: Date.now() };
  return svg;
}
