"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const FloatingNav = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // パフォーマンス最適化：スロットリング関数
  // Define the throttle function type
  interface ThrottleFunction {
    <T extends (...args: any[]) => void>(callback: T, delay: number): (
      ...args: Parameters<T>
    ) => void;
  }

  const throttle: ThrottleFunction = (callback, delay) => {
    let previousCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - previousCall > delay) {
        previousCall = now;
        callback(...args);
      }
    };
  };

  // スクロール処理を最適化
  const handleScroll = useCallback(
    throttle(() => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      // 200px以上スクロールしたら表示
      setIsVisible(currentScroll > 200);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // モバイル判定
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, [handleScroll]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // ナビゲーションリンク
  const navItems = [
    { name: "TOP", href: "/" },
    { name: "演奏会情報", href: "/events/2024teikiensoukai" },
    { name: "SNS", href: "/sns" },
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link
                href="/"
                className="text-xl font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                慶應義塾大学軽音楽研究会
              </Link>

              {/* モバイルメニュー切り替えボタン */}
              {isMobile && (
                <button onClick={toggleMobileMenu} className="p-2 rounded-md focus:outline-none">
                  <div
                    className={`w-6 h-0.5 bg-gray-800 dark:bg-white mb-1.5 transition-all ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></div>
                  <div
                    className={`w-6 h-0.5 bg-gray-800 dark:bg-white mb-1.5 transition-all ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></div>
                  <div
                    className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                    }`}
                  ></div>
                </button>
              )}

              {/* デスクトップメニュー */}
              {!isMobile && (
                <div className="flex space-x-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* モバイルドロップダウンメニュー */}
            <AnimatePresence>
              {isMobile && isMobileMenuOpen && (
                <motion.div
                  className="absolute w-full bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-3 px-4 flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
