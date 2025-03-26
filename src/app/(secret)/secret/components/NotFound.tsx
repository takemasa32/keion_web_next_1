"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaLock, FaHome } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6"
      >
        <FaLock className="text-red-500 text-3xl mr-3" />
        <h1 className="text-3xl font-bold">アクセス制限</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md text-center mb-8"
      >
        <p className="text-gray-300 mb-4">このページへのアクセス権限がありません。</p>
        <p className="text-gray-400 text-sm">
          このコンテンツにアクセスするには、特別な方法でシークレットモードを有効にする必要があります。
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/")}
        className="flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
      >
        <FaHome />
        <span>トップページに戻る</span>
      </motion.button>
    </div>
  );
};

export default NotFoundPage;
