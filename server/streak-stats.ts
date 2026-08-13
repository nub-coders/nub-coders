import { fetchContributions, type ContributionDay } from './github-contributions';

const CACHE_TTL_MS = 10 * 60 * 1000;
let capsuleCached: { svg: string; at: number } | null = null;
let inflightSVG: Promise<string> | null = null;

export interface StreakData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string;
  currentStreakEnd: string;
  longestStreakStart: string;
  longestStreakEnd: string;
}

export function calculateStreaks(days: ContributionDay[]): StreakData {
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

export function generateCapsulesSVG(data: StreakData): string {
  const bgDark = "#1a1a1f";
  const border = "#2a2a3a";
  const textLight = "#c9c9d4";
  const textDark = "#0a0a0f";
  const green = "#4ade80";
  const orange = "#fb923c";
  const cyan = "#22d3ee";
  const font = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

  const gap = 10;
  const c1Width = 240; // total contributions
  const c2Width = 180; // current streak
  const c3Width = 180; // longest streak
  const height = 28;
  const totalWidth = c1Width + c2Width + c3Width + 2 * gap;

  const c2X = c1Width + gap;
  const c3X = c1Width + c2Width + 2 * gap;

  return `<svg width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .label { font-family: ${font}; font-size: 11px; letter-spacing: 1px; fill: ${textLight}; text-anchor: middle; dominant-baseline: middle; }
    .val { font-family: ${font}; font-size: 12px; font-weight: 700; fill: ${textDark}; text-anchor: middle; dominant-baseline: middle; }
  </style>

  <!-- Capsule 1: Total Contributions -->
  <g>
    <rect x="0" y="0" width="170" height="${height}" fill="${bgDark}"/>
    <rect x="170" y="0" width="70" height="${height}" fill="${green}"/>
    <rect x="0.5" y="0.5" width="${c1Width - 1}" height="${height - 1}" fill="none" stroke="${border}" stroke-width="1"/>
    <text x="85" y="14.5" class="label">TOTAL CONTRIBUTIONS</text>
    <text x="205" y="14.5" class="val">${data.totalContributions.toLocaleString()}</text>
  </g>

  <!-- Capsule 2: Current Streak -->
  <g transform="translate(${c2X}, 0)">
    <rect x="0" y="0" width="130" height="${height}" fill="${bgDark}"/>
    <rect x="130" y="0" width="50" height="${height}" fill="${orange}"/>
    <rect x="0.5" y="0.5" width="${c2Width - 1}" height="${height - 1}" fill="none" stroke="${border}" stroke-width="1"/>
    <text x="65" y="14.5" class="label">CURRENT STREAK</text>
    <text x="155" y="14.5" class="val">${data.currentStreak}d</text>
  </g>

  <!-- Capsule 3: Longest Streak -->
  <g transform="translate(${c3X}, 0)">
    <rect x="0" y="0" width="130" height="${height}" fill="${bgDark}"/>
    <rect x="130" y="0" width="50" height="${height}" fill="${cyan}"/>
    <rect x="0.5" y="0.5" width="${c3Width - 1}" height="${height - 1}" fill="none" stroke="${border}" stroke-width="1"/>
    <text x="65" y="14.5" class="label">LONGEST STREAK</text>
    <text x="155" y="14.5" class="val">${data.longestStreak}d</text>
  </g>
</svg>`;
}

export async function getStreakCapsulesSVG(force = false): Promise<string> {
  // Return fresh cache
  if (!force && capsuleCached && Date.now() - capsuleCached.at < CACHE_TTL_MS) {
    return capsuleCached.svg;
  }

  // In-flight coalescing
  if (inflightSVG) {
    if (!force && capsuleCached) return capsuleCached.svg;
    return inflightSVG;
  }

  // Stale-While-Revalidate: Return stale SVG immediately while revalidating
  if (!force && capsuleCached) {
    inflightSVG = (async () => {
      try {
        const days = await fetchContributions(undefined, undefined, false);
        const streaks = calculateStreaks(days);
        const svg = generateCapsulesSVG(streaks);
        capsuleCached = { svg, at: Date.now() };
        return svg;
      } catch (err: any) {
        console.error("[Streak Capsules Background Refresh Error]", err?.message ?? err);
        return capsuleCached!.svg;
      } finally {
        inflightSVG = null;
      }
    })();
    return capsuleCached.svg;
  }

  // Cold fetch
  inflightSVG = (async () => {
    try {
      const days = await fetchContributions(undefined, undefined, force);
      const streaks = calculateStreaks(days);
      const svg = generateCapsulesSVG(streaks);
      capsuleCached = { svg, at: Date.now() };
      return svg;
    } catch (err: any) {
      if (capsuleCached?.svg) {
        console.warn("[Streak Capsules] Fetch failed, serving stale SVG:", err?.message ?? err);
        return capsuleCached.svg;
      }
      throw err;
    } finally {
      inflightSVG = null;
    }
  })();

  return inflightSVG;
}

export async function refreshStreakCapsulesSVG(): Promise<string> {
  return getStreakCapsulesSVG(true);
}

