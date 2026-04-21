"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TopLoadingProps {
  text: string;
  time?: number;
}

const TopLoading: React.FC<TopLoadingProps> = ({ text, time }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, time ?? 2000);

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setLoading(false);
        window.clearTimeout(timeout);
      }
    };

    const supportsEventListener = typeof prefersReducedMotion.addEventListener === "function";
    if (supportsEventListener) {
      prefersReducedMotion.addEventListener("change", handlePreferenceChange);
    } else {
      // Safari fallback
      // @ts-ignore
      prefersReducedMotion.addListener(handlePreferenceChange);
    }

    return () => {
      window.clearTimeout(timeout);
      if (supportsEventListener) {
        prefersReducedMotion.removeEventListener("change", handlePreferenceChange);
      } else {
        // @ts-ignore
        prefersReducedMotion.removeListener(handlePreferenceChange);
      }
    };
  }, [time]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#07111f] px-6 text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          aria-label={text || "Loading"}
        >
          <div className="absolute inset-0">
            <Image
              src="/image/root/live-performance.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.18]"
            />
            <div className="absolute inset-0 bg-[#07111f]/80" />
            <motion.div
              className="absolute inset-x-8 bottom-14 hidden border-t border-white/15 md:block"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
            />
          </div>

          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.28)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/icons/icon-512x512.png"
                alt="島根大学 軽音楽部"
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </motion.div>

            <p className="mt-8 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/50">
              Shimane University Keion Club
            </p>
            {text && (
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {text}
              </h2>
            )}
            <p className="mt-4 text-sm leading-7 text-white/60">
              部室からステージへ。音を合わせる時間を読み込んでいます。
            </p>

            <div className="mt-9 h-px w-full overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          <button
            type="button"
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={(event) => {
              event.stopPropagation();
              setLoading(false);
            }}
          >
            スキップ
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopLoading;
