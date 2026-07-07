import { useGitHubStats } from "@/hooks/useGitHubStats";

export default function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

  const getLanguageHref = (language: string) =>
    `https://github.com/search?q=${encodeURIComponent(`language:${language}`)}&type=repositories`;

  return (
    <section id="stats">
      <div className="section-head reveal"><span className="section-num">05</span><div className="section-line" /><h2 className="section-title">GitHub Stats</h2></div>

      <div aria-live="polite" aria-busy={isLoading}>
        <div className="stats-grid reveal">
          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton h-24" role="status" aria-label="Loading GitHub profile" />
            ) : data ? (
              <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="gh-profile-link">
                <img src={data.avatarUrl} alt={`${data.username} avatar`} className="gh-avatar" loading="lazy" decoding="async" />
                <div className="gh-profile-meta">
                  <div className="gh-name">{data.name ?? data.username}</div>
                  <div className="gh-username">@{data.username}</div>
                </div>
              </a>
            ) : (
              <div className="gh-error">Failed to load GitHub stats.</div>
            )}
          </div>

          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton h-24" role="status" aria-label="Loading top languages" />
            ) : data ? (
              <div className="top-langs">
                {data.topLanguages.slice(0, 6).map((l) => (
                  <a
                    key={l.name}
                    href={getLanguageHref(l.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lang-item lang-link"
                    aria-label={`Open GitHub search for ${l.name}`}
                  >
                    <span className="lang-name">{l.name}</span>
                    <span className="lang-pct">{l.percentage}%</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="gh-error">Failed to load languages.</div>
            )}
          </div>
        </div>

        <div className="stats-row reveal">
          <div className="stat-box"><span className="stat-box-num">{data ? data.totalStars : "—"}</span><span className="stat-box-label">⭐ Stars</span></div>
          <div className="stat-box"><span className="stat-box-num">{data ? data.totalCommits : "—"}</span><span className="stat-box-label">🔥 Commits</span></div>
          <div className="stat-box"><span className="stat-box-num">{data ? data.prsMerged : "—"}</span><span className="stat-box-label">✅ PRs Merged</span></div>
          <div className="stat-box"><span className="stat-box-num">{data ? data.issuesOpen : "—"}</span><span className="stat-box-label">🐞 Open Issues</span></div>
        </div>

        {isError && !data && (
          <p className="gh-error" role="alert">Couldn&apos;t reach GitHub right now — stats will refresh automatically.</p>
        )}
      </div>
    </section>
  );
}
