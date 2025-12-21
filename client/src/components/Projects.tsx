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
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
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
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
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
    badgeClass: "bg-blue-500/20 text-blue-400"
  }
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    const filterProjects = () => {
      const filtered = activeFilter === "all" 
        ? projects 
        : projects.filter(project => project.category === activeFilter);
        
      setFilteredProjects(filtered);
      setIsAnimating(false);
    };
    
    // Add a small delay to allow animation to complete
    const timer = setTimeout(filterProjects, 300);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  return (
    <section id="projects" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Projects" />
      </h2>
      
      <div className="tabs flex flex-wrap justify-center gap-4 mb-12">
        <button 
          className={`px-4 py-2 rounded-lg ${activeFilter === "all" ? "bg-[var(--primary)]/10 border border-[var(--primary)]/20" : "bg-[var(--dark)] border border-[var(--primary)]/10"} hover:bg-[var(--primary)]/20 transition-all duration-300`}
          onClick={() => setActiveFilter("all")}
        >
          All Projects
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${activeFilter === "web" ? "bg-[var(--primary)]/10 border border-[var(--primary)]/20" : "bg-[var(--dark)] border border-[var(--primary)]/10"} hover:bg-[var(--primary)]/20 transition-all duration-300`}
          onClick={() => setActiveFilter("web")}
        >
          Web Apps
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${activeFilter === "api" ? "bg-[var(--primary)]/10 border border-[var(--primary)]/20" : "bg-[var(--dark)] border border-[var(--primary)]/10"} hover:bg-[var(--primary)]/20 transition-all duration-300`}
          onClick={() => setActiveFilter("api")}
        >
          API Services
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div 
            key={index} 
            className={`bg-[var(--dark)] rounded-xl overflow-hidden border border-[var(--primary)]/20 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--primary)]/5 group ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                  {project.title}
                </h3>
                <span className={`px-3 py-1 text-xs rounded ${project.badgeClass} whitespace-nowrap`}>
                  {project.badgeText}
                </span>
              </div>
              <p className="text-[var(--light)]/70 mb-6 text-base leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 text-sm rounded bg-[var(--darker)] border border-[var(--primary)]/10">
                    {tag}
                  </span>
                ))}
              </div>
              {project.demoLink && (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/80 transition-all duration-300 text-white text-base font-medium shadow-lg shadow-[var(--primary)]/30"
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
