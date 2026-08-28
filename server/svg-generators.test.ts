// @vitest-environment node
/**
 * The two SVG generators are pure functions over whatever GitHub returned. A thin
 * or empty calendar must degrade to a valid image, not throw: both generators sit
 * inside a route handler whose only fallback is a 500.
 */

import { describe, it, expect } from "vitest";
import { generateGraphSVG } from "./contribution-graph";
import { calculateStreaks, generateCapsulesSVG } from "./streak-stats";
import type { ContributionDay } from "./github-contributions";

function daysFrom(counts: number[]): ContributionDay[] {
  return counts.map((contributionCount, i) => ({
    contributionCount,
    date: `2026-01-${String(i + 1).padStart(2, "0")}`,
  }));
}

describe("generateGraphSVG", () => {
  it("returns a valid empty-state chart instead of throwing on no data", () => {
    // Pre-fix this read points[-1].x and threw a TypeError.
    const svg = generateGraphSVG([]);

    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain("</svg>");
    expect(svg).toContain("No contribution data available");
    expect(svg).toContain('aria-label="No contribution data available"');
  });

  it("emits no NaN or undefined coordinates in the empty state", () => {
    const svg = generateGraphSVG([]);

    expect(svg).not.toContain("NaN");
    expect(svg).not.toContain("undefined");
  });

  it("draws a single-point series without dividing by zero", () => {
    const svg = generateGraphSVG(daysFrom([4]));

    expect(svg).toContain("<path");
    expect(svg).not.toContain("NaN");
    expect(svg.match(/<circle/g)).toHaveLength(2); // one data point + the glow marker
  });

  it("plots one point per day", () => {
    const svg = generateGraphSVG(daysFrom([0, 1, 2, 3, 4, 5, 6]));

    expect(svg.match(/<circle/g)).toHaveLength(8); // 7 points + the glow marker
    expect(svg).not.toContain("NaN");
  });

  it("handles an all-zero week without dividing by a zero maximum", () => {
    const svg = generateGraphSVG(daysFrom([0, 0, 0, 0, 0, 0, 0]));

    expect(svg).not.toContain("NaN");
    expect(svg).not.toContain("Infinity");
  });
});

describe("calculateStreaks", () => {
  it("returns zeroed data for an empty calendar rather than throwing", () => {
    const streaks = calculateStreaks([]);

    expect(streaks.totalContributions).toBe(0);
    expect(streaks.longestStreak).toBe(0);
    expect(streaks.currentStreak).toBe(0);
  });

  it("feeds an empty result into a valid capsules SVG", () => {
    const svg = generateCapsulesSVG(calculateStreaks([]));

    expect(svg).toMatch(/^<svg /);
    expect(svg).not.toContain("NaN");
    expect(svg).not.toContain("undefined");
  });

  it("counts total contributions across the calendar", () => {
    expect(calculateStreaks(daysFrom([1, 2, 3])).totalContributions).toBe(6);
  });
});
