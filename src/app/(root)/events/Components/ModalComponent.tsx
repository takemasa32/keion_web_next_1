import React, { useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { BandData } from "../2024teikiensoukai/data";

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
      {/* スマホ用モーダル */}
      {/* <div className="md:hidden">
        <Modal
          isOpen={!!selectedBand}
          onRequestClose={closeModal}
          contentLabel="Band Details"
          className="fixed mx-3 my-6 inset-0 flex items-center justify-center z-50 transition-opacity duration-600"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-600"
          ariaHideApp={false}
        >
          <div
            {...handlers}
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-auto relative z-50 transform transition-transform duration-300 scale-100"
            style={{ maxWidth: "90%", maxHeight: "90vh" }}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <div className="relative w-full h-0 pb-[100%] md:pb-[56.25%] bg-gray-200">
              {loading && <div className="loading-spinner"></div>}
              <Image
                src={selectedBand?.photo || ""}
                alt={selectedBand?.name || ""}
                fill
                className="w-auto h-auto mb-4 rounded transition-opacity duration-500 ease-in-out"
                style={{ objectFit: "contain" }}
                onLoad={(img) => {
                  img.currentTarget.classList.remove("bg-black", "animate-pulse");
                  setLoading(false);
                }}
              />
            </div>
            <h2 className="text-2xl text-gray-700 text-center font-bold">{selectedBand?.name}</h2>
            <p className="text-sm text-gray-500 text-center font-bold mb-2">
              {selectedBand?.copyFrom}
            </p>
            <div className="overflow-y-auto h-28 border-t border-b border-gray-300 my-4 p-4 bg-gray-100 rounded-lg shadow-inner">
              <p
                className="text-gray-700 text-center leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: selectedBand?.comment.replace(/\n/g, "<br />") || "",
                }}
              ></p>
            </div>
            <div className="flex items-center justify-center mb-4"></div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-gray-500 h-2.5 rounded-full"
                style={{ width: `${Math.floor(((selectedBand?.order ?? 0) / totalBands) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>開演</span>
              <span>終演</span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                close
              </button>
            </div>
            <div className="mt-40 absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={handleSwipeRight}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="mt-40 absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={handleSwipeLeft}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </Modal>
      </div> */}

      {/* デスクトップ用モーダル */}
      <div className="hidden sm:block">
        <Modal
          isOpen={!!selectedBand}
          onRequestClose={closeModal}
          contentLabel="Band Details"
          className="fixed mx-4 my-6 inset-0 flex items-center justify-center z-50 transition-opacity duration-600"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-600"
          ariaHideApp={false}
        >
          <div
            {...handlers}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-auto relative z-50 transform transition-transform duration-300 scale-100"
            style={{ maxWidth: "90%", maxHeight: "90vh" }}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
                {loading && <div className="loading-spinner"></div>}
                <Image
                  src={selectedBand?.photo || ""}
                  alt={selectedBand?.name || ""}
                  fill
                  className="w-full h-full object-contain rounded transition-opacity duration-500 ease-in-out"
                  onLoad={(img) => {
                    img.currentTarget.classList.remove("bg-black", "animate-pulse");
                    setLoading(false);
                  }}
                />
              </div>
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl text-gray-700 font-bold">{selectedBand?.name}</h2>
                <p className="text-sm text-gray-500 font-bold mb-2">{selectedBand?.copyFrom}</p>
                <div className="overflow-y-auto max-h-28 border-t border-b border-gray-300 my-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                  <p
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: selectedBand?.comment.replace(/\n/g, "<br />") || "",
                    }}
                  ></p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-gray-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.floor(((selectedBand?.order ?? 0) / totalBands) * 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>開演</span>
                  <span>終演</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ModalComponent;
