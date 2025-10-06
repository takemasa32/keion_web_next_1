"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FilterBarProps {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ tags, activeTag, onTagChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 表示用のタグリスト
  // 「すべて」を先頭に追加し、表示数を制限
  const displayTags = ["all", ...tags];
  const initialDisplayCount = 5; // モバイル表示で初期表示するタグ数
  const visibleCount = isExpanded || isMobile ? displayTags.length : initialDisplayCount;

  return (
    <div className="mb-6">
      <div className="relative -mx-4 sm:mx-0">
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {displayTags.slice(0, visibleCount).map((tag) => (
            <motion.button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={`relative flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTag === tag
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag === "all" ? "すべて" : tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* もっと見るボタン（タグが多い場合のみ表示） */}
      <div className="mt-2 flex justify-center">
        {displayTags.length > initialDisplayCount && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden px-4 py-2 text-sm font-medium rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 sm:inline-flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "閉じる" : "もっと見る..."}
          </motion.button>
        )}
      </div>

      {/* タグ説明（アクティブタグがあれば表示） */}
      {activeTag !== "all" && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-500 mt-2"
        >
          「{activeTag}」のイベントを表示しています
        </motion.p>
      )}
    </div>
  );
};

export default FilterBar;
