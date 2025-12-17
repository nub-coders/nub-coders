import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import profileImage from "@assets/profile.jpg";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <nav className={`navbar fixed top-0 left-0 right-0 bg-[var(--dark)]/95 backdrop-blur-md py-4 px-6 md:px-10 flex justify-between items-center z-40 border-b border-[var(--primary)]/10 transition-all duration-300 ${isScrolled ? 'py-3 shadow-lg' : 'py-4'}`}>
        <div className="flex items-center gap-4">
          <img src={profileImage} alt="Dev's Profile" className="w-10 h-10 rounded-full border-2 border-[var(--primary)]" />
          <div className="text-2xl font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">DEV</div>
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="absolute left-1/2 -translate-x-1/2 bg-[var(--dark)]/80 border border-[var(--primary)]/20 rounded-full p-2 hidden md:flex items-center justify-center transition-all duration-300 hover:border-[var(--primary)]/50"
        >
          <i className={`fas ${theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon text-[var(--primary)]"}`}></i>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-home"></i> Home
          </a>
          <a href="#about" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-user"></i> About
          </a>
          <a href="#skills" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-code"></i> Skills
          </a>
          <a href="#projects" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-project-diagram"></i> Projects
          </a>
          <a href="#testimonials" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-star"></i> Testimonials
          </a>
          <a href="#contact" className="text-[var(--light)]/90 hover:text-[var(--light)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-all duration-300">
            <i className="fas fa-envelope"></i> Contact
          </a>
          <a 
            href="https://dockers.nubcoder.com/" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-all duration-300 text-[var(--light)]/90 hover:text-[var(--light)]"
          >
            <i className="fab fa-docker"></i> Docker Projects
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--secondary)] text-[var(--darker)]">New</span>
          </a>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button onClick={toggleMobileMenu} className="md:hidden text-2xl">
          <i className="fas fa-bars"></i>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[var(--darker)]/95 backdrop-blur-lg z-50 transform transition-transform duration-300 flex flex-col justify-center items-center gap-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={closeMobileMenu} className="absolute top-6 right-6 text-2xl">
          <i className="fas fa-times"></i>
        </button>
        
        <a href="#home" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-home"></i> Home
        </a>
        <a href="#about" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-user"></i> About
        </a>
        <a href="#skills" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-code"></i> Skills
        </a>
        <a href="#projects" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-project-diagram"></i> Projects
        </a>
        <a href="#testimonials" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-star"></i> Testimonials
        </a>
        <a href="#contact" onClick={closeMobileMenu} className="text-xl flex items-center gap-3">
          <i className="fas fa-envelope"></i> Contact
        </a>
        <a href="https://dockers.nubcoder.com/" target="_blank" rel="noreferrer" className="text-xl flex items-center gap-3">
          <i className="fab fa-docker"></i> Docker Projects
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--secondary)] text-[var(--darker)]">New</span>
        </a>
        
        {/* Mobile Theme Toggle */}
        <button onClick={toggleTheme} className="mt-6 bg-[var(--dark)]/80 border border-[var(--primary)]/20 rounded-full p-3 flex items-center justify-center">
          <i className={`fas ${theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon text-[var(--primary)]"} text-xl`}></i>
        </button>
      </div>
    </>
  );
}
