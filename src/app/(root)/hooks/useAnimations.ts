"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useAnimations = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // GSAPプラグインを登録
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // スムーズスクロールの初期化
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // GSAPとLenisの連携
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    // 交差検知を使ったアニメーション
    const fadeUpElements = document.querySelectorAll(".fade-up");
    const staggerElements = document.querySelectorAll(".stagger-fade");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeUpElements.forEach((el) => observer.observe(el));
    staggerElements.forEach((el) => observer.observe(el));

    // クリーンアップ
    return () => {
      gsap.ticker.remove(() => {
        lenisRef.current?.destroy();
      });
      observer.disconnect();
    };
  }, []);

  return { lenis: lenisRef.current };
};
