"use client";
import React from "react";
import { motion } from "framer-motion";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex justify-center mb-4 overflow-x-auto py-2 no-scrollbar">
      <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
        {["all", "upcoming", "past"].map((filter) => (
          <motion.button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`relative px-4 py-2 text-sm font-medium rounded-full ${
              activeFilter === filter ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {activeFilter === filter && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-indigo-600 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {filter === "all"
                ? "すべて"
                : filter === "upcoming"
                ? "今後のイベント"
                : "過去のイベント"}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
