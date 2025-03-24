"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function SNSButton() {
  // アニメーションコントロール用の変数設定
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 md:px-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">SNS</h2>
        <p className="text-lg text-gray-500">
          質問や入部希望、部室見学などは以下のSNSからお願いします。
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.a
          href="https://twitter.com/shimaneU_keion"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg"
          variants={item}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            y: -5,
          }}
          whileTap={{ scale: 0.97 }}
        >
          <FaTwitter className="text-4xl" />
          <span className="ml-4 text-xl font-semibold">Twitter</span>
        </motion.a>

        <motion.a
          href="https://www.instagram.com/shimadai_keion/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 text-white rounded-lg shadow-lg"
          variants={item}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.5)",
            y: -5,
          }}
          whileTap={{ scale: 0.97 }}
        >
          <FaInstagram className="text-4xl" />
          <span className="ml-4 text-xl font-semibold">Instagram</span>
        </motion.a>
      </motion.div>

      <motion.p
        className="mt-8 text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        ↑各アイコンをクリックで、SNSに飛べます。
      </motion.p>
    </div>
  );
}
