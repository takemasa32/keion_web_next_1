"use client";
import React, { useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { BandData } from "../2024teikiensoukai/data";

// ドキュメントの書字方向を取得し、縦書きかどうかを判定
const isVerticalWritingMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const writingMode = window.getComputedStyle(document.documentElement).writingMode;
  return writingMode.includes("vertical");
};

// スクロールバーの幅を計算する
const getScrollBarSize = (): number => {
  if (typeof window === "undefined") return 0;
  const scrollBarXSize = window.innerHeight - document.body.clientHeight;
  const scrollBarYSize = window.innerWidth - document.body.clientWidth;
  return isVerticalWritingMode() ? scrollBarXSize : scrollBarYSize;
};

// スクロール位置を取得する
const getScrollPosition = (fixed: boolean): number => {
  if (typeof window === "undefined") return 0;
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
  if (typeof document === "undefined") return;
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
  if (typeof window === "undefined") return;
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
  if (typeof window === "undefined") return;
  const scrollBarWidth = getScrollBarSize();
  const scrollPosition = getScrollPosition(fixed);
  document.body.style.paddingInlineEnd = fixed ? `${scrollBarWidth}px` : "";
  applyStyles(scrollPosition, fixed);
  if (!fixed) {
    restorePosition(scrollPosition);
  }
};

interface ModalComponentProps {
  selectedBand: BandData | null;
  closeModal: () => void;
  handleSwipeLeft: () => void;
  handleSwipeRight: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  totalBands: number;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  selectedBand,
  closeModal,
  handleSwipeLeft,
  handleSwipeRight,
  loading,
  setLoading,
  totalBands,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const app = document.getElementById("__next");
      if (app) {
        Modal.setAppElement(app);
      }
    }

    if (selectedBand) {
      backfaceFixed(true); // モーダルを開くときにスクロールを無効にする
    } else {
      backfaceFixed(false); // モーダルを閉じるときにスクロールを有効にする
    }
    return () => {
      backfaceFixed(false); // クリーンアップ時にスクロールを有効にする
    };
  }, [selectedBand]);

  return (
    <>
      {/* バンド情報モーダル */}
      <Modal
        isOpen={!!selectedBand}
        onRequestClose={closeModal}
        contentLabel="Band Details"
        className="mx-4 my-8 max-h-[90vh] overflow-y-auto focus:outline-none"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-0 sm:p-6"
      >
        <div
          {...handlers}
          className="relative z-50 w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        >
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-sm font-medium text-gray-600 shadow hover:bg-white"
            aria-label="モーダルを閉じる"
          >
            ×
          </button>
          <div className="flex flex-col gap-6 p-6 sm:flex-row">
            <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl bg-gray-100">
              {!loading && !selectedBand?.photo && (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}
              {loading && <div className="loading-spinner"></div>}
              {selectedBand?.photo && (
                <Image
                  src={selectedBand.photo}
                  alt={selectedBand.name}
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                  onLoadingComplete={() => setLoading(false)}
                />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                  {selectedBand?.copyFrom}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {selectedBand?.name}
                </h2>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 shadow-inner">
                <p
                  dangerouslySetInnerHTML={{
                    __html: selectedBand?.comment.replace(/\n/g, "<br />") || "",
                  }}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                  <span>開演</span>
                  <span>終演</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.floor(((selectedBand?.order ?? 0) / totalBands) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 text-xs text-gray-400">
                <span>スワイプまたは ← → でバンドを切り替え</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-700"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;
