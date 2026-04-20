import { useState } from "react";
import ScrollRevealText from "./ScrollRevealText";

type SkillTab = "frontend" | "backend" | "database" | "devops" | "other";

interface SkillItem {
  name: string;
  proficiency: number;
}

const skillsData: Record<SkillTab, SkillItem[]> = {
  frontend: [
    { name: "JavaScript", proficiency: 95 },
    { name: "React", proficiency: 90 },
    { name: "HTML/CSS", proficiency: 98 },
    { name: "Tailwind CSS", proficiency: 92 },
    { name: "TypeScript", proficiency: 88 }
  ],
  backend: [
    { name: "Node.js", proficiency: 92 },
    { name: "Python", proficiency: 88 },
    { name: "Express.js", proficiency: 90 },
    { name: "Django", proficiency: 85 },
    { name: "GraphQL", proficiency: 82 }
  ],
  database: [
    { name: "MongoDB", proficiency: 92 },
    { name: "PostgreSQL", proficiency: 87 },
    { name: "MySQL", proficiency: 85 },
    { name: "Redis", proficiency: 80 }
  ],
  devops: [
    { name: "Docker", proficiency: 95 },
    { name: "AWS", proficiency: 88 }
  ],
  other: [
    { name: "Git", proficiency: 95 },
    { name: "UI/UX Design", proficiency: 82 }
  ]
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState<SkillTab>("frontend");

  return (
    <section id="skills" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Skills & Expertise" />
      </h2>

      <div className="tabs flex flex-wrap justify-center gap-4 mb-12">
        {(Object.keys(skillsData) as SkillTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              className={`tab-flip px-4 py-2 rounded-lg ${isActive
                ? "bg-[var(--primary)]/10 border border-[var(--glass-border)]"
                : "bg-[var(--dark)] border border-[var(--glass-border)]"
                } hover:bg-[var(--primary)]/12 transition-all duration-300 ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          );
        })}
      </div>

      <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flip-panel">
        {skillsData[activeTab].map((skill, index) => (
          <div
            key={index}
            className="rounded-[28px] p-6 border border-[var(--glass-border)]"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.06) 0%, rgba(43, 46, 51, 0.9) 100%)',
              boxShadow: '0 18px 48px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 24px rgba(245, 246, 247, 0.04)'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">{skill.name}</h3>
              <span className="text-sm font-semibold text-[var(--secondary)]">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-[rgba(245,246,247,0.06)] rounded-full h-2.5 border border-[var(--glass-border)]">
              <div
                className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] h-2.5 rounded-full transition-all duration-1000 shadow-lg shadow-[rgba(245,246,247,0.18)]"
                style={{ width: `${skill.proficiency}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
