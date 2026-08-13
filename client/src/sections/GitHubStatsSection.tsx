import { useGitHubStats } from "@/hooks/useGitHubStats";
import { LanguageWidget } from "@/components/LanguageWidget";

export default function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

  return (
    <section id="stats">
      <div className="section-head reveal"><h2 className="section-title">GitHub Stats</h2></div>

      <div aria-live="polite" aria-busy={isLoading}>
        <div className="stats-grid reveal">
          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton" role="status" aria-label="Loading GitHub profile" />
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
              <div className="skeleton" role="status" aria-label="Loading GitHub stats" />
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
