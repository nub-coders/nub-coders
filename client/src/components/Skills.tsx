import { useState } from "react";
import ScrollRevealText from "./ScrollRevealText";
import { useGitHubStats, type SkillEntry } from "@/hooks/useGitHubStats";

type SkillTab = "frontend" | "backend" | "database" | "devops" | "other";

// ── Static fallback data (shown when GitHub has no data for a skill) ───────────
// These represent tools/skills GitHub language bytes don't capture well.
const STATIC_SKILLS: Record<SkillTab, { name: string; proficiency: number }[]> = {
  frontend: [
    { name: "JavaScript", proficiency: 95 },
    { name: "React", proficiency: 90 },
    { name: "HTML/CSS", proficiency: 98 },
    { name: "Tailwind CSS", proficiency: 92 },
    { name: "TypeScript", proficiency: 88 },
  ],
  backend: [
    { name: "Node.js", proficiency: 92 },
    { name: "Python", proficiency: 88 },
    { name: "Express.js", proficiency: 90 },
    { name: "Django", proficiency: 85 },
    { name: "GraphQL", proficiency: 82 },
  ],
  database: [
    { name: "MongoDB", proficiency: 92 },
    { name: "PostgreSQL", proficiency: 87 },
    { name: "MySQL", proficiency: 85 },
    { name: "Redis", proficiency: 80 },
  ],
  devops: [
    { name: "Docker", proficiency: 95 },
    { name: "AWS", proficiency: 88 },
  ],
  other: [
    { name: "Git", proficiency: 95 },
    { name: "UI/UX Design", proficiency: 82 },
  ],
};

// Skills that GitHub language bytes can never capture — always static
const ALWAYS_STATIC = new Set([
  "React", "Node.js", "Express.js", "Django", "GraphQL",
  "Tailwind CSS", "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Git", "UI/UX Design",
]);

// ── Merge GitHub live data over static fallbacks ──────────────────────────────
function mergeSkills(
  tab: SkillTab,
  githubSkills: SkillEntry[]
): { name: string; proficiency: number; isLive: boolean }[] {
  const ghForTab = githubSkills.filter((s) => s.category === tab);

  // Start from static list, overwrite proficiency where GitHub has data
  const base = STATIC_SKILLS[tab].map((s) => {
    const gh = ghForTab.find(
      (g) => g.name.toLowerCase() === s.name.toLowerCase()
    );
    return {
      name: s.name,
      proficiency: gh ? gh.proficiency : s.proficiency,
      isLive: !!gh,
    };
  });

  // Add GitHub skills not already in the static list
  const staticNames = new Set(base.map((s) => s.name.toLowerCase()));
  for (const gh of ghForTab) {
    if (!staticNames.has(gh.name.toLowerCase()) && !ALWAYS_STATIC.has(gh.name)) {
      base.push({ name: gh.name, proficiency: gh.proficiency, isLive: true });
    }
  }

  // Sort: live first (higher usage), then static
  return base.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return b.proficiency - a.proficiency;
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const [activeTab, setActiveTab] = useState<SkillTab>("frontend");
  const { data, isLoading } = useGitHubStats();

  const tabs: { id: SkillTab; label: string }[] = [
    { id: "frontend", label: "Frontend" },
    { id: "backend",  label: "Backend"  },
    { id: "database", label: "Database" },
    { id: "devops",   label: "DevOps"   },
    { id: "other",    label: "Other"    },
  ];

  // Use merged live+static, or fall back to pure static while loading
  const skills = data
    ? mergeSkills(activeTab, data.skillsMap)
    : STATIC_SKILLS[activeTab].map((s) => ({ ...s, isLive: false }));

  return (
    <section id="skills" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Skills & Expertise" />
      </h2>

      {/* Live badge */}
      <div className="flex justify-center mb-6">
        {data && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[rgba(245,246,247,0.05)] border border-[var(--glass-border)] px-3 py-1 rounded-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Proficiency scores derived from GitHub usage data
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="tabs flex flex-wrap justify-center gap-4 mb-12">
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              className={`tab-flip px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-[var(--primary)]/10 border border-[var(--glass-border)]"
                  : "bg-[var(--dark)] border border-[var(--glass-border)]"
              } hover:bg-[var(--primary)]/12 transition-all duration-300 ${
                isActive ? "is-active" : ""
              }`}
              onClick={() => setActiveTab(id)}
            >
              <span className="tab-label">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Skill cards */}
      <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flip-panel">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-[28px]" />
            ))
          : skills.map((skill, index) => (
              <div
                key={index}
                className="rounded-[28px] p-6 border border-[var(--glass-border)]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(245,246,247,0.06) 0%, rgba(43,46,51,0.9) 100%)",
                  boxShadow:
                    "0 18px 48px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 24px rgba(245,246,247,0.04)",
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{skill.name}</h3>
                    {skill.isLive && (
                      <span
                        title="Score derived from GitHub usage"
                        className="text-[10px] px-1.5 py-0.5 rounded-full border border-green-500/30 text-green-400 leading-none"
                      >
                        live
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[var(--secondary)]">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-[rgba(245,246,247,0.06)] rounded-full h-2.5 border border-[var(--glass-border)]">
                  <div
                    className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] h-2.5 rounded-full transition-all duration-1000 shadow-lg shadow-[rgba(245,246,247,0.18)]"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
