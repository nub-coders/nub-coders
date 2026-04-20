import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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

      <div
        className="mt-8 rounded-[28px] p-8 border border-[var(--glass-border)]"
        style={{
          background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.08) 0%, rgba(43, 46, 51, 0.88) 100%)',
          boxShadow: '0 18px 50px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 24px rgba(245, 246, 247, 0.05)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              <ScrollRevealText
                text="Development Activity"
                className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent"
              />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <i className="fas fa-star text-[var(--secondary)]"></i>
                <span className="font-medium">Total Stars Earned:</span>
                <span className="text-[var(--primary)]">14</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-code-commit text-[var(--secondary)]"></i>
                <span className="font-medium">Total Commits (2025):</span>
                <span className="text-[var(--primary)]">84</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-code-branch text-[var(--secondary)]"></i>
                <span className="font-medium">Total PRs:</span>
                <span className="text-[var(--primary)]">5</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-[var(--secondary)]"></i>
                <span className="font-medium">Total Issues:</span>
                <span className="text-[var(--primary)]">0</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-users text-[var(--secondary)]"></i>
                <span className="font-medium">Contributed to (last year):</span>
                <span className="text-[var(--primary)]">2</span>
              </li>
            </ul>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center border border-[var(--glass-border)]"
              style={{
                background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.08) 0%, rgba(43, 46, 51, 0.92) 100%)'
              }}
            >
              <div className="text-6xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div
            className="rounded-2xl p-4 border border-[var(--glass-border)] flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.05) 0%, rgba(43, 46, 51, 0.88) 100%)'
            }}
          >
            <span className="text-sm text-[var(--text-secondary)]">Total Commits</span>
            <span className="text-xl font-bold text-[var(--primary)]">84</span>
          </div>
          <div
            className="rounded-2xl p-4 border border-[var(--glass-border)] flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.05) 0%, rgba(43, 46, 51, 0.88) 100%)'
            }}
          >
            <span className="text-sm text-[var(--text-secondary)]">Total Commits (2025)</span>
            <span className="text-xl font-bold text-[var(--primary)]">84</span>
          </div>
          <div
            className="rounded-2xl p-4 border border-[var(--glass-border)] flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.05) 0%, rgba(43, 46, 51, 0.88) 100%)'
            }}
          >
            <span className="text-sm text-[var(--text-secondary)]">Total PRs</span>
            <span className="text-xl font-bold text-[var(--primary)]">5</span>
          </div>
          <div
            className="rounded-2xl p-4 border border-[var(--glass-border)] flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 246, 247, 0.05) 0%, rgba(43, 46, 51, 0.88) 100%)'
            }}
          >
            <span className="text-sm text-[var(--text-secondary)]">Contributed to (last year)</span>
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
                    <h3 className="text-xl font-semibold mb-3">35+ Projects Delivered</h3>
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