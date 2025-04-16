"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaGithub,
  FaGuitar,
  FaDrum,
  FaMusic,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // 波形アニメーション用のパス
  const wavePath =
    "M0,128 C50,96 100,160 150,128 C200,96 250,160 300,128 C350,96 400,160 450,128 C500,96 550,160 600,128";

  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white mt-auto pt-16 pb-8 relative overflow-hidden">
      {/* 装飾レイヤー */}
      <div className="absolute inset-0 z-0">
        {/* 複数の半透明な円形で深みを作る */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-indigo-600/10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-purple-600/10"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-600/10"
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.2, 0.3, 0.2],
              y: [-10, 10, -10],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* 音符装飾 */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
            <defs>
              <pattern
                id="music-pattern-footer"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <text x="10" y="20" fill="currentColor" fontSize="12">
                  ♪
                </text>
                <text x="25" y="35" fill="currentColor" fontSize="14">
                  ♫
                </text>
                <text x="40" y="15" fill="currentColor" fontSize="12">
                  ♩
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#music-pattern-footer)" />
          </svg>
        </div>

        {/* 波形エフェクト - トップ */}
        <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
          <svg viewBox="0 0 600 50" className="w-full absolute -top-5">
            <motion.path
              d={wavePath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              initial={{ pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={wavePath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              initial={{ pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="flex flex-wrap -mx-4">
          <motion.div
            className="w-full md:w-1/3 px-4 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="mr-3 relative">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="軽音楽部ロゴ"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(79, 70, 229, 0)",
                      "0 0 10px rgba(79, 70, 229, 0.7)",
                      "0 0 0 rgba(79, 70, 229, 0)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-bold">島根大学 軽音楽部</h3>
            </div>
            <p className="mb-6 text-indigo-100">
              音楽を通じて仲間と一緒に成長しましょう！初心者からベテランまで、すべての音楽愛好家を歓迎しています。
            </p>
            <div className="flex space-x-1 items-center text-xs text-indigo-200">
              <FaMusic className="mr-1" />
              <span>楽器：ギター・ベース・ドラム・キーボード・ボーカルなど</span>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/3 px-4 mb-8 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-indigo-700/50 mr-2">
                <FaGuitar className="text-indigo-200" size={16} />
              </span>
              クイックリンク
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="group flex items-center text-indigo-100 hover:text-white transition-all"
                >
                  <motion.span
                    className="inline-block mr-2 text-indigo-300"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                  >
                    ›
                  </motion.span>
                  <span className="relative">
                    ホームページ
                    <motion.span
                      className="absolute left-0 right-0 bottom-0 h-px bg-indigo-300 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="group flex items-center text-indigo-100 hover:text-white transition-all"
                >
                  <motion.span
                    className="inline-block mr-2 text-indigo-300"
                    animate={{ x: [0, 2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.2,
                    }}
                  >
                    ›
                  </motion.span>
                  <span className="relative">
                    イベント情報
                    <motion.span
                      className="absolute left-0 right-0 bottom-0 h-px bg-indigo-300 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sns"
                  className="group flex items-center text-indigo-100 hover:text-white transition-all"
                >
                  <motion.span
                    className="inline-block mr-2 text-indigo-300"
                    animate={{ x: [0, 2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.4,
                    }}
                  >
                    ›
                  </motion.span>
                  <span className="relative">
                    お問い合わせ
                    <motion.span
                      className="absolute left-0 right-0 bottom-0 h-px bg-indigo-300 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
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
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-indigo-700/50 mr-2">
                <FaDrum className="text-indigo-200" size={16} />
              </span>
              フォローする
            </h3>
            <div className="flex space-x-4 mb-6">
              <motion.a
                href="https://twitter.com/shimadaikeion"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-indigo-700/50 flex items-center justify-center hover:bg-blue-600/50 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter size={20} className="text-white" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/shimadai_keion/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-indigo-700/50 flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500/50 hover:to-purple-500/50 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram size={20} className="text-white" />
              </motion.a>
              <motion.a
                href="mailto:info@example.com"
                className="w-10 h-10 rounded-full bg-indigo-700/50 flex items-center justify-center hover:bg-red-500/50 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope size={18} className="text-white" />
              </motion.a>
            </div>
            <p className="text-sm text-indigo-200">
              演奏会の告知や部活の様子など、
              <br />
              SNSで最新情報を発信しています！
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-6 border-t border-indigo-700/30 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-indigo-200 mb-4 md:mb-0">
              © {currentYear} 島根大学 軽音楽部 - 音楽を通して繋がる輪
            </p>
            <div className="flex space-x-6 text-xs text-indigo-300">
              <Link href="/privacy" className="hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                利用規約
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
