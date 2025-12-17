import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import profileImage from "/assets/profile.jpg";

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
          {/* Brand logo removed from header */}
        </div>
        
        
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
        {/* Projects link removed from mobile menu */}
      </div>
    </>
  );
}
