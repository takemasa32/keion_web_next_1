"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const getVariantClasses = (variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    return "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400";
  }

  switch (variant) {
    case "primary":
      return "bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-700 dark:hover:bg-primary-800";
    case "secondary":
      return "bg-accent-600 hover:bg-accent-700 text-white dark:bg-accent-700 dark:hover:bg-accent-800";
    case "outline":
      return "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/30";
    case "ghost":
      return "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800";
    case "success":
      return "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800";
    default:
      return "bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-700 dark:hover:bg-primary-800";
  }
};

const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case "sm":
      return "py-1.5 px-3 text-sm";
    case "md":
      return "py-2 px-4 text-base";
    case "lg":
      return "py-2.5 px-5 text-lg";
    case "xl":
      return "py-3 px-6 text-xl";
    default:
      return "py-2 px-4 text-base";
  }
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) => {
  const variantClasses = getVariantClasses(variant, disabled);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = `
    ${variantClasses}
    ${sizeClasses}
    ${widthClass}
    rounded-lg font-medium transition-all duration-200
    flex items-center justify-center
    ${className}
  `;

  // ローディングスピナー
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // モーションラッパー
  const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      className="w-full"
    >
      {children}
    </motion.div>
  );

  if (href && !disabled) {
    return (
      <MotionWrapper>
        <Link href={href} className={buttonClasses}>
          {isLoading && <Spinner />}
          {children}
        </Link>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <button
        type={type}
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    </MotionWrapper>
  );
};

export default Button;