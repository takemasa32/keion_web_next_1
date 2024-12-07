"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BandData } from "../data";
import ModalComponent from "../../Components/ModalComponent";

// フリップアニメーションのためのCSSを追加
const styles = `
  .flip {
    transform: rotateY(180deg);
    transition: transform 0.6s;
  }
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ドキュメントの書字方向を取得し、縦書きかどうかを判定
const isVerticalWritingMode = (): boolean => {
  const writingMode = window.getComputedStyle(document.documentElement).writingMode;
  return writingMode.includes("vertical");
};

// スクロールバーの幅を計算する
const getScrollBarSize = (): number => {
  const scrollBarXSize = window.innerHeight - document.body.clientHeight;
  const scrollBarYSize = window.innerWidth - document.body.clientWidth;
  return isVerticalWritingMode() ? scrollBarXSize : scrollBarYSize;
};

// スクロール位置を取得する
const getScrollPosition = (fixed: boolean): number => {
  if (fixed) {
    return isVerticalWritingMode()
      ? document.scrollingElement?.scrollLeft ?? 0
      : document.scrollingElement?.scrollTop ?? 0;
  }
  return parseInt(document.body.style.insetBlockStart || "0", 10);
};

type AllowedStyles =
  | "blockSize"
  | "insetInlineStart"
  | "position"
  | "insetBlockStart"
  | "inlineSize";

// 背面固定のスタイルを適用する
const applyStyles = (scrollPosition: number, apply: boolean): void => {
  const styles: Partial<Record<AllowedStyles, string>> = {
    blockSize: "100dvb",
    insetInlineStart: "0",
    position: "fixed",
    insetBlockStart: isVerticalWritingMode() ? `${scrollPosition}px` : `${scrollPosition * -1}px`,
    inlineSize: "100dvi",
  };
  Object.keys(styles).forEach((key) => {
    const styleKey = key as AllowedStyles;
    document.body.style[styleKey] = apply ? styles[styleKey]! : "";
  });
};

// スクロール位置を元に戻す
const restorePosition = (scrollPosition: number): void => {
  const options: ScrollToOptions = {
    behavior: "instant",
    [isVerticalWritingMode() ? "left" : "top"]: isVerticalWritingMode()
      ? scrollPosition
      : scrollPosition * -1,
  };
  window.scrollTo(options);
};

// 背面を固定する
const backfaceFixed = (fixed: boolean): void => {
  const scrollBarWidth = getScrollBarSize();
  const scrollPosition = getScrollPosition(fixed);
  document.body.style.paddingInlineEnd = fixed ? `${scrollBarWidth}px` : "";
  applyStyles(scrollPosition, fixed);
  if (!fixed) {
    restorePosition(scrollPosition);
  }
};

export const BandShowcase = ({ data }: { data: BandData[] }) => {
  const [selectedBand, setSelectedBand] = useState<BandData | null>(null);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const totalBands = data.length;

  const openModal = (band: BandData, index: number) => {
    setFlippingIndex(index);
    setTimeout(() => {
      setSelectedBand(band);
    }, 300); // フリップアニメーションの時間に合わせる
  };

  const closeModal = () => {
    setSelectedBand(null);
    setFlippingIndex(null); // フリップインデックスをリセット
  };

  const handleSwipeLeft = () => {
    if (selectedBand) {
      const currentIndex = data.findIndex((band) => band.name === selectedBand.name);
      const nextIndex = (currentIndex + 1) % data.length;
      setSelectedBand(data[nextIndex]);
    }
  };

  const handleSwipeRight = () => {
    if (selectedBand) {
      const currentIndex = data.findIndex((band) => band.name === selectedBand.name);
      const prevIndex = (currentIndex - 1 + data.length) % data.length;
      setSelectedBand(data[prevIndex]);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mb-12 sm:mb-16 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black text-center ">出演バンド</h1>
          <p className="mt-1 text-sm text-gray-600 text-center ">画像をクリックでバンド詳細へ</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {data.map((band, index) => (
            <div
              key={band.name} // 一意のkeyプロパティを追加
              className={`cursor-pointer transform transition duration-300 ${
                flippingIndex === index ? "flip opacity-15 " : ""
              }`}
              onClick={() => openModal(band, index)}
            >
              <div className="relative w-full h-0 pb-[100%]">
                {loading && <div className="loading-spinner"></div>}
                <Image
                  src={band.photo}
                  alt={band.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  className="rounded-lg shadow-md transition-opacity duration-500 ease-in-out opacity-0"
                  style={{ objectFit: "cover" }}
                  onLoad={(e) => {
                    e.currentTarget.classList.remove("opacity-0");
                    setLoading(false);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {selectedBand && (
          <ModalComponent
            selectedBand={selectedBand}
            closeModal={closeModal}
            handleSwipeLeft={handleSwipeLeft}
            handleSwipeRight={handleSwipeRight}
            loading={loading}
            setLoading={setLoading}
            totalBands={totalBands}
          />
        )}
      </div>
    </>
  );
};

export default BandShowcase;
