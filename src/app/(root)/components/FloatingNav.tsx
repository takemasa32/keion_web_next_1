"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const lastScrollYRef = React.useRef(0);

  useEffect(() => {
    const evaluateViewport = () => {
      if (typeof window === "undefined") return;
      setIsMobileView(window.innerWidth < 768);
    };

    evaluateViewport();
    window.addEventListener("resize", evaluateViewport, { passive: true });

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", evaluateViewport);
    };
  }, []);

  if (!isMobileView) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-0 right-0 z-50 px-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto max-w-sm bg-white/90 backdrop-blur-md rounded-full shadow-lg p-2">
            <nav className="flex justify-around items-center">
              <Link href="/">
                <motion.div className="flex flex-col items-center p-2" whileTap={{ scale: 0.9 }}>
                  <FaHome className="text-indigo-600 text-xl mb-1" />
                  <span className="text-xs text-gray-600 font-medium">ホーム</span>
                </motion.div>
              </Link>
              <Link href="/events">
                <motion.div className="flex flex-col items-center p-2" whileTap={{ scale: 0.9 }}>
                  <FaCalendarAlt className="text-indigo-600 text-xl mb-1" />
                  <span className="text-xs text-gray-600 font-medium">イベント</span>
                </motion.div>
              </Link>
              <Link href="/sns">
                <motion.div className="flex flex-col items-center p-2" whileTap={{ scale: 0.9 }}>
                  <FaEnvelope className="text-indigo-600 text-xl mb-1" />
                  <span className="text-xs text-gray-600 font-medium">お問い合わせ</span>
                </motion.div>
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
