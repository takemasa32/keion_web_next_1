"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white bg-opacity-90 backdrop-blur-md text-gray-800 shadow-lg"
          : "bg-transparent text-white"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <motion.div
          className="flex items-center mb-4 md:mb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/">
            <div className="flex items-center title-font font-medium cursor-pointer">
              <Image
                src="/image/keionMiniLogo.JPG"
                alt="軽音楽部ロゴ"
                width={40}
                height={40}
                className="rounded-full shadow-md"
              />
              <motion.span
                className={`ml-3 text-xl font-semibold ${
                  scrolled ? "text-indigo-600" : "text-white"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                島根大学 軽音楽部
              </motion.span>
            </div>
          </Link>
        </motion.div>

        <nav className="flex flex-col md:flex-row md:items-center md:ml-auto w-full md:w-auto md:justify-end">
          <div className="flex flex-row justify-center w-full md:w-auto">
            {[
              { href: "/", label: "ホーム" },
              { href: "/events", label: "イベント" },
              { href: "/sns", label: "お問い合わせ" },
            ].map((link, index) => (
              <Link href={link.href} key={index}>
                <motion.div
                  className={`block md:inline-block mr-5 transition duration-300 ease-in-out cursor-pointer font-medium ${
                    scrolled ? "hover:text-indigo-600" : "hover:text-gray-300"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
