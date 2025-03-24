"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ActivityCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  hoverText: string;
  delay?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  hoverText,
  delay = 0,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onClick={toggleInfo}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden group"
        onMouseEnter={() => setIsInfoVisible(true)}
        onMouseLeave={() => setIsInfoVisible(false)}
        role="button"
        aria-expanded={isInfoVisible}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleInfo();
            e.preventDefault();
          }
        }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transform transition-transform duration-700 ease-in-out"
          style={{
            transform: isInfoVisible ? "scale(1.1)" : "scale(1)",
          }}
          priority={delay === 0}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
            isInfoVisible ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${
            isInfoVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <p className="text-white text-sm font-medium">{hoverText}</p>
        </div>

        {/* モバイル向けのタップインジケーター */}
        <div
          className={`absolute top-0 right-0 m-2 bg-white/80 backdrop-blur-sm rounded-full p-2
          transition-opacity duration-300 ${
            isInfoVisible ? "opacity-0" : "opacity-70 lg:opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
