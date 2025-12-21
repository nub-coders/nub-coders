import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";
import AnimationWrapper from "@/components/AnimationWrapper";
import ScrollRevealText from "@/components/ScrollRevealText";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import profileImage from "/assets/profile.jpg";

type TabType = "home" | "about" | "skills" | "projects" | "github" | "contact";

// Coding Stats component with actual data
function GitHubStats() {
  return (
    <section id="github-stats" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Coding Stats" />
      </h2>
      
      <div className="mt-8 bg-[var(--dark)] rounded-xl p-8 border border-[var(--primary)]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              <ScrollRevealText 
                text="Development Activity"
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
              />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <i className="fas fa-star text-yellow-400"></i>
                <span className="font-medium">Total Stars Earned:</span> 
                <span className="text-[var(--primary)]">14</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-code-commit text-green-400"></i>
                <span className="font-medium">Total Commits (2025):</span> 
                <span className="text-[var(--primary)]">84</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-code-branch text-purple-400"></i>
                <span className="font-medium">Total PRs:</span> 
                <span className="text-[var(--primary)]">5</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-red-400"></i>
                <span className="font-medium">Total Issues:</span> 
                <span className="text-[var(--primary)]">0</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-users text-blue-400"></i>
                <span className="font-medium">Contributed to (last year):</span> 
                <span className="text-[var(--primary)]">2</span>
              </li>
            </ul>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="w-48 h-48 bg-[var(--darker)] rounded-full flex items-center justify-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-[var(--darker)] rounded-lg p-4 border border-[var(--primary)]/10 flex flex-col items-center text-center">
            <span className="text-sm text-[var(--light)]/70">Total Commits</span>
            <span className="text-xl font-bold text-[var(--primary)]">84</span>
          </div>
          <div className="bg-[var(--darker)] rounded-lg p-4 border border-[var(--primary)]/10 flex flex-col items-center text-center">
            <span className="text-sm text-[var(--light)]/70">Total Commits (2025)</span>
            <span className="text-xl font-bold text-[var(--primary)]">84</span>
          </div>
          <div className="bg-[var(--darker)] rounded-lg p-4 border border-[var(--primary)]/10 flex flex-col items-center text-center">
            <span className="text-sm text-[var(--light)]/70">Total PRs</span>
            <span className="text-xl font-bold text-[var(--primary)]">5</span>
          </div>
          <div className="bg-[var(--darker)] rounded-lg p-4 border border-[var(--primary)]/10 flex flex-col items-center text-center">
            <span className="text-sm text-[var(--light)]/70">Contributed to (last year)</span>
            <span className="text-xl font-bold text-[var(--primary)]">2</span>
          </div>
        </div>
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
        <div className="max-w-6xl mx-auto mb-8 w-full">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4 bg-[var(--dark)]/50 backdrop-blur-sm rounded-2xl border border-[var(--primary)]/20 sticky top-20 z-30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 transform ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-105'
                    : 'bg-[var(--darker)]/50 text-[var(--light)]/70 hover:text-[var(--light)] hover:bg-[var(--primary)]/10 hover:scale-105'
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
                <div className="animate-[float_3s_ease-in-out_infinite] mb-6">
                  <img 
                    src={profileImage} 
                    alt="Ankit Kumar - Full Stack Developer" 
                    className="w-32 h-32 rounded-full border-4 border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20"
                  />
                </div>

                <p className="text-lg md:text-xl text-[var(--light)]/70 mb-2">Hi, I'm</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                    Ankit Kumar
                  </span>
                </h1>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  <ScrollRevealText 
                    text="Full Stack Developer" 
                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
                  />
                </h2>

                <div className="max-w-3xl mb-6">
                  <ScrollRevealText 
                    text="I build scalable web applications and API services with React, Node.js, and Docker. Specialized in turning complex problems into elegant digital solutions."
                    className="text-xl md:text-2xl text-[var(--light)]/80"
                    delay={0.5}
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <button 
                    onClick={() => setActiveTab("projects")}
                    className="flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/80 transition-all duration-300 transform hover:-translate-y-1 text-white font-semibold shadow-lg shadow-[var(--primary)]/30"
                  >
                    <i className="fas fa-code"></i>
                    View My Work
                  </button>
                  <button 
                    onClick={() => setActiveTab("contact")}
                    className="flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border-2 border-[var(--primary)] transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                  >
                    <i className="fas fa-envelope"></i>
                    Let's Talk
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-[var(--light)]/60">
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
                <p className="text-center text-lg text-[var(--light)]/70 max-w-3xl mx-auto mt-4 mb-12">
                  I'm a passionate full-stack developer who loves building products that make a difference. 
                  With 4+ years of experience, I've helped startups and businesses bring their ideas to life 
                  through clean code, scalable architecture, and user-focused design. 
                  I specialize in modern web technologies and enjoy solving complex technical challenges.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="project-card">
                    <i className="fas fa-code text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">4+ Years Experience</h3>
                    <p className="text-[var(--light)]/70">Building production-ready applications for startups, agencies, and enterprises across various industries</p>
                  </div>
                  <div className="project-card">
                    <i className="fas fa-project-diagram text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">35+ Projects Delivered</h3>
                    <p className="text-[var(--light)]/70">From e-commerce platforms to API services, each project built with attention to performance, security, and user experience</p>
                  </div>
                  <div className="project-card">
                    <i className="fas fa-users text-5xl text-[var(--primary)] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-3">Client-First Approach</h3>
                    <p className="text-[var(--light)]/70">Clear communication, reliable delivery, and a focus on solving real business problems with technology</p>
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
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 flex items-center justify-center transform transition-all duration-300 
          ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}