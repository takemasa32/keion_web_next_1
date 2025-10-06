"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useAnimations = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafCallbackRef = useRef<(time: number) => void>();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    lenisRef.current = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    const rafCallback = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };
    rafCallbackRef.current = rafCallback;

    gsap.ticker.add(rafCallback);

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

    // スムーズスクロールを実装
    const handleSmoothScroll = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (!href?.startsWith("#")) return;

      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);

      if (element) {
        // モバイルデバイスの最適化
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 70 : 100; // ヘッダー高さの差を考慮

        const topPos = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: topPos,
          behavior: "smooth",
        });
      }
    };

    // イベントリスナーの設定
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleSmoothScroll);
    });

    // スクロールアニメーションの最適化
    const fadeElems = document.querySelectorAll(".fade-up");

    // IntersectionObserverの設定
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // モバイルでは軽量なアニメーションを使用
            const isMobile = window.innerWidth < 768;
            entry.target.classList.add(isMobile ? "optimize-scroll" : "animate-fade-up");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeElems.forEach((elem) => {
      fadeObserver.observe(elem);
    });

    return () => {
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      observer.disconnect();
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener("click", handleSmoothScroll);
      });

      fadeElems.forEach((elem) => {
        fadeObserver.unobserve(elem);
      });
    };
  }, []);

  return { lenis: lenisRef.current };
};
