import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";
import AnimationWrapper from "@/components/AnimationWrapper";
import ScrollRevealText from "@/components/ScrollRevealText";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import profileImage from "/assets/profile.jpg";

type TabType = "home" | "about" | "skills" | "projects" | "github" | "contact";

// ── Language bar ───────────────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Dockerfile: "#384d54",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", Ruby: "#701516", Swift: "#ffac45", Kotlin: "#A97BFF",
  Vue: "#41b883", Svelte: "#ff3e00", Dart: "#00B4AB",
};
function langColor(name: string) {
  return LANG_COLORS[name] ?? "#8b8fa8";
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl p-4 border border-[var(--glass-border)] flex flex-col items-center text-center gap-1"
      style={{ background: "linear-gradient(145deg, rgba(245,246,247,0.05) 0%, rgba(43,46,51,0.88) 100%)" }}
    >
      <i className={`fas ${icon} text-[var(--secondary)] text-lg`} />
      <span className="text-xs text-[var(--text-secondary)] leading-tight">{label}</span>
      <span className="text-xl font-bold text-[var(--primary)]">{value}</span>
    </div>
  );
}

// ── Skeleton pulse ─────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
function GitHubStats() {
  const { data, isLoading, isError, error, refetch, isFetching } = useGitHubStats();

  const fetched = data?.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : null;

  return (
    <section id="github-stats" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Coding Stats" />
      </h2>

      <div
        className="mt-8 rounded-[28px] p-8 border border-[var(--glass-border)]"
        style={{
          background: "linear-gradient(145deg, rgba(245,246,247,0.08) 0%, rgba(43,46,51,0.88) 100%)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 24px rgba(245,246,247,0.05)",
        }}
      >
        {/* ── Error state ─────────────────────────────────────────────────── */}
        {isError && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <i className="fas fa-triangle-exclamation text-4xl text-yellow-400" />
            <p className="text-[var(--text-secondary)]">{(error as Error)?.message ?? "Failed to load GitHub stats."}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-xl border border-[var(--glass-border)] text-sm hover:bg-white/10 transition"
            >
              <i className="fas fa-rotate-right mr-2" />Retry
            </button>
          </div>
        )}

        {/* ── Loading skeleton ─────────────────────────────────────────────── */}
        {isLoading && !isError && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-7 w-48" />
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
              <div className="hidden md:flex justify-center items-center">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          </div>
        )}

        {/* ── Loaded data ──────────────────────────────────────────────────── */}
        {data && !isLoading && (
          <>
            {/* Header row */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={data.avatarUrl}
                  alt={data.username}
                  className="w-12 h-12 rounded-full border-2 border-[var(--primary)]"
                />
                <div>
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-lg hover:text-[var(--primary)] transition-colors"
                  >
                    @{data.username}
                  </a>
                  {data.name && <p className="text-sm text-[var(--text-secondary)]">{data.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                {isFetching && <i className="fas fa-rotate-right animate-spin text-[var(--primary)]" />}
                {fetched && <span>Updated {fetched}</span>}
                <button
                  onClick={() => refetch()}
                  title="Refresh"
                  className="ml-1 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                >
                  <i className="fas fa-arrows-rotate text-xs" />
                </button>
              </div>
            </div>

            {/* Activity list + orb */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  <ScrollRevealText
                    text="Development Activity"
                    className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent"
                  />
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: "fa-star", label: "Total Stars Earned", value: data.totalStars },
                    { icon: "fa-code-commit", label: "Total Commits", value: data.totalCommits.toLocaleString() },
                    { icon: "fa-code-branch", label: "PRs Merged", value: data.prsMerged },
                    { icon: "fa-code-pull-request", label: "PRs Open", value: data.prsOpen },
                    { icon: "fa-exclamation-circle", label: "Issues (open / closed)", value: `${data.issuesOpen} / ${data.issuesClosed}` },
                    { icon: "fa-users", label: "Followers / Following", value: `${data.followers} / ${data.following}` },
                  ].map(({ icon, label, value }) => (
                    <li key={label} className="flex items-center gap-3">
                      <i className={`fas ${icon} text-[var(--secondary)] w-4 text-center`} />
                      <span className="font-medium text-sm">{label}:</span>
                      <span className="text-[var(--primary)] font-semibold">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex justify-center items-center">
                <div
                  className="w-48 h-48 rounded-full flex items-center justify-center border border-[var(--glass-border)]"
                  style={{ background: "linear-gradient(145deg, rgba(245,246,247,0.08) 0%, rgba(43,46,51,0.92) 100%)" }}
                >
                  <div className="text-6xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent">
                    <i className="fas fa-chart-line" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <StatCard icon="fa-code-commit" label="Total Commits" value={data.totalCommits.toLocaleString()} />
              <StatCard icon="fa-folder" label="Repositories" value={`${data.publicRepos} pub / ${data.privateRepos} priv`} />
              <StatCard icon="fa-code-branch" label="PRs Merged" value={data.prsMerged} />
              <StatCard icon="fa-star" label="Stars Earned" value={data.totalStars} />
            </div>

            {/* Language chart */}
            {data.topLanguages.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                  Top Languages
                </h4>
                {/* Rainbow bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-4">
                  {data.topLanguages.map((l) => (
                    <div
                      key={l.name}
                      title={`${l.name} ${l.percentage}%`}
                      style={{ width: `${l.percentage}%`, background: langColor(l.name) }}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                  {data.topLanguages.map((l) => (
                    <span key={l.name} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: langColor(l.name) }}
                      />
                      {l.name} <span className="text-[var(--primary)] font-semibold">{l.percentage}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


export default function Home() {
  const { showBackToTop, scrollToTop } = useScrollProgress();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const tabs = [
    { id: "home" as TabType, label: "Home", icon: "fa-home" },
    { id: "about" as TabType, label: "About", icon: "fa-user" },
    { id: "skills" as TabType, label: "Skills", icon: "fa-code" },
    { id: "projects" as TabType, label: "Projects", icon: "fa-folder" },
    { id: "github" as TabType, label: "Stats", icon: "fa-chart-line" },
    { id: "contact" as TabType, label: "Contact", icon: "fa-envelope" },
  ];

  return (
    <>
      <Navbar />

      <main className="pt-24 px-4 md:px-10 lg:px-20">
        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-12 w-full">
          <div className="glass-nav flex flex-wrap justify-center gap-3 md:gap-4 p-5 rounded-3xl sticky top-20 z-30 animate-entrance-top">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''
                  }`}
              >
                <i className={`fas ${tab.icon} text-sm md:text-base`}></i>
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto w-full pb-16">
          {/* Home Tab */}
          {activeTab === "home" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <section className="relative py-8 overflow-hidden flex flex-col items-center text-center">
                <div className="float-element mb-10">
                  <img
                    src={profileImage}
                    alt="Ankit Kumar - Full Stack Developer"
                    className="w-48 h-48 rounded-full border-[6px] border-[var(--primary)] shadow-2xl shadow-[rgba(245,246,247,0.22)] hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                </div>



                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                  <ScrollRevealText
                    text="Full Stack Developer"
                    className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent"
                  />
                </h2>

                <div className="max-w-4xl mb-12">
                  <ScrollRevealText
                    text="I build scalable web applications and API services with React, Node.js, and Docker. Specialized in turning complex problems into elegant digital solutions."
                    className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)]/90 leading-relaxed"
                    delay={0.5}
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="btn-gradient group flex items-center gap-3 px-10 py-5 rounded-2xl text-[var(--accent)] font-bold text-lg shadow-2xl hover:shadow-[var(--glow-primary)] transition-all"
                  >
                    <i className="fas fa-code text-xl group-hover:rotate-12 transition-transform duration-300"></i>
                    View My Work
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="glass-card group flex items-center gap-3 px-10 py-5 font-bold text-lg text-[var(--text-primary)] hover:text-[var(--text-primary)]"
                  >
                    <i className="fas fa-envelope text-xl group-hover:scale-125 transition-transform duration-300"></i>
                    Let's Talk
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-[var(--text-secondary)]/70">
                  <a
                    href="https://t.me/nub_coder_s"
                    target="_blank"
                    className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors duration-300"
                    rel="noreferrer"
                    aria-label="Telegram"
                  >
                    <i className="fab fa-telegram text-2xl"></i>
                    <span className="text-sm">Telegram</span>
                  </a>
                  <a
                    href="https://youtube.com/@nub-coder"
                    target="_blank"
                    className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors duration-300"
                    rel="noreferrer"
                    aria-label="YouTube"
                  >
                    <i className="fab fa-youtube text-2xl"></i>
                    <span className="text-sm">YouTube</span>
                  </a>
                  <a
                    href="mailto:dev@nubcoder.com"
                    className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors duration-300"
                    aria-label="Email"
                  >
                    <i className="fas fa-envelope text-2xl"></i>
                    <span className="text-sm">Email</span>
                  </a>
                </div>
              </section>
            </AnimationWrapper>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <section className="py-8">
                <h2 className="section-title">
                  <ScrollRevealText text="About Me" />
                </h2>
                <p className="text-center text-lg text-[var(--text-secondary)]/70 max-w-3xl mx-auto mt-4 mb-12">
                  I'm a passionate full-stack developer who loves building products that make a difference.
                  With 4+ years of experience, I've helped startups and businesses bring their ideas to life
                  through clean code, scalable architecture, and user-focused design.
                  I specialize in modern web technologies and enjoy solving complex technical challenges.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="project-card">
                    <i className="fas fa-code text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">4+ Years Experience</h3>
                    <p className="text-[var(--text-secondary)]/70">Building production-ready applications for startups, agencies, and enterprises across various industries</p>
                  </div>
                  <div className="project-card">
                    <i className="fas fa-project-diagram text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">10+ Projects Delivered</h3>
                    <p className="text-[var(--text-secondary)]/70">From e-commerce platforms to API services, each project built with attention to performance, security, and user experience</p>
                  </div>
                  <div className="project-card">
                    <i className="fas fa-users text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">Client-First Approach</h3>
                    <p className="text-[var(--text-secondary)]/70">Clear communication, reliable delivery, and a focus on solving real business problems with technology</p>
                  </div>
                </div>
              </section>
            </AnimationWrapper>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <Skills />
            </AnimationWrapper>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <Projects />
            </AnimationWrapper>
          )}

          {/* GitHub Tab */}
          {activeTab === "github" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <GitHubStats />
            </AnimationWrapper>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <AnimationWrapper animation="zoom" delay={0}>
              <ContactForm />
            </AnimationWrapper>
          )}
        </div>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--accent)] shadow-lg shadow-[rgba(245,246,247,0.18)] flex items-center justify-center transform transition-all duration-300 
          ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}