"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollYRef = useRef(0);
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateIsMobile = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    updateIsMobile(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateIsMobile);
      return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }

    mediaQuery.addListener(updateIsMobile);
    return () => mediaQuery.removeListener(updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY > lastScrollY + 8 && currentScrollY > 220) {
        setHideHeader(true);
      } else if (currentScrollY < lastScrollY - 8 || currentScrollY <= 220) {
        setHideHeader(false);
      }

      lastScrollYRef.current = currentScrollY;

      setScrolled(currentScrollY > 24);
      setAtTop(currentScrollY < 32);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBgClass = scrolled
    ? "bg-white bg-opacity-90 backdrop-blur-md text-gray-800 shadow-lg"
    : atTop
    ? "bg-gradient-to-b from-black/40 via-black/10 to-transparent text-white"
    : "bg-indigo-900/40 backdrop-blur-md text-white";

  const isHome = pathname === "/";
  const isExpanded = isHome && atTop && !scrolled;
  const logoSize = isExpanded ? (isMobile ? 64 : 80) : 40;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${headerBgClass}`}
      initial={false}
      animate={{
        y: hideHeader ? -110 : 0,
        opacity: hideHeader ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div
        className={`relative container mx-auto px-4 ${
          isExpanded
            ? "flex flex-col items-center justify-center space-y-4 py-4 md:py-6"
            : "flex items-center justify-between py-3"
        }`}
      >
        <Link href="/">
          <motion.div
            className={`flex ${isExpanded ? "flex-col items-center gap-2" : "items-center gap-2"}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              animate={
                isExpanded
                  ? {
                      boxShadow: [
                        "0px 0px 0px rgba(79, 70, 229, 0.2)",
                        "0px 0px 24px rgba(99, 102, 241, 0.65)",
                        "0px 0px 0px rgba(79, 70, 229, 0.2)",
                      ],
                    }
                  : { boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={IMAGES.logo.path}
                alt={IMAGES.logo.alt}
                width={logoSize}
                height={logoSize}
                priority
                className="rounded-lg shadow-lg"
              />
            </motion.div>
            {isExpanded ? (
              <h1 className="text-center text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
                {SITE_INFO.title}
              </h1>
            ) : (
              <span
                className={`text-lg font-semibold ${
                  scrolled ? "text-indigo-600" : "text-white drop-shadow-md"
                }`}
              >
                {isMobile ? "島根大学 軽音楽部" : SITE_INFO.title}
              </span>
            )}
          </motion.div>
        </Link>

        {!isMobile && (
          <nav
            className={`transition-opacity duration-300 ${
              isExpanded ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center space-x-6">
              {SITE_INFO.navLinks.map((link, index) => (
                <Link href={link.href} key={index}>
                  <motion.span
                    className={`font-medium ${
                      scrolled ? "text-gray-700 hover:text-indigo-600" : "text-white"
                    }`}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </nav>
        )}

        {isMobile && (
          <motion.button
            className={`absolute right-4 ${
              isExpanded ? "top-4" : "top-1/2 -translate-y-1/2"
            } rounded-md p-2 transition-colors ${scrolled ? "text-gray-800" : "text-white"}`}
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="ナビゲーションメニューを開く"
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
        )}
      </div>

      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-72 max-w-[85vw] md:w-80"
              initial={{ x: "120%" }}
              animate={{ x: 0 }}
              exit={{ x: "120%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col overflow-y-auto rounded-l-3xl bg-gradient-to-b from-white via-white to-gray-50 shadow-2xl ring-1 ring-black/5">
                <div className="flex items-center justify-between px-5 pb-4 pt-5">
                  <h2 className="text-lg font-semibold text-indigo-600">メニュー</h2>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleMenu}
                    aria-label="メニューを閉じる"
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
                      className="text-gray-600"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <nav className="px-5 pb-8">
                  <ul className="space-y-3">
                    {SITE_INFO.navLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.06 * index }}
                      >
                        <Link href={link.href} onClick={toggleMenu}>
                          <span className="block rounded-lg bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-600">
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
    </motion.header>
  );
};

export default Header;
