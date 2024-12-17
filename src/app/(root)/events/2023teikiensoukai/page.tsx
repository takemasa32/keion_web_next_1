import React from "react";
import Link from "next/link";
import { events } from "../../../data/events";
import CustomImage from "../Components/CustomImage";
import EventList from "../Components/EventList";
import EventSection from "../Components/EventSection";
import { bandData } from "./data";
import BandShowcase from "../2024teikiensoukai/_components/BandShowcase";

import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
export const metadata: Metadata = {
  title: "2023年度 定期演奏会 | 島根大学軽音楽部",
  description: "島根大学軽音楽部の2023年度の定期演奏会についての情報です。",
};
const EventsPage = () => {
  return (
    <>
      <div className="relative bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 min-h-screen py-6 sm:py-8 lg:py-12">
        <div className="container relative z-10 mx-auto px-4">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-8 sm:mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-white break-words">
                島根大学軽音楽部
                <br />
                第57回定期演奏会
              </h1>
            </div>
            <div className="pt-6">
              <p className="text-base sm:text-lg text-white text-center break-words">
                〜定期演奏会？じゃあ何？みんなこの日のために頑張ってきたってこと？
                <br />
                全員で協力して、それで今年の定演も大成功しちゃえばいいんだ？〜
              </p>
            </div>
          </div>
          {/* イベント紹介 */}
          <EventSection
            title="2023年度 定期演奏会"
            dates={["2023-12-16"]}
            location="安来市総合文化ホール アルテピア"
            description="島根大学軽音部 年に一度の集大成となるライブです。入場無料です。ぜひご観覧に来てください。"
            mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13005.069972902245!2d133.226691039205!3d35.423403150290596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3556fc17460f8a8b%3A0x876867d7ff94bba3!2z5a6J5p2l5biC57eP5ZCI5paH5YyW44Ob44O844OrIOOCouODq-ODhuODlOOCog!5e0!3m2!1sja!2sjp!4v1731082476456!5m2!1sja!2sjp"
          />
          {/* バンド紹介 */}
          <BandShowcase data={bandData} />

          <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
              2023年の部Tが完成しました！
            </h2>
            <Link href="/events/2023BukatuT">
              <div className="flex justify-center space-x-8 cursor-pointer">
                <div className="flex flex-col items-center">
                  <CustomImage
                    src="/image/2023T/2023TシャツMain.jpg"
                    alt="2023のTシャツ背面デザイン"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg object-cover"
                  />
                  <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                    背面デザイン
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <CustomImage
                    src="/image/2023T/2023Tシャツ.jpg"
                    alt="今年のTシャツワンポイントデザイン"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg object-cover"
                  />
                  <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                    ワンポイントデザイン
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
              今年のTシャツは、このようになりました。部員がデザインしました！
            </p>
          </div>
          <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-500">詳細な情報については以下のSNSから？</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a
                href="https://twitter.com/shimaneU_keion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
              >
                <i className="fab fa-twitter fa-3x"></i>
                <span className="ml-4 text-xl font-semibold">Twitter</span>
              </a>
              <a
                href="https://www.instagram.com/shimadai_keion/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition duration-300"
              >
                <i className="fab fa-instagram fa-3x"></i>
                <span className="ml-4 text-xl font-semibold">Instagram</span>
              </a>
            </div>
            <p className="mt-8 text-center text-gray-500">
              ↑各アイコンをクリックで、SNSに飛べます。
            </p>
          </div>
          <EventList events={events} />
        </div>

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
    </>
  );
};

export default EventsPage;
