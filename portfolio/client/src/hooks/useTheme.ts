import { useState, useEffect } from "react";

// Define the theme types
export type Theme = "dark" | "light";

/**
 * Hook for managing theme (dark/light mode)
 */
export const useTheme = () => {
  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      return savedTheme || "dark";
    }
    return "dark";
  });

  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Update localStorage and apply body class when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      
      if (theme === "light") {
        document.body.classList.add("light-mode");
      } else {
        document.body.classList.remove("light-mode");
      }
    }
  }, [theme]);

  return { theme, toggleTheme };
};
