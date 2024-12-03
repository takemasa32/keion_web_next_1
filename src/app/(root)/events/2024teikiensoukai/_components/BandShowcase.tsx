// BandShowcase.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { BandData } from "../data";

export const BandShowcase = ({ data }: { data: BandData[] }) => {
  const [selectedBand, setSelectedBand] = useState<BandData | null>(null);

  const openModal = (band: BandData) => {
    setSelectedBand(band);
  };

  const closeModal = () => {
    setSelectedBand(null);
  };

  return (
    <div className="mb-12 sm:mb-16 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-black text-center mb-8">出演バンド</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {data.map((band, index) => (
          <div
            key={index}
            className="cursor-pointer transform transition duration-300 hover:scale-105"
            onClick={() => openModal(band)}
          >
            <Image
              src={band.photo}
              alt={band.name}
              width={500}
              height={500}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      {selectedBand && (
        <Modal
          isOpen={!!selectedBand}
          onRequestClose={closeModal}
          contentLabel="Band Details"
          className="fixed inset-0 flex  m-2 items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
          ariaHideApp={false}
        >
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto relative z-50">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <Image
              src={selectedBand.photo}
              alt={selectedBand.name}
              width={500}
              height={500}
              className="w-full h-auto mb-4 rounded"
            />
            <h2 className="text-2xl text-gray-600 text-center font-bold mb-2">
              {selectedBand.name}
            </h2>
            <h3 className="text-xl text-center text-gray-600 mb-4">{selectedBand.copyFrom}</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {selectedBand.comment.replace(/\\n/g, "\n")}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BandShowcase;
