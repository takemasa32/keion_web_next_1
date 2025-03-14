import React from "react";
import Image from "next/image";
import EventList from "../Components/EventList";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
export const metadata: Metadata = {
  title: "2023年部T紹介 | 島根大学軽音楽部",
  description: "島根大学軽音楽部の2023年の部Tについての情報です。",
};
const BukatuTPage = () => {
  return (
    <div className="relative bg-gradient-to-r from-teal-400 via-cyan-500 to-green-500 min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="container relative z-10 mx-auto px-4">
        <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white break-words">
              2023年
              <br />
              島根大学 軽音楽部 部T
            </h1>
          </div>
          <div className="pt-6">
            <p className="text-base sm:text-lg text-white text-center break-words">
              島根大学軽音楽部の新しい部Tが完成しました！
              <br />
              今年のデザインは、背面にはギターを弾いている女性が描かれたものとなっています。
            </p>
          </div>
        </div>

        {/* Tシャツデザイン */}
        <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            2023年の部Tが完成しました！
          </h2>
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <Image
                src="/image/2023T/2023TシャツMain.jpg"
                alt="2023年のTシャツ背面デザイン"
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
              <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                背面デザイン
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/image/2023T/2023Tシャツ.jpg"
                alt="2023年のTシャツワンポイントデザイン"
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
              <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                ワンポイントデザイン
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
            2023年のTシャツは、このようなデザインとなっています。部員がデザインしました！
          </p>
        </div>

        {/* タオルデザイン */}
        <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            2023年のタオルです！
          </h2>
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <Image
                src="/image/2023T/2023タオル.jpg"
                alt="2023年のタオルデザイン"
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
              <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                背面デザイン
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
            2023年のタオルは、このようなデザインとなっています。部員がデザインしました！
          </p>
        </div>
        {/* イベント情報 */}
        <EventList />
      </div>
      {/* 背景の装飾 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <svg
          className="absolute top-0 left-0 w-64 h-64 opacity-50 animate-spin-slow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
          <line x1="9.69" y1="8" x2="21.17" y2="8" />
          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
          <line x1="14.31" y1="16" x2="2.83" y2="16" />
          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
        </svg>
      </div>
    </div>
  );
};

export default BukatuTPage;
