"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BandData } from "../data";
import ModalComponent from "../../Components/ModalComponent";

// フリップアニメーション
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
