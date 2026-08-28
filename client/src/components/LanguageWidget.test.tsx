import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { LanguageWidget } from "@/components/LanguageWidget";
import type { GitHubStats } from "@/hooks/useGitHubStats";

const stats: GitHubStats = {
  username: "nub-coders",
  name: "Ankit Kumar",
  avatarUrl: "https://example.test/avatar.png",
  profileUrl: "https://github.com/nub-coders",
  followers: 12,
  following: 3,
  publicRepos: 20,
  totalRepos: 24,
  totalStars: 87,
  totalForks: 9,
  totalCommits: 1234,
  prsOpen: 2,
  prsMerged: 41,
  issuesOpen: 5,
  issuesClosed: 30,
  gists: 1,
  topLanguages: [
    { name: "TypeScript", bytes: 5000, percentage: 50 },
    { name: "Python", bytes: 3000, percentage: 30 },
    { name: "CSS", bytes: 2000, percentage: 20 },
  ],
  skillsMap: [],
  fetchedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
};

const carousel = () => screen.getByRole("group", { name: "GitHub stats" });
const dot = (name: string) => screen.getByRole("button", { name });

/** The dots are the source of truth for which slide is showing. */
const currentSlideLabel = () =>
  screen
    .getAllByRole("button")
    .find((button) => button.getAttribute("aria-current") === "true")
    ?.getAttribute("aria-label");

describe("LanguageWidget", () => {
  test("does not hijack the wheel", () => {
    render(<LanguageWidget data={stats} />);

    // fireEvent returns false when a listener called preventDefault. The old
    // implementation swallowed the gesture and locked input for 520ms; scrolling
    // past this card must now be indistinguishable from scrolling anywhere else.
    const notPrevented = fireEvent.wheel(carousel(), { deltaY: 120 });

    expect(notPrevented).toBe(true);
    expect(currentSlideLabel()).toBe("Top languages");
  });

  test("advances on horizontal swipe but leaves vertical gestures to the page", () => {
    render(<LanguageWidget data={stats} />);

    // A vertical drag is how you scroll on touch — it must not move the carousel.
    fireEvent.touchStart(carousel(), { touches: [{ clientX: 150, clientY: 300 }] });
    fireEvent.touchEnd(carousel(), { changedTouches: [{ clientX: 150, clientY: 80 }] });
    expect(currentSlideLabel()).toBe("Top languages");

    fireEvent.touchStart(carousel(), { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchEnd(carousel(), { changedTouches: [{ clientX: 60, clientY: 100 }] });
    expect(currentSlideLabel()).toBe("Stars and commits");

    // Swiping back the other way returns to the previous slide.
    fireEvent.touchStart(carousel(), { touches: [{ clientX: 60, clientY: 100 }] });
    fireEvent.touchEnd(carousel(), { changedTouches: [{ clientX: 220, clientY: 100 }] });
    expect(currentSlideLabel()).toBe("Top languages");
  });

  test("ignores a swipe shorter than the threshold", () => {
    render(<LanguageWidget data={stats} />);

    fireEvent.touchStart(carousel(), { touches: [{ clientX: 150, clientY: 100 }] });
    fireEvent.touchEnd(carousel(), { changedTouches: [{ clientX: 130, clientY: 100 }] });

    expect(currentSlideLabel()).toBe("Top languages");
  });

  test("navigates with arrow keys and releases the key at the ends", () => {
    render(<LanguageWidget data={stats} />);
    const el = carousel();

    // Claimed while the widget can still move, so the page doesn't also scroll.
    expect(fireEvent.keyDown(el, { key: "ArrowDown" })).toBe(false);
    expect(currentSlideLabel()).toBe("Stars and commits");

    expect(fireEvent.keyDown(el, { key: "ArrowRight" })).toBe(false);
    expect(currentSlideLabel()).toBe("Pull requests and issues");

    // Last slide: the key belongs to the page again, so scrolling still works.
    expect(fireEvent.keyDown(el, { key: "ArrowDown" })).toBe(true);
    expect(currentSlideLabel()).toBe("Pull requests and issues");

    expect(fireEvent.keyDown(el, { key: "ArrowUp" })).toBe(false);
    expect(currentSlideLabel()).toBe("Stars and commits");

    fireEvent.keyDown(el, { key: "ArrowUp" });
    expect(currentSlideLabel()).toBe("Top languages");
    expect(fireEvent.keyDown(el, { key: "ArrowUp" })).toBe(true);
  });

  test("jumps to a slide from its dot, labelled by content", async () => {
    const user = userEvent.setup();
    render(<LanguageWidget data={stats} />);

    // "View slide 3" told a screen-reader user nothing about the destination.
    await user.click(dot("Pull requests and issues"));

    expect(currentSlideLabel()).toBe("Pull requests and issues");
    expect(dot("Top languages")).toHaveAttribute("aria-current", "false");
  });

  test("exposes each slide as a labelled slide, hiding the inactive ones", () => {
    render(<LanguageWidget data={stats} />);

    const visible = screen.getByRole("group", { name: /Top languages \(1 of 3\)/ });
    expect(visible).toHaveAttribute("aria-roledescription", "slide");
    expect(visible).toHaveAttribute("aria-hidden", "false");

    // Inactive slides are out of the accessibility tree entirely.
    expect(screen.queryByRole("group", { name: /Stars and commits \(2 of 3\)/ })).toBeNull();
  });
});
