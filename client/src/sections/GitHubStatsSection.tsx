import { useGitHubStats } from "@/hooks/useGitHubStats";
import { LanguageWidget } from "@/components/LanguageWidget";

export default function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

  return (
    <section id="stats" aria-labelledby="stats-title">
      <div className="section-head reveal"><h2 className="section-title" id="stats-title">GitHub Stats</h2></div>

      {/* aria-busy on the one wrapper is the loading signal. The skeletons used to
          carry role="status" as well, which implies aria-live="polite" — two nested
          live regions announced the load twice and then re-announced the whole
          language list when the placeholders were swapped out. */}
      <div aria-live="polite" aria-busy={isLoading}>
        <div className="stats-grid reveal">
          <div className="stats-card">
            {isLoading ? (
              <div className="skeleton" aria-hidden="true" />
            ) : data ? (
              <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="gh-profile-link">
                {/* alt="" on purpose: the link already reads the name and handle,
                    so a described avatar made it announce "nub-coders avatar
                    nub-coders @nub-coders". width/height give the intrinsic
                    ratio before CSS lands. */}
                <img
                  src={data.avatarUrl}
                  alt=""
                  width={240}
                  height={240}
                  className="gh-avatar"
                  loading="lazy"
                  decoding="async"
                />
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
