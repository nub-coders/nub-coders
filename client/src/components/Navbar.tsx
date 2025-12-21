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

  return (
    <nav className={`navbar fixed top-0 left-0 right-0 bg-[var(--dark)]/95 backdrop-blur-md py-4 px-6 md:px-10 flex justify-center items-center z-40 border-b border-[var(--primary)]/10 transition-all duration-300 ${isScrolled ? 'py-3 shadow-lg' : 'py-4'}`}>
      <div className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
        Ankit Kumar
      </div>
    </nav>
  );
}
