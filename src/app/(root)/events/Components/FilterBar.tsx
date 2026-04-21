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
  const visibleCount = isExpanded || !isMobile ? displayTags.length : initialDisplayCount;

  return (
    <div>
      <div className="relative -mx-4 sm:mx-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {displayTags.slice(0, visibleCount).map((tag) => (
            <motion.button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={`relative flex-shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {tag === "all" ? "すべて" : tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* もっと見るボタン（タグが多い場合のみ表示） */}
      <div className="mt-2 flex justify-center">
        {isMobile && displayTags.length > initialDisplayCount && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? "閉じる" : "もっと見る"}
          </motion.button>
        )}
      </div>

      {/* タグ説明（アクティブタグがあれば表示） */}
      {activeTag !== "all" && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-sm text-slate-500"
        >
          「{activeTag}」のイベントを表示しています
        </motion.p>
      )}
    </div>
  );
};

export default FilterBar;
