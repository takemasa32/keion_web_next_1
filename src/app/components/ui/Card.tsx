"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  hover3D?: boolean;
  bordered?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

export const Card = ({
  children,
  className = "",
  interactive = false,
  hover3D = false,
  bordered = false,
  shadow = "md",
  onClick,
  forwardedRef,
}: CardProps) => {
  const shadowClasses = {
    none: "",
    sm: "shadow-sm dark:shadow-gray-900/30",
    md: "shadow-md dark:shadow-gray-900/30",
    lg: "shadow-lg dark:shadow-gray-900/30",
  };

  const baseClasses = `
    relative rounded-lg overflow-hidden
    bg-white dark:bg-gray-800
    ${bordered ? "border border-gray-200 dark:border-gray-700" : ""}
    ${shadowClasses[shadow]}
    ${interactive ? "cursor-pointer" : ""}
    ${className}
  `;

  if (hover3D) {
    return (
      <motion.div
        className={`parallax-card ${baseClasses}`}
        whileHover={interactive ? { scale: 1.02, y: -5 } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        onClick={onClick}
        ref={forwardedRef}
      >
        <div className="parallax-card-inner">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={interactive ? { scale: 1.02, y: -5 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      ref={forwardedRef}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});