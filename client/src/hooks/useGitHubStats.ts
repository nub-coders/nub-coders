import { useQuery } from "@tanstack/react-query";
// API-contract types are owned by the server; import them (type-only, so no
// server code is bundled) instead of re-declaring and risking drift.
import type { GitHubStats } from "../../../server/github";

export type { GitHubStats, LanguageStat, SkillEntry } from "../../../server/github";

declare global {
  interface Window {
    __GITHUB_STATS__?: GitHubStats | null;
  }
}

async function fetchStats(): Promise<GitHubStats> {
  const res = await fetch("/api/github/stats");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export function useGitHubStats() {
  const serverStats = typeof window !== "undefined" ? window.__GITHUB_STATS__ ?? undefined : undefined;

  return useQuery<GitHubStats, Error>({
    queryKey: ["github-stats"],
    queryFn: fetchStats,
    initialData: serverStats,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,   // treat as fresh for 10 min
    gcTime: 15 * 60 * 1000,      // keep in cache for 15 min
    retry: 2,                     // React Query level retries (network-level)
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
