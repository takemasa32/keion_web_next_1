"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaRegSadTear, FaHome } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <FaRegSadTear className="text-6xl mx-auto text-blue-400 opacity-80" />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl font-bold text-white mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            404
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 text-xl font-semibold text-white"
        >
          ページが見つかりません
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8 text-gray-400"
        >
          お探しのページは存在しないか、アクセス権がありません。
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
