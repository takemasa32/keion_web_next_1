"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full ${
        isDark
          ? "bg-gray-800 text-yellow-300"
          : "bg-blue-100 text-indigo-600"
      } transition-colors duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <FaMoon className="text-lg" />
        ) : (
          <FaSun className="text-lg" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;