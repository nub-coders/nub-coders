import { useState } from "react";

type SkillTab = "frontend" | "backend" | "database" | "devops" | "other";

interface SkillItem {
  name: string;
  proficiency: number;
}

const skillsData: Record<SkillTab, SkillItem[]> = {
  frontend: [
    { name: "JavaScript", proficiency: 95 },
    { name: "React", proficiency: 90 },
    { name: "Vue.js", proficiency: 85 },
    { name: "HTML/CSS", proficiency: 98 },
    { name: "Tailwind CSS", proficiency: 92 },
    { name: "TypeScript", proficiency: 88 }
  ],
  backend: [
    { name: "Node.js", proficiency: 92 },
    { name: "Python", proficiency: 88 },
    { name: "Express.js", proficiency: 90 },
    { name: "Django", proficiency: 85 },
    { name: "GraphQL", proficiency: 82 },
    { name: "PHP", proficiency: 78 }
  ],
  database: [
    { name: "MongoDB", proficiency: 92 },
    { name: "PostgreSQL", proficiency: 87 },
    { name: "MySQL", proficiency: 85 },
    { name: "Redis", proficiency: 80 }
  ],
  devops: [
    { name: "Docker", proficiency: 95 },
    { name: "Kubernetes", proficiency: 83 },
    { name: "AWS", proficiency: 88 },
    { name: "CI/CD", proficiency: 85 }
  ],
  other: [
    { name: "Git", proficiency: 95 },
    { name: "UI/UX Design", proficiency: 82 },
    { name: "Agile/Scrum", proficiency: 90 }
  ]
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState<SkillTab>("frontend");

  return (
    <section id="skills" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">Skills & Expertise</h2>
      
      <div className="tabs flex flex-wrap justify-center gap-4 mb-12">
        {(Object.keys(skillsData) as SkillTab[]).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-[var(--primary)]/10 border border-[var(--primary)]/20"
                : "bg-[var(--dark)] border border-[var(--primary)]/10"
            } hover:bg-[var(--primary)]/20 transition-all duration-300`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsData[activeTab].map((skill, index) => (
          <div key={index} className="bg-[var(--dark)] rounded-xl p-6 border border-[var(--primary)]/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">{skill.name}</h3>
              <span className="text-sm font-semibold text-[var(--secondary)]">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-[var(--darker)] rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${skill.proficiency}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
