import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, test } from "vitest";
import GitHubStatsSection from "@/sections/GitHubStatsSection";
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

/**
 * The hook seeds React Query from `window.__GITHUB_STATS__` (the server injects
 * it into the HTML), so priming that is enough to render the loaded state — no
 * fetch mock, no waiting.
 */
function renderSection() {
  window.__GITHUB_STATS__ = stats;
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <GitHubStatsSection />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  delete window.__GITHUB_STATS__;
});

describe("GitHubStatsSection", () => {
  test("exposes the section as a landmark named by its heading", () => {
    renderSection();

    // The other five sections are covered in landmarks.test.tsx; this one needs a
    // query client, so it lives here.
    expect(screen.getByRole("region", { name: "GitHub Stats" })).toBeInTheDocument();
  });

  test("names the profile link from the profile text, not the avatar", () => {
    renderSection();

    // Previously alt="nub-coders avatar" made this announce
    // "nub-coders avatar Ankit Kumar @nub-coders".
    expect(screen.getByRole("link", { name: "Ankit Kumar @nub-coders" })).toHaveAttribute(
      "href",
      "https://github.com/nub-coders",
    );
  });

  test("treats the avatar as decorative and reserves its space", () => {
    renderSection();

    // alt="" keeps it out of the accessibility tree entirely.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    const avatar = document.querySelector(".gh-avatar");
    expect(avatar).toHaveAttribute("alt", "");
    expect(avatar).toHaveAttribute("width", "240");
    expect(avatar).toHaveAttribute("height", "240");
  });

  test("renders the language widget once data is present", () => {
    renderSection();

    expect(screen.getByRole("group", { name: "GitHub stats" })).toBeInTheDocument();
  });
});
