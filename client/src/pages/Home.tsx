import { useEffect } from "react";
import "./portfolio.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Nav from "@/sections/Nav";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import TechStackSection from "@/sections/TechStackSection";
import ProjectsSection from "@/sections/ProjectsSection";
import NowSection from "@/sections/NowSection";
import GitHubStatsSection from "@/sections/GitHubStatsSection";
import ContactSection from "@/sections/ContactSection";
import Footer from "@/sections/Footer";

export default function Home() {
  useScrollReveal();

  useEffect(() => {
    document.body.classList.add("portfolio-skin");
    return () => document.body.classList.remove("portfolio-skin");
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <HeroSection />
        <div className="divider" />
        <AboutSection />
        <div className="divider" />
        <TechStackSection />
        <div className="divider" />
        <ProjectsSection />
        <div className="divider" />
        <NowSection />
        <div className="divider" />
        <GitHubStatsSection />
        <div className="divider" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
