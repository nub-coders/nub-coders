import { useState, useEffect } from "react";


/**
 * Hook for managing theme (dark/light mode)
 */
export const useTheme = () => {
  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    return "dark";
  });

  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    setTheme("dark");
  };

  // Update localStorage and apply body class when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
};
