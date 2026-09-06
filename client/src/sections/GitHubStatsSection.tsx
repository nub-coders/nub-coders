import { useGitHubStats } from "@/hooks/useGitHubStats";
import { LanguageWidget } from "@/components/LanguageWidget";

export default function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

  return (
    <section id="stats" aria-labelledby="stats-title">
      <div className="section-head reveal">
        <h2 className="section-title" id="stats-title">GitHub Stats</h2>
      </div>

      <div aria-live="polite" aria-busy={isLoading}>
        <div className="stats-grid reveal">
          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton" aria-hidden="true" />
            ) : data ? (
              <div className="gh-profile-card">
                <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="gh-profile-link">
                  <div className="gh-avatar-wrap">
                    <img
                      src={data.avatarUrl}
                      alt=""
                      width={240}
                      height={240}
                      className="gh-avatar"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="gh-profile-meta">
                    <div className="gh-name">{data.name ?? data.username}</div>
                    <div className="gh-username">@{data.username}</div>
                  </div>
                </a>

                <div className="gh-quick-stats" aria-label="GitHub telemetry">
                  <div className="gh-stat-box">
                    <span className="gh-stat-val">{data.publicRepos ?? data.totalRepos}</span>
                    <span className="gh-stat-lbl">Repos</span>
                  </div>
                  <div className="gh-stat-box">
                    <span className="gh-stat-val">{data.totalStars}</span>
                    <span className="gh-stat-lbl">Stars</span>
                  </div>
                  <div className="gh-stat-box">
                    <span className="gh-stat-val">{data.totalCommits || data.followers}</span>
                    <span className="gh-stat-lbl">{data.totalCommits ? "Commits" : "Followers"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="gh-error">Failed to load GitHub stats.</div>
            )}
          </div>

          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton" aria-hidden="true" />
            ) : data ? (
              <LanguageWidget data={data} />
            ) : (
              <div className="gh-error">Failed to load languages.</div>
            )}
          </div>
        </div>

        {isError && !data && (
          <p className="gh-error" role="alert">Couldn&apos;t reach GitHub right now — stats will refresh automatically.</p>
        )}
      </div>
    </section>
  );
}
