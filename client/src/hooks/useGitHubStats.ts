import { useQuery } from "@tanstack/react-query";

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
}

export interface SkillEntry {
  name: string;
  proficiency: number;
  category: "frontend" | "backend" | "devops" | "database" | "other";
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
  skillsMap: SkillEntry[];
  fetchedAt: string;
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
  return useQuery<GitHubStats, Error>({
    queryKey: ["github-stats"],
    queryFn: fetchStats,
    staleTime: 10 * 60 * 1000,   // treat as fresh for 10 min
    gcTime: 15 * 60 * 1000,      // keep in cache for 15 min
    retry: 2,                     // React Query level retries (network-level)
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
