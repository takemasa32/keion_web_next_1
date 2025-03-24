"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxSectionProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down";
};

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // パララックス効果の計算
  const factor = direction === "up" ? -speed * 100 : speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [0, factor]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="parallax">
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
