"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TopLoadingProps {
  text: string;
  time?: number;
}

const TopLoading: React.FC<TopLoadingProps> = ({ text, time }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setLoading(false);
      },
      time ? time : 2000
    ); // 2秒後にローディングを非表示にする

    return () => clearTimeout(timer); // コンポーネントのアンマウント時にタイマーをクリアする
  }, [time]);

  const words = text.split("");

  // 文字のアニメーションをより魅力的にする
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            {/* 背景のアニメーション要素 */}
            <motion.svg
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className="absolute top-10 left-10 w-16 h-16 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L12 22M2 12L22 12" />
            </motion.svg>
            <motion.svg
              animate={{
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className="absolute bottom-10 right-10 w-16 h-16 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L12 22M2 12L22 12" />
            </motion.svg>
            <motion.svg
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2L12 22M2 12L22 12" />
            </motion.svg>
          </div>

          {/* テキストアニメーション */}
          {text && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative z-10 flex"
            >
              {words.map((word, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="text-white text-4xl sm:text-6xl md:text-8xl font-bold mx-1"
                >
                  {word}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ローディングインジケーター */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1, 0.95],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopLoading;
