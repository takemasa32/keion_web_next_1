"use client";
import React, { useState, useEffect } from "react";
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
      setScrolled(currentScrollY > 112);
      setAtTop(currentScrollY < 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isSolidHeader = !isHome || scrolled;

  const headerBgClass = isSolidHeader
    ? "border-gray-200/80 bg-white/95 text-gray-800 shadow-sm backdrop-blur-md"
    : atTop
      ? "border-transparent bg-transparent text-white"
      : "border-white/10 bg-[#07111f]/70 text-white backdrop-blur-md";

  const isHeroTop = isHome && atTop && !scrolled;
  const logoSize = isSolidHeader ? 40 : 44;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className={`fixed top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out ${headerBgClass}`}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`container relative mx-auto flex items-center justify-between px-4 transition-[padding] duration-500 ease-out ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <Link href="/">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="relative shrink-0 overflow-hidden rounded-lg"
              animate={{
                width: logoSize,
                height: logoSize,
                boxShadow: isHeroTop
                  ? "0 10px 30px rgba(0,0,0,0.28)"
                  : "0 6px 18px rgba(0,0,0,0.16)",
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={IMAGES.logo.path}
                alt={IMAGES.logo.alt}
                fill
                sizes="44px"
                priority
                className="object-cover"
              />
            </motion.div>
            <span
              className={`text-base font-semibold transition-colors duration-500 sm:text-lg ${
                isSolidHeader ? "text-indigo-600" : "text-white"
              }`}
            >
              {isMobile ? "島根大学 軽音楽部" : SITE_INFO.title}
            </span>
          </motion.div>
        </Link>

        {!isMobile && (
          <nav className="opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-6">
              {SITE_INFO.navLinks.map((link, index) => (
                <Link href={link.href} key={index}>
                  <motion.span
                    className={`font-medium transition-colors duration-500 ${
                      isSolidHeader
                        ? "text-gray-700 hover:text-indigo-600"
                        : "text-white/90 hover:text-white"
                    }`}
                    whileHover={{ y: -1 }}
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
            className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-2 transition-colors duration-500 ${
              isSolidHeader ? "text-gray-800" : "text-white"
            }`}
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
