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
  const [atTop, setAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);

  // デバイス検出
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // スクロール検知 - 高度な追従機能
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;
      const isAtTop = currentScrollY < 50;

      // スクロール方向に基づいてヘッダーを表示/非表示
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // 下スクロール時の動作（ヘッダー非表示）
        setHideHeader(true);
      } else {
        // 上スクロール時の動作（ヘッダー表示）
        setHideHeader(false);
      }

      setLastScrollY(currentScrollY);

      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      if (isAtTop !== atTop) {
        setAtTop(isAtTop);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, atTop, lastScrollY]);

  const headerBgClass = scrolled
    ? "bg-white bg-opacity-90 backdrop-blur-md text-gray-800 shadow-lg"
    : atTop
    ? "bg-gradient-to-b from-black/30 to-transparent text-white"
    : "bg-black/20 backdrop-blur-sm text-white";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBgClass}`}
      initial={{ y: -100 }}
      animate={{
        y: hideHeader ? -100 : 0,
        opacity: hideHeader ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {/* 最上部表示 - タイトルとロゴのみ */}
        {atTop && !scrolled ? (
          <motion.div
            key="top-header"
            className="container mx-auto flex flex-col items-center justify-center py-4 md:py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/">
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={IMAGES.logo.path}
                  alt={IMAGES.logo.alt}
                  width={isMobile ? 60 : 80}
                  height={isMobile ? 60 : 80}
                  className="rounded-full shadow-lg mb-2 md:mb-3 top-logo"
                />
                <h1 className={`text-2xl md:text-3xl font-bold text-white drop-shadow-xl`}>
                  {SITE_INFO.title}
                </h1>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          // スクロール時のコンパクトヘッダー
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* ロゴとタイトル */}
              <Link href="/">
                <div className="flex items-center">
                  <Image
                    src={IMAGES.logo.path}
                    alt={IMAGES.logo.alt}
                    width={36}
                    height={36}
                    className="rounded-full shadow-md"
                  />
                  <span
                    className={`ml-2 text-lg font-semibold ${
                      scrolled ? "text-indigo-600" : "text-white drop-shadow-md"
                    }`}
                  >
                    {isMobile ? "軽音楽部" : SITE_INFO.title}
                  </span>
                </div>
              </Link>

              {/* モバイルメニューボタン */}
              {isMobile ? (
                <motion.button
                  className={`p-2 rounded-md ${scrolled ? "text-gray-800" : "text-white"}`}
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMenuOpen ? (
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
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  ) : (
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
                    >
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                  )}
                </motion.button>
              ) : (
                // デスクトップナビゲーション
                <nav>
                  <div className="flex space-x-6">
                    {SITE_INFO.navLinks.map((link, index) => (
                      <Link href={link.href} key={index}>
                        <motion.div
                          className={`font-medium ${
                            scrolled
                              ? "hover:text-indigo-600"
                              : "hover:text-indigo-200 drop-shadow-md"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                        >
                          {link.label}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* モバイルメニュー（オーバーレイ） */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-screen w-64 bg-white shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-600">メニュー</h2>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={toggleMenu}>
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
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <nav>
                  <ul className="space-y-4">
                    {SITE_INFO.navLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={link.href} onClick={toggleMenu}>
                          <span className="block py-2 px-4 text-gray-800 font-medium hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors">
                            {link.label}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* スクロール促進インジケーター */}
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
