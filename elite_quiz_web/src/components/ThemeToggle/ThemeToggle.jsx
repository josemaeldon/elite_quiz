"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import { websettingsData } from "@/store/reducers/webSettings";
import { useSelector } from "react-redux";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const webSettings = useSelector(websettingsData);

  const primaryColor =
      webSettings && webSettings?.primary_color
        ? webSettings && webSettings?.primary_color
        : "#EF5388FF";

  // Effect to initialize theme from localStorage and setup listeners
  useEffect(() => {
    // Check if user already has a preference stored
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    
    // Check environment variable for initial dark mode setting
    const initialDarkMode = process.env.NEXT_PUBLIC_INITIAL_DARK_MODE === "true";
    // Set initial state based on localStorage, then env variable, then system preference
    if (storedTheme === "dark" || (storedTheme === "light" ? false : (initialDarkMode || (!storedTheme && prefersDark)))) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.style.setProperty("--primary-color", process.env.NEXT_PUBLIC_DARK_MODE_PRIMARY_COLOR);
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }



  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);

    const secondaryColor =
      webSettings && webSettings?.footer_color
        ? !isDarkMode
          ? "linear-gradient(180deg, rgba(255, 255, 255, 0.0512) 0%, rgba(255, 255, 255, 0.1024) 100%)"
          : webSettings?.footer_color
        : "#090029FF";

    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor
    );
    if (!isDarkMode) {
      // Switching to dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.style.setProperty("--primary-color", process.env.NEXT_PUBLIC_DARK_MODE_PRIMARY_COLOR);
    } else {
      // Switching to light mode
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.documentElement.style.setProperty("--primary-color", primaryColor);
    }
  };

  return (
    <Button
      className="hover:bg-primary-color flex items-center text-white h-[41px] relative bg-primary-color transition ease-in duration-500 rounded-[8px] border-transparent shadowBtn"
      onClick={toggleTheme}
    >
      <div className="relative w-4 h-4">
        {isDarkMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaSun className="text-yellow-300" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaMoon className="text-white" />
          </motion.div>
        )}
      </div>
    </Button>
  );
};

export default ThemeToggle;
