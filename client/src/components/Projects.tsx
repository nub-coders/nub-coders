import { useState, useEffect } from "react";
import ScrollRevealText from "./ScrollRevealText";

type ProjectCategory = "all" | "web" | "api";

interface Project {
  title: string;
  description: string;
  category: Exclude<ProjectCategory, "all">;
  image: string;
  tags: string[];
  demoLink: string;
  codeLink: string;
  badgeText: string;
  badgeClass: string;
}

const projects: Project[] = [
  {
    title: "Docker PaaS Platform",
    description: "Built a complete Platform-as-a-Service for Docker container management. Enables teams to deploy, monitor, and scale applications with zero DevOps knowledge. Integrated GitHub webhooks for CI/CD automation and real-time WebSocket monitoring. Result: Reduced deployment time by 70% for client teams.",
    category: "web",
    image: "/assets/projects/docker-paas.png",
    tags: ["React", "TypeScript", "Docker API", "MongoDB", "WebSocket"],
    demoLink: "https://dockers.nubcoder.com",
    codeLink: "",
    badgeText: "Platform",
    badgeClass: "bg-[var(--primary)]/14 text-[var(--primary)]"
  },
  {
    title: "NubMail",
    description: "Self-hosted email management system built for privacy-conscious teams. Features custom domain support, built-in SMTP server, Microsoft Graph integration, and API key authentication. Designed with shadcn/ui for modern UX. Currently managing 1000+ emails daily.",
    category: "web",
    image: "/assets/projects/nubmail.png",
    tags: ["Next.js", "PostgreSQL", "SMTP", "Microsoft Graph", "shadcn/ui"],
    demoLink: "https://mails.nubcoder.com",
    codeLink: "",
    badgeText: "SaaS",
    badgeClass: "bg-[var(--primary)]/14 text-[var(--primary)]"
  },
  {
    title: "YT-DLP API",
    description: "High-performance FastAPI service for YouTube video metadata extraction. Built with yt-dlp integration, Redis caching for speed, token-based authentication, and rate limiting. Serves 5K+ API calls daily with 99.9% uptime. Fully containerized for easy deployment.",
    category: "api",
    image: "/assets/projects/ytdlp.png",
    tags: ["FastAPI", "Python", "yt-dlp", "Redis", "Docker"],
    demoLink: "https://api.nubcoder.com",
    codeLink: "",
    badgeText: "API Service",
    badgeClass: "bg-[var(--accent)]/20 text-[var(--secondary)]"
  }
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      const filtered = activeFilter === "all"
        ? projects
        : projects.filter(project => project.category === activeFilter);
      setFilteredProjects(filtered);
      setIsAnimating(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  return (
    <section id="projects" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Projects" />
      </h2>

      <div className="tabs flex flex-wrap justify-center gap-4 mb-12">
        {(["all", "web", "api"] as ProjectCategory[]).map((filter) => {
          const labels: Record<ProjectCategory, string> = { all: "All Projects", web: "Web Apps", api: "API Services" };
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)] bg-[rgba(245,246,247,0.10)]"
                  : "border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[rgba(245,246,247,0.06)]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={index}
            className={`rounded-[28px] overflow-hidden border border-[var(--glass-border)] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[rgba(245,246,247,0.10)] group ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.06) 0%, rgba(43, 46, 51, 0.9) 100%)',
              boxShadow: '0 18px 48px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 24px rgba(245, 246, 247, 0.04)',
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent">
                  {project.title}
                </h3>
                <span className={`px-3 py-1 text-xs rounded ${project.badgeClass} whitespace-nowrap`}>
                  {project.badgeText}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mb-6 text-base leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 text-sm rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)]"
                    style={{
                      background: 'rgba(245, 246, 247, 0.04)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--accent)] hover:bg-[var(--secondary)] transition-all duration-300 text-base font-medium shadow-lg shadow-[rgba(245,246,247,0.14)]"
                >
                  <i className="fas fa-external-link-alt"></i>
                  View Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
