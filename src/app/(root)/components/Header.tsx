"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 画像パスを定数として管理
const IMAGES = {
  logo: {
    path: "/icons/icon-512x512.png",
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

  // ヘッダースタイルの動的な設定
  const headerBgClass = scrolled
    ? "bg-white/90 backdrop-blur-md text-gray-800 shadow-lg border-b border-indigo-100/50"
    : atTop
    ? "bg-gradient-to-b from-black/40 to-transparent text-white"
    : "bg-indigo-900/90 backdrop-blur-md text-white shadow-lg";

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
                className="flex flex-col items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0px 0px 0px rgba(79, 70, 229, 0.2)",
                      "0px 0px 20px rgba(79, 70, 229, 0.7)",
                      "0px 0px 0px rgba(79, 70, 229, 0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <Image
                    src={IMAGES.logo.path}
                    alt={IMAGES.logo.alt}
                    width={isMobile ? 70 : 90}
                    height={isMobile ? 70 : 90}
                    className="rounded-2xl shadow-lg mb-2 md:mb-3 top-logo"
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 rounded-2xl group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
                </motion.div>
                <motion.h1
                  className={`text-2xl md:text-3xl font-bold text-white drop-shadow-xl bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white`}
                  animate={{
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  {SITE_INFO.title}
                </motion.h1>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          // スクロール時のコンパクトヘッダー
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* ロゴとタイトル */}
              <Link href="/">
                <motion.div
                  className="flex items-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <Image
                      src={IMAGES.logo.path}
                      alt={IMAGES.logo.alt}
                      width={38}
                      height={38}
                      className="rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-indigo-400/20"
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(79, 70, 229, 0)",
                          "0 0 8px rgba(79, 70, 229, 0.5)",
                          "0 0 0 rgba(79, 70, 229, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span
                    className={`ml-2 text-lg font-semibold ${
                      scrolled
                        ? "text-indigo-600 hover:text-indigo-800"
                        : "text-white drop-shadow-md group-hover:text-indigo-200"
                    } transition-colors duration-300`}
                  >
                    {isMobile ? "軽音楽部" : SITE_INFO.title}
                  </span>
                </motion.div>
              </Link>

              {/* モバイルメニューボタン */}
              {isMobile ? (
                <motion.button
                  className={`p-2 rounded-md ${scrolled ? "text-gray-800" : "text-white"}`}
                  onClick={toggleMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMenuOpen ? (
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                    >
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </motion.svg>
                  )}
                </motion.button>
              ) : (
                // デスクトップナビゲーション
                <nav>
                  <div className="flex space-x-6">
                    {SITE_INFO.navLinks.map((link, index) => (
                      <Link href={link.href} key={index}>
                        <motion.div
                          className={`font-medium relative ${
                            scrolled
                              ? "text-gray-800 hover:text-indigo-600"
                              : "text-white hover:text-indigo-100 drop-shadow-md"
                          } transition-colors duration-300`}
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                        >
                          {link.label}
                          <motion.span
                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-indigo-500 origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-screen w-64 bg-gradient-to-br from-indigo-900 to-indigo-800 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">メニュー</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMenu}
                    className="text-white/80 hover:text-white"
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
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <div className="mb-8">
                  <Link href="/" onClick={toggleMenu} className="flex flex-col items-center mb-6">
                    <div className="relative mb-3">
                      <Image
                        src={IMAGES.logo.path}
                        alt={IMAGES.logo.alt}
                        width={70}
                        height={70}
                        className="rounded-lg shadow-lg"
                      />
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(79, 70, 229, 0)",
                            "0 0 15px rgba(79, 70, 229, 0.8)",
                            "0 0 0 rgba(79, 70, 229, 0)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                    <span className="text-white font-medium text-lg">島根大学軽音楽部</span>
                  </Link>
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
                          <motion.span
                            className="block py-3 px-4 text-white font-medium hover:bg-indigo-700/50 rounded-md transition-colors relative overflow-hidden group"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-indigo-300 w-full origin-left"
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 flex items-center">
                              {link.label}
                              <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            </span>
                          </motion.span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-10 pt-6 border-t border-indigo-700/30">
                  <p className="text-indigo-200 text-sm text-center">
                    お問い合わせは
                    <br />
                    各SNSからお気軽にどうぞ
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <motion.a
                      href="https://twitter.com/shimadaikeion"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-indigo-200 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://www.instagram.com/shimadai_keion/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-indigo-200 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.917-.01-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
