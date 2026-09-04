import { fetchContributions, type ContributionDay } from './github-contributions';

const CACHE_TTL_MS = 10 * 60 * 1000;
let cached: { svg: string; at: number } | null = null;
let inflightSVG: Promise<string> | null = null;

const GRAPH_DAYS = 31;

const TEXT_COLOR = "#ffffff";
const LINE_COLOR = "#ffffff";
const POINT_COLOR = "#ffffff";
const AREA_COLOR = "#ffffff";
const GRID_COLOR = "#21262d";
const AXIS_COLOR = "#30363d";

const WIDTH = 850;
const HEIGHT = 320;
const PADDING = { top: 50, right: 30, bottom: 50, left: 50 };
const CHART_W = WIDTH - PADDING.left - PADDING.right;
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom;

/**
 * Chart frame with no series, for when GitHub returns an empty calendar.
 * `generateGraphSVG` used to reach `points[points.length - 1].x` on an empty
 * array and throw, turning a thin upstream response into a 500 on the SVG route.
 */
function emptyGraphSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="No contribution data available">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <style>
    .axis-label { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; fill: ${TEXT_COLOR}; opacity: 0.5; }
  </style>
  <line x1="${PADDING.left}" y1="${PADDING.top}" x2="${PADDING.left}" y2="${PADDING.top + CHART_H}" stroke="${AXIS_COLOR}" stroke-width="1"/>
  <line x1="${PADDING.left}" y1="${PADDING.top + CHART_H}" x2="${PADDING.left + CHART_W}" y2="${PADDING.top + CHART_H}" stroke="${AXIS_COLOR}" stroke-width="1"/>
  <text x="${PADDING.left + CHART_W / 2}" y="${PADDING.top + CHART_H / 2}" text-anchor="middle" class="axis-label">No contribution data available</text>
</svg>`;
}

export function generateGraphSVG(days: ContributionDay[]): string {
  if (!days.length) return emptyGraphSVG();

  const sorted = [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-GRAPH_DAYS);

  const counts = sorted.map((d) => d.contributionCount);
  const maxVal = Math.max(...counts, 1);
  const yMax = Math.ceil(maxVal / 2) * 2;
  const yStep = Math.max(1, Math.ceil(yMax / 5));
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);
  if (yTicks[yTicks.length - 1] < yMax) yTicks.push(yMax);

  const xStep = CHART_W / (sorted.length - 1 || 1);

  const points = sorted.map((d, i) => ({
    x: PADDING.left + i * xStep,
    y: PADDING.top + CHART_H - (d.contributionCount / yMax) * CHART_H,
    count: d.contributionCount,
    date: d.date,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const areaPath = linePath
    + ` L ${points[points.length - 1].x.toFixed(1)} ${(PADDING.top + CHART_H).toFixed(1)}`
    + ` L ${points[0].x.toFixed(1)} ${(PADDING.top + CHART_H).toFixed(1)} Z`;

  const gridLines = yTicks.map((v) => {
    const y = PADDING.top + CHART_H - (v / yMax) * CHART_H;
    return `<line x1="${PADDING.left}" y1="${y.toFixed(1)}" x2="${PADDING.left + CHART_W}" y2="${y.toFixed(1)}" stroke="${GRID_COLOR}" stroke-width="0.5" stroke-dasharray="4,4"/>
    <text x="${PADDING.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="axis-text">${v}</text>`;
  }).join("\n    ");

  const labelInterval = Math.max(1, Math.floor(sorted.length / 10));
  const xLabels = points
    .filter((_, i) => i % labelInterval === 0 || i === points.length - 1)
    .map((p) => {
      const d = new Date(p.date + "T00:00:00Z");
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      return `<text x="${p.x.toFixed(1)}" y="${(PADDING.top + CHART_H + 24).toFixed(1)}" text-anchor="middle" class="axis-text">${label}</text>`;
    }).join("\n    ");

  const dots = points.map((p) =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${POINT_COLOR}"/>`
  ).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${AREA_COLOR}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${AREA_COLOR}" stop-opacity="0.02"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <style>
    .axis-text { font: 400 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; fill: ${TEXT_COLOR}; opacity: 0.7; }
    .axis-label { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; fill: ${TEXT_COLOR}; opacity: 0.5; }
  </style>

  <!-- Background card -->
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>

  <!-- Y axis -->
  <line x1="${PADDING.left}" y1="${PADDING.top}" x2="${PADDING.left}" y2="${PADDING.top + CHART_H}" stroke="${AXIS_COLOR}" stroke-width="1"/>
  <text x="14" y="${PADDING.top + CHART_H / 2}" text-anchor="middle" class="axis-label" transform="rotate(-90, 14, ${PADDING.top + CHART_H / 2})">Contributions</text>

  <!-- X axis -->
  <line x1="${PADDING.left}" y1="${PADDING.top + CHART_H}" x2="${PADDING.left + CHART_W}" y2="${PADDING.top + CHART_H}" stroke="${AXIS_COLOR}" stroke-width="1"/>
  <text x="${PADDING.left + CHART_W / 2}" y="${HEIGHT - 8}" text-anchor="middle" class="axis-label">Days</text>

  <!-- Grid -->
  ${gridLines}

  <!-- X labels -->
  ${xLabels}

  <!-- Area -->
  <path d="${areaPath}" fill="url(#areaGrad)"/>

  <!-- Line -->
  <path d="${linePath}" fill="none" stroke="${LINE_COLOR}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Points -->
  ${dots}

  <!-- Moving glow tracing the line -->
  <circle r="4" fill="#ffffff" filter="url(#glow)">
    <animateMotion path="${linePath}" dur="3s" repeatCount="indefinite" rotate="auto"/>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.95;1" dur="3s" repeatCount="indefinite"/>
  </circle>
</svg>`;
}

export async function getContributionGraphSVG(force = false): Promise<string> {
  // Fresh cache hit
  if (!force && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.svg;
  }

  // In-flight coalescing
  if (inflightSVG) {
    if (!force && cached) return cached.svg;
    return inflightSVG;
  }

  // Stale-While-Revalidate: Return stale SVG immediately while revalidating
  if (!force && cached) {
    inflightSVG = (async () => {
      try {
        const days = await fetchContributions(undefined, undefined, false);
        const svg = generateGraphSVG(days);
        cached = { svg, at: Date.now() };
        return svg;
      } catch (err: any) {
        console.error("[Contribution Graph Background Refresh Error]", err?.message ?? err);
        return cached!.svg;
      } finally {
        inflightSVG = null;
      }
    })();
    return cached.svg;
  }

  // Cold fetch
  inflightSVG = (async () => {
    try {
      const days = await fetchContributions(undefined, undefined, force);
      const svg = generateGraphSVG(days);
      cached = { svg, at: Date.now() };
      return svg;
    } catch (err: any) {
      if (cached?.svg) {
        console.warn("[Contribution Graph] Fetch failed, serving stale SVG:", err?.message ?? err);
        return cached.svg;
      }
      throw err;
    } finally {
      inflightSVG = null;
    }
  })();

  return inflightSVG;
}

export async function refreshContributionGraphSVG(): Promise<string> {
  return getContributionGraphSVG(true);
}

