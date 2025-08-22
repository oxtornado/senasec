import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false");
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
