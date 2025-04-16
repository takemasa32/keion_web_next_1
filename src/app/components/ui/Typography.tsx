"use client";

import React from "react";
import { motion } from "framer-motion";

type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "h6" 
  | "subtitle1" 
  | "subtitle2" 
  | "body1" 
  | "body2" 
  | "caption" 
  | "overline";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  color?: string;
  animate?: boolean;
  component?: keyof JSX.IntrinsicElements;
}

/**
 * タイポグラフィスタイルを統一するコンポーネント
 */
export const Typography = ({
  variant = "body1",
  children,
  className = "",
  color = "",
  animate = false,
  component,
}: TypographyProps) => {
  // バリアントに応じたスタイルクラス
  const variantClasses = {
    h1: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    h2: "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
    h3: "text-xl md:text-2xl lg:text-3xl font-bold",
    h4: "text-lg md:text-xl font-bold",
    h5: "text-base md:text-lg font-bold",
    h6: "text-sm md:text-base font-bold",
    subtitle1: "text-lg font-semibold",
    subtitle2: "text-base font-semibold",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs",
    overline: "text-xs uppercase tracking-wider font-semibold",
  };

  // カラークラス
  const colorClass = color || "";

  // デフォルトのコンポーネントタイプを決定
  const getDefaultComponent = (variant: TypographyVariant): keyof JSX.IntrinsicElements => {
    if (variant.startsWith("h")) return variant as keyof JSX.IntrinsicElements;
    if (variant.startsWith("subtitle")) return "h6";
    return "p";
  };

  // 使用するコンポーネントタイプ
  const Component = component || getDefaultComponent(variant);

  // ベースクラス
  const baseClasses = `${variantClasses[variant]} ${colorClass} ${className}`;

  // アニメーション効果
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        {React.createElement(Component, { className: baseClasses }, children)}
      </motion.div>
    );
  }

  return React.createElement(Component, { className: baseClasses }, children);
};

export default Typography;