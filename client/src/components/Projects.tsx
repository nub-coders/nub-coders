import { useState, useEffect } from "react";
import ScrollRevealText from "./ScrollRevealText";

type ProjectCategory = "all" | "web" | "mobile" | "api";

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
    description: "Web application for Docker container deployment and management with GitHub integration and real-time monitoring.",
    category: "web",
    image: "/assets/projects/docker-paas.png",
    tags: ["React", "TypeScript", "Docker API", "MongoDB", "WebSocket"],
    demoLink: "https://dockers.nubcoder.com",
    codeLink: "",
    badgeText: "Proxy Tool",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "nginx-proxy",
    description: "Automatic virtual host reverse proxy for Docker with Let's Encrypt SSL certificate management.",
    category: "web",
    image: "/assets/projects/nginx-proxy.png",
    tags: ["NGINX", "Docker", "Let's Encrypt", "ACME"],
    demoLink: "",
    codeLink: "",
    badgeText: "Proxy Tool",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "NubMail",
    description: "Self-hosted email management system with custom domain support, built-in SMTP, and API key authentication.",
    category: "web",
    image: "/assets/projects/nubmail.png",
    tags: ["Next.js", "PostgreSQL", "SMTP", "Microsoft Graph", "shadcn/ui"],
    demoLink: "https://mails.nubcoder.com",
    codeLink: "",
    badgeText: "Proxy Tool",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "YT-DLP API",
    description: "FastAPI service for YouTube video information extraction with token-based authentication and rate limiting.",
    category: "api",
    image: "/assets/projects/ytdlp.png",
    tags: ["FastAPI", "Python", "yt-dlp", "Redis", "Docker"],
    demoLink: "https://api.nubcoder.com",
    codeLink: "",
    badgeText: "API",
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
          className={`px-4 py-2 rounded-lg ${activeFilter === "mobile" ? "bg-[var(--primary)]/10 border border-[var(--primary)]/20" : "bg-[var(--dark)] border border-[var(--primary)]/10"} hover:bg-[var(--primary)]/20 transition-all duration-300`}
          onClick={() => setActiveFilter("mobile")}
        >
          Mobile Apps
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
            <div className="overflow-hidden">
              <a 
                href={project.demoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className={`px-2 py-1 text-xs rounded ${project.badgeClass}`}>
                  {project.badgeText}
                </span>
              </div>
              <p className="text-[var(--light)]/70 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 py-1 text-xs rounded bg-[var(--darker)]">
                    {tag}
                  </span>
                ))}
              </div>
              {/* CTA buttons removed per request */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
