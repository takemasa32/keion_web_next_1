"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullScreen?: boolean;
  centered?: boolean;
  withContainer?: boolean;
  animate?: boolean;
  background?: "white" | "light" | "dark" | "primary" | "gradient" | "none";
  paddingY?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Section = ({
  children,
  className = "",
  id,
  fullScreen = false,
  centered = false,
  withContainer = true,
  animate = false,
  background = "white",
  paddingY = "lg",
}: SectionProps) => {
  // 背景クラス
  const bgClasses = {
    white: "bg-white dark:bg-gray-900",
    light: "bg-gray-50 dark:bg-gray-800",
    dark: "bg-gray-800 dark:bg-gray-950 text-white",
    primary: "bg-primary-600 dark:bg-primary-800 text-white",
    gradient: "bg-gradient-to-br from-primary-500 to-accent-600 text-white",
    none: "",
  };

  // パディングクラス
  const paddingClasses = {
    none: "",
    sm: "py-4 md:py-6",
    md: "py-8 md:py-12",
    lg: "py-12 md:py-16",
    xl: "py-16 md:py-24",
  };

  // セクションのベースクラス
  const sectionClasses = `
    relative
    ${paddingClasses[paddingY]}
    ${bgClasses[background]}
    ${fullScreen ? "min-h-screen flex flex-col" : ""}
    ${centered ? "flex items-center justify-center" : ""}
    ${className}
  `;

  // アニメーションなしの場合
  if (!animate) {
    return (
      <section id={id} className={sectionClasses}>
        {withContainer ? (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }

  // アニメーション付きの場合
  return (
    <motion.section
      id={id}
      className={sectionClasses}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {withContainer ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {children}
        </div>
      ) : (
        children
      )}
    </motion.section>
  );
};

export default Section;