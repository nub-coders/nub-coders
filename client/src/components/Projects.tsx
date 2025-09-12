import { useState, useEffect } from "react";

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
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.",
    category: "web",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe API"],
    demoLink: "https://ecommerce-demo.nub-coder.tech",
    codeLink: "https://github.com/nub-coders/ecommerce-platform",
    badgeText: "Web App",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "Fitness Tracker App",
    description: "A mobile app that tracks workouts, nutrition, and provides personalized fitness plans.",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["React Native", "Firebase", "Redux", "Health API"],
    demoLink: "https://fitness-tracker-demo.nub-coder.tech",
    codeLink: "https://github.com/nub-coders/fitness-tracker-app",
    badgeText: "Mobile App",
    badgeClass: "bg-[var(--secondary)]/20 text-[var(--secondary)]"
  },
  {
    title: "Banking API Service",
    description: "A secure RESTful API for banking operations with transaction management and authentication.",
    category: "api",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Node.js", "Express", "PostgreSQL", "JWT"],
    demoLink: "https://api-docs.nub-coder.tech/banking",
    codeLink: "https://github.com/nub-coders/banking-api-service",
    badgeText: "API",
    badgeClass: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "Real Estate Platform",
    description: "A comprehensive real estate platform with property listings, virtual tours, and financing options.",
    category: "web",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Vue.js", "Django", "PostgreSQL", "Google Maps API"],
    demoLink: "https://realestate-demo.nub-coder.tech",
    codeLink: "https://github.com/nub-coders/real-estate-platform",
    badgeText: "Web App",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "Travel Companion App",
    description: "A travel companion app with itinerary planning, local recommendations, and offline maps.",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Flutter", "Firebase", "Google Places API", "Mapbox"],
    demoLink: "https://travel-companion-demo.nub-coder.tech",
    codeLink: "https://github.com/nub-coders/travel-companion-app",
    badgeText: "Mobile App",
    badgeClass: "bg-[var(--secondary)]/20 text-[var(--secondary)]"
  },
  {
    title: "Weather Data API",
    description: "A comprehensive weather data API with historical data, forecasting, and real-time updates.",
    category: "api",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "FastAPI", "Redis", "Docker"],
    demoLink: "https://api-docs.nub-coder.tech/weather",
    codeLink: "https://github.com/nub-coders/weather-data-api",
    badgeText: "API",
    badgeClass: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "YT-DLP API Service",
    description: "FastAPI service for YouTube video extraction with integrated Telegram bot and token-based authentication.",
    category: "api",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["FastAPI", "Python", "yt-dlp", "Telegram Bot", "Redis"],
    demoLink: "https://api.nub-coder.tech",
    codeLink: "#",
    badgeText: "API",
    badgeClass: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "Docker PaaS Platform",
    description: "Telegram Mini App for Docker container management with GitHub integration and real-time monitoring.",
    category: "web",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["React", "TypeScript", "Docker API", "MongoDB", "Telegram"],
    demoLink: "https://dockers.nub-coder.tech",
    codeLink: "#",
    badgeText: "Web App",
    badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    title: "Music Bot",
    description: "Python-based Telegram music bot with advanced playback features and playlist management.",
    category: "api",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "Telegram Bot", "Music API", "Audio Processing"],
    demoLink: "https://t.me/nub_music_bot",
    codeLink: "https://github.com/nub-coders/nub-music-bot",
    badgeText: "API",
    badgeClass: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "MAGISK Flasher V2",
    description: "Android tool for Magisk installation and management with automated flashing capabilities.",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "Android", "Magisk", "Mobile Tools"],
    demoLink: "https://github.com/nub-coders/MAGISK-FLASHER-V2/releases",
    codeLink: "https://github.com/nub-coders/MAGISK-FLASHER-V2",
    badgeText: "Mobile App",
    badgeClass: "bg-[var(--secondary)]/20 text-[var(--secondary)]"
  },
  {
    title: "Kixer Password Tool",
    description: "Python tool for generating all possible password combinations with customizable parameters.",
    category: "api",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "Security", "Password Generator", "CLI Tool"],
    demoLink: "https://github.com/nub-coders/kixer#usage",
    codeLink: "https://github.com/nub-coders/kixer",
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
      <h2 className="section-title">Projects</h2>
      
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
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
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
              <div className="flex gap-3">
                <a 
                  href={project.demoLink} 
                  className={`px-3 py-2 rounded ${
                    project.category === "web" 
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20" 
                      : project.category === "mobile" 
                        ? "bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)]/20" 
                        : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  } transition-all duration-300`}
                >
                  <i className={`${project.category === "web" ? "fas fa-link" : project.category === "mobile" ? "fas fa-mobile-alt" : "fas fa-book"} mr-2`}></i>
                  {project.category === "web" ? "Live Demo" : project.category === "mobile" ? "App Store" : "API Docs"}
                </a>
                <a href={project.codeLink} className="px-3 py-2 rounded bg-[var(--dark)] border border-[var(--primary)]/20 hover:bg-[var(--darker)] transition-all duration-300">
                  <i className="fab fa-github mr-2"></i> Code
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
