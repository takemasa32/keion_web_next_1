"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 画像パスを定数として管理
const IMAGES = {
  logo: {
    path: "/icons/icon512_rounded.png",
    alt: "軽音楽部ロゴ",
  },
};

// サイトメタデータや設定を定数として管理
const SITE_INFO = {
  title: "島根大学 軽音楽部",
  navLinks: [
    { href: "/", label: "ホーム" },
    { href: "/events", label: "イベント" },
    { href: "/sns", label: "お問い合わせ" },
  ],
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true); // 最上部かどうかを判定する状態
  const [scrollY, setScrollY] = useState(0); // スクロール位置を保存

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;
      const isAtTop = currentScrollY < 50; // 最上部の判定基準

      setScrollY(currentScrollY);

      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      if (isAtTop !== atTop) {
        setAtTop(isAtTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初期実行
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, atTop]);

  // 最上部でも背景をわずかに追加して視認性を確保
  const headerBgClass = scrolled
    ? "bg-white bg-opacity-90 backdrop-blur-md text-gray-800 shadow-lg"
    : atTop
    ? "bg-gradient-to-b from-black/30 to-transparent text-white" // 最上部の時の背景グラデーション
    : "bg-black/20 backdrop-blur-sm text-white"; // 少しスクロールした時

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBgClass}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {/* 最上部にいるとき - タイトルとアイコンのみ表示 */}
        {atTop && !scrolled ? (
          <motion.div
            key="top-header"
            className="container mx-auto flex flex-col items-center justify-center py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/">
              <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                <Image
                  src={IMAGES.logo.path}
                  alt={IMAGES.logo.alt}
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg mb-3 top-logo"
                />
                <h1 className="text-3xl font-bold text-white drop-shadow-xl">{SITE_INFO.title}</h1>
              </motion.div>
            </Link>
            {/* 最上部ではナビゲーションリンクは非表示 */}
          </motion.div>
        ) : (
          // スクロールしたとき - 左右分割レイアウトでナビゲーション表示
          <motion.div
            key="scrolled-header"
            className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/">
                <div className="flex items-center title-font font-medium cursor-pointer">
                  <Image
                    src={IMAGES.logo.path}
                    alt={IMAGES.logo.alt}
                    width={40}
                    height={40}
                    className="rounded-full shadow-md"
                  />
                  <motion.span
                    className={`ml-3 text-xl font-semibold ${
                      scrolled ? "text-indigo-600" : "text-white drop-shadow-md"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {SITE_INFO.title}
                  </motion.span>
                </div>
              </Link>
            </motion.div>

            {/* スクロールしたときだけナビゲーションを表示 */}
            <nav className="flex flex-col md:flex-row md:items-center md:ml-auto w-full md:w-auto md:justify-end">
              <div className="flex flex-row justify-center w-full md:w-auto">
                {SITE_INFO.navLinks.map((link, index) => (
                  <Link href={link.href} key={index}>
                    <motion.div
                      className={`block md:inline-block mr-5 transition duration-300 ease-in-out cursor-pointer font-medium ${
                        scrolled ? "hover:text-indigo-600" : "hover:text-indigo-200 drop-shadow-md"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* アテンションインジケーター - スクロールを促すアニメーション */}
      {atTop && !scrolled && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-5, 5, -5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white drop-shadow-md"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
