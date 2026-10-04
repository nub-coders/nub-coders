import "./portfolio.css";
import Nav from "@/sections/Nav";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import TechStackSection from "@/sections/TechStackSection";
import ProjectsSection from "@/sections/ProjectsSection";
import NowSection from "@/sections/NowSection";
import ContactSection from "@/sections/ContactSection";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <TechStackSection />
        <NowSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
