import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";
import AnimationWrapper from "@/components/AnimationWrapper";
import ScrollRevealText from "@/components/ScrollRevealText";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import profileImage from "/assets/profile.jpg";

// GitHub Stats component with actual data
function GitHubStats() {
  return (
    <section id="github-stats" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="GitHub Stats" />
      </h2>
      
      <div className="mt-8 bg-[var(--dark)] rounded-xl p-8 border border-[var(--primary)]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              <ScrollRevealText 
                text="Ankit Kumar's GitHub Stats"
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
                G+
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

  return (
    <>
      <Navbar />

      <main className="pt-24 px-4 md:px-10 lg:px-20">
        {/* Hero Section */}
        <section id="home" className="relative min-h-[80vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto py-16 overflow-hidden">
          <AnimationWrapper animation="top" delay={300}>
            <div className="animate-[float_3s_ease-in-out_infinite] mb-8">
              <img 
                src={profileImage} 
                alt="Dev's Profile" 
                className="w-32 h-32 rounded-full border-4 border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20"
              />
            </div>
          </AnimationWrapper>

          <AnimationWrapper animation="left" delay={700}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <ScrollRevealText 
                text="Full Stack Developer" 
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
              />
            </h1>
          </AnimationWrapper>

          <AnimationWrapper animation="right" delay={1100}>
            <div className="h-16">
              <ScrollRevealText 
                text="Building digital experiences that combine creativity with technical excellence"
                className="text-xl md:text-2xl mb-8 inline-block"
                delay={0.5}
              />
            </div>
          </AnimationWrapper>

          <AnimationWrapper animation="bottom" delay={1500}>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a 
                href="https://t.me/nub_coder_s" 
                target="_blank" 
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-all duration-300 transform hover:-translate-y-1"
                rel="noreferrer"
              >
                <i className="fab fa-telegram"></i>
                Telegram
              </a>
              <a 
                href="https://youtube.com/@nub-coder" 
                target="_blank" 
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-all duration-300 transform hover:-translate-y-1"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i>
                YouTube
              </a>
            </div>
          </AnimationWrapper>

        </section>

        {/* About Section */}
        <section id="about" className="py-16 max-w-6xl mx-auto">
          <AnimationWrapper animation="zoom" delay={1900}>
            <h2 className="section-title">
              <ScrollRevealText text="About Me" />
            </h2>
          </AnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimationWrapper animation="left" delay={2300}>
              <div className="project-card">
                <i className="fas fa-code text-5xl text-[var(--primary)] mb-4"></i>
                <h3 className="text-xl font-semibold mb-3">4 Years Experience</h3>
                <p className="text-[var(--light)]/70">Delivering high-quality web solutions across various industries</p>
              </div>
            </AnimationWrapper>
            <AnimationWrapper animation="top" delay={2600}>
              <div className="project-card">
                <i className="fas fa-project-diagram text-5xl text-[var(--primary)] mb-4"></i>
                <h3 className="text-xl font-semibold mb-3">35 Projects</h3>
                <p className="text-[var(--light)]/70">Successfully completed projects ranging from startups to enterprises</p>
              </div>
            </AnimationWrapper>
            <AnimationWrapper animation="right" delay={2900}>
              <div className="project-card">
                <i className="fas fa-users text-5xl text-[var(--primary)] mb-4"></i>
                <h3 className="text-xl font-semibold mb-3">Client Focused</h3>
                <p className="text-[var(--light)]/70">Dedicated to understanding and exceeding client expectations</p>
              </div>
            </AnimationWrapper>
          </div>
        </section>

        {/* Skills Section */}
        <AnimationWrapper animation="bottom" delay={3300}>
          <Skills />
        </AnimationWrapper>

        {/* Projects Section */}
        <AnimationWrapper animation="left" delay={3700}>
          <Projects />
        </AnimationWrapper>

        {/* GitHub Stats Section */}
        <AnimationWrapper animation="right" delay={4100}>
          <GitHubStats />
        </AnimationWrapper>

        {/* Testimonials Section */}
        <AnimationWrapper animation="top" delay={4500}>
          <Testimonials />
        </AnimationWrapper>

        {/* Contact Section */}
        <AnimationWrapper animation="zoom" delay={4900}>
          <ContactForm />
        </AnimationWrapper>
      </main>

      <AnimationWrapper animation="top" delay={5300}>
        <footer className="bg-[var(--dark)] border-t border-[var(--primary)]/10 py-10">
          <div className="container mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <img src={profileImage} alt="Dev's Profile" className="w-10 h-10 rounded-full border-2 border-[var(--primary)]" />
                  <div className="text-2xl font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">DEV</div>
                </div>
                <p className="text-[var(--light)]/70 mb-6">Professional web developer creating impactful digital experiences</p>
              </div>

              <div className="md:col-span-1">
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <div className="flex items-center gap-4 text-xl">
                  <a
                    href="https://t.me/nub_coder_s"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--primary)]/30 text-[var(--light)]/80 hover:text-[var(--light)] hover:border-[var(--primary)]/60 transition-colors duration-300"
                  >
                    <i className="fab fa-telegram"></i>
                  </a>
                  <a
                    href="https://youtube.com/@nub-coder"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--primary)]/30 text-[var(--light)]/80 hover:text-[var(--light)] hover:border-[var(--primary)]/60 transition-colors duration-300"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    href="mailto:dev@nubcoder.com"
                    aria-label="Email"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--primary)]/30 text-[var(--light)]/80 hover:text-[var(--light)] hover:border-[var(--primary)]/60 transition-colors duration-300"
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--primary)]/10 mt-8 pt-8 text-center text-[var(--light)]/60">
              <p>&copy; {new Date().getFullYear()} Dev. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </AnimationWrapper>

      {/* Back to Top Button */}
      <AnimationWrapper animation="rotate" delay={5700}>
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 flex items-center justify-center transform transition-all duration-300 
            ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </AnimationWrapper>
    </>
  );
}