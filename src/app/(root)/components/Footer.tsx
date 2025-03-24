"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white mt-auto py-12 relative overflow-hidden">
      {/* 装飾パターン */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-white"></div>
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="flex flex-wrap -mx-4">
          <motion.div
            className="w-full md:w-1/3 px-4 mb-8 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">島根大学 軽音楽部</h3>
            <p className="mb-4">
              音楽を通じて仲間と一緒に成長しましょう！初心者からベテランまで、すべての音楽愛好家を歓迎しています。
            </p>
          </motion.div>

          <motion.div
            className="w-full md:w-1/3 px-4 mb-8 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-200 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> ホームページ
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-indigo-200 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> イベント情報
                </Link>
              </li>
              <li>
                <Link
                  href="/sns"
                  className="hover:text-indigo-200 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> お問い合わせ
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="w-full md:w-1/3 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">フォローする</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://twitter.com/shimaneU_keion"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaTwitter size={24} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/shimadai_keion/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-300 transition duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaInstagram size={24} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 pt-6 border-t border-white border-opacity-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm">© 2023-2025 島根大学 軽音楽部</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
