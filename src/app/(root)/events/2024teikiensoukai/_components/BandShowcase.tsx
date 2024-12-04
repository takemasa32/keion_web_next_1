"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { BandData } from "../data";

// フリップアニメーションのためのCSSを追加
const styles = `
  .flip {
    transform: rotateY(180deg);
    transition: transform 0.6s;
  }
`;

export const BandShowcase = ({ data }: { data: BandData[] }) => {
  const [selectedBand, setSelectedBand] = useState<BandData | null>(null);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
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

  return (
    <>
      <style>{styles}</style> {/* スタイルを追加 */}
      <div className="mb-12 sm:mb-16 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-black text-center mb-8">出演バンド</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {data.map((band, index) => (
            <div
              key={index}
              className={`cursor-pointer transform transition duration-300 ${
                flippingIndex === index ? "flip opacity-15 " : ""
              }`}
              onClick={() => openModal(band, index)}
            >
              <div className="relative w-full h-0 pb-[100%]">
                <Image
                  src={band.photo}
                  alt={band.name}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  className="rounded-lg shadow-md transition-opacity duration-500 ease-in-out opacity-0"
                  onLoadingComplete={(img) => img.classList.remove("opacity-0")}
                />
              </div>
            </div>
          ))}
        </div>

        {selectedBand && (
          <Modal
            isOpen={!!selectedBand}
            onRequestClose={closeModal}
            contentLabel="Band Details"
            className="fixed mx-4 my-6 inset-0 flex items-center justify-center z-50 transition-opacity duration-600"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-600"
            ariaHideApp={false}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto relative z-50 transform transition-transform duration-300 scale-100">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <div className="relative w-full h-0 pb-[100%]">
                <Image
                  src={selectedBand.photo}
                  alt={selectedBand.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-auto mb-4 rounded transition-opacity duration-500 ease-in-out bg-gray-200 animate-pulse"
                  onLoadingComplete={(img) => img.classList.remove("bg-gray-200", "animate-pulse")}
                />
              </div>
              <h2 className="text-2xl text-gray-700 text-center font-bold">{selectedBand.name}</h2>
              <p className="text-sm text-gray-500 text-center font-bold mb-2">
                {selectedBand.copyFrom}
              </p>
              <div className="overflow-y-auto max-h-40 border-t border-b border-gray-300 my-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                <p
                  className="text-gray-700 text-center leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: selectedBand.comment.replace(/\n/g, "<br />"),
                  }}
                ></p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gray-500 h-2.5 rounded-full"
                  style={{ width: `${Math.floor((selectedBand.order / totalBands) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>開演</span>
                <span>終演</span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default BandShowcase;
