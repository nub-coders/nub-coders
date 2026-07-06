import { fetchContributions, type ContributionDay } from './github-contributions';

const CACHE_TTL_MS = 10 * 60 * 1000;
let cached: { svg: string; at: number } | null = null;

const GRAPH_DAYS = 31;

const BG = "#0d1117";
const TEXT_COLOR = "#a78bfa";
const LINE_COLOR = "#6e40c9";
const POINT_COLOR = "#f87171";
const AREA_COLOR = "#6e40c9";
const GRID_COLOR = "#21262d";
const AXIS_COLOR = "#30363d";

const WIDTH = 850;
const HEIGHT = 320;
const PADDING = { top: 50, right: 30, bottom: 50, left: 50 };
const CHART_W = WIDTH - PADDING.left - PADDING.right;
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom;

function generateGraphSVG(days: ContributionDay[], displayName: string): string {
  const sorted = [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-GRAPH_DAYS);

  const counts = sorted.map(d => d.contributionCount);
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

  const gridLines = yTicks.map(v => {
    const y = PADDING.top + CHART_H - (v / yMax) * CHART_H;
    return `<line x1="${PADDING.left}" y1="${y.toFixed(1)}" x2="${PADDING.left + CHART_W}" y2="${y.toFixed(1)}" stroke="${GRID_COLOR}" stroke-width="0.5" stroke-dasharray="4,4"/>
    <text x="${PADDING.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="axis-text">${v}</text>`;
  }).join("\n    ");

  const labelInterval = Math.max(1, Math.floor(sorted.length / 10));
  const xLabels = points
    .filter((_, i) => i % labelInterval === 0 || i === points.length - 1)
    .map(p => {
      const d = new Date(p.date + "T00:00:00Z");
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      return `<text x="${p.x.toFixed(1)}" y="${(PADDING.top + CHART_H + 24).toFixed(1)}" text-anchor="middle" class="axis-text">${label}</text>`;
    }).join("\n    ");

  const dots = points.map(p =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${POINT_COLOR}" stroke="${BG}" stroke-width="1.5"/>`
  ).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${AREA_COLOR}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${AREA_COLOR}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <style>
    .title { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${TEXT_COLOR}; }
    .axis-text { font: 400 10px 'Segoe UI', Ubuntu, sans-serif; fill: ${TEXT_COLOR}; opacity: 0.7; }
    .axis-label { font: 500 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${TEXT_COLOR}; opacity: 0.5; }
  </style>

  <rect width="${WIDTH}" height="${HEIGHT}" rx="6" fill="${BG}"/>

  <!-- Title -->
  <text x="${WIDTH / 2}" y="30" text-anchor="middle" class="title">${displayName}'s Contribution Graph</text>

  <!-- Y axis -->
  <line x1="${PADDING.left}" y1="${PADDING.top}" x2="${PADDING.left}" y2="${PADDING.top + CHART_H}" stroke="${AXIS_COLOR}" stroke-width="1"/>
  <text x="${14}" y="${PADDING.top + CHART_H / 2}" text-anchor="middle" class="axis-label" transform="rotate(-90, 14, ${PADDING.top + CHART_H / 2})">Contributions</text>

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
</svg>`;
}

export async function getContributionGraphSVG(): Promise<string> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.svg;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is not set.");

  const username = process.env.GITHUB_USERNAME || "nub-coders";
  const displayName = process.env.GITHUB_DISPLAY_NAME || "ANKIT KUMAR";

  const days = await fetchContributions(token, username);
  const svg = generateGraphSVG(days, displayName);

  cached = { svg, at: Date.now() };
  return svg;
}
