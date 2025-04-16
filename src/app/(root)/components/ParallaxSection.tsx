"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage: string;
  bgOpacity?: number;
  mobileOptimized?: boolean; // モバイル最適化フラグ
  minHeight?: string; // 最小高さ（例: '50vh'）
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  backgroundImage,
  bgOpacity = 0.5,
  mobileOptimized = false,
  minHeight = "100vh",
}) => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ticking = useRef(false);

  // デバイス検出 (SSRと互換性を保つためにuseEffectで実装)
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Intersection Observer APIを使用して画面内に要素が表示されているか確認
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // 10%表示されたらトリガー
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // スクロール監視 (パフォーマンスのためにRAFとデバイスに基づく最適化)
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current && isInView) {
        ticking.current = true;

        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            setScrollY(rect.top);
          }
          ticking.current = false;
        });
      }
    };

    // モバイルデバイスでは最適化フラグに基づいて処理を調整
    if (!mobileOptimized && isMobile) {
      setScrollY(0); // モバイルで最適化しない場合は固定値を使用
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // 初期値をセット
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, mobileOptimized, isInView]);

  // 視差効果の計算
  const yOffset = isMobile && !mobileOptimized ? 0 : scrollY * 0.4;

  // 背景画像スタイル - GPU高速化のためにtransform: translateZを使用
  const imageStyle = {
    transform: `translate3d(0, ${yOffset}px, 0)`,
    opacity: bgOpacity,
    willChange: "transform", // GPUアクセラレーションのヒント
  };

  return (
    <div ref={sectionRef} className="relative overflow-hidden w-full" style={{ minHeight }}>
      <div className="absolute inset-0 z-0">
        <div style={imageStyle} className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Parallax Background"
            fill
            priority={false}
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center"
            quality={isMobile ? 70 : 85} // モバイルデバイスでは画質を少し下げる
          />
          <div className="absolute inset-0 bg-black" style={{ opacity: 1 - bgOpacity }}></div>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ParallaxSection;
