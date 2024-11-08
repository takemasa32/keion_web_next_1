import React from "react";
import Link from "next/link";
import { events } from "../../../data/events";
import CustomImage from "../Components/CustomImage";
import EventList from "../Components/EventList";
import BandSchedule from "../Components/BandSchedule";
import EventSection from "../Components/EventSection";

const bandScheduleData = [
  { date: "2024-10-13", name: "珍満boys", start: "13:10", end: "13:25" },
  { date: "2024-10-13", name: "ムラムラオカズ", start: "13:30", end: "13:45" },
  { date: "2024-10-13", name: "きゃのん公園", start: "13:50", end: "14:05" },
  { date: "2024-10-13", name: "0 痔 SAN KAN-CHI GRADUAT", start: "14:10", end: "14:25" },
  { date: "2024-10-13", name: "maaiskin", start: "14:30", end: "14:45" },
  { date: "2024-10-13", name: "apricot", start: "14:50", end: "15:05" },
  { date: "2024-10-13", name: "凛として林業", start: "15:10", end: "15:25" },
  { date: "2024-10-13", name: "クロレキシ団", start: "15:30", end: "15:45" },
  { date: "2024-10-13", name: "本当に変", start: "15:50", end: "16:05" },
];

const EventsPage = () => {
  return (
    <div className="relative bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="container relative z-10 mx-auto px-4">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white break-words">
              2024年
              <br />
              島根大学 大学祭
            </h1>
          </div>
          <div className="pt-6 ">
            <p className="text-base sm:text-lg text-white text-center break-words">
              島根大学軽音楽部は、
              <br />
              今年の島根大学の大学祭「淞風祭」で、
              <br />
              複数のイベントを行います。
            </p>
          </div>
        </div>
        <BandSchedule
          eventName="オープンステージでのライブパフォーマンス"
          eventDate="2024-10-13"
          bandSchedule={bandScheduleData}
          isDebugMode={true} //TODO: 本番環境ではfalseにする
        />

        <EventSection
          title="2024年度 定期演奏会"
          dates={["2024-10-13", "2024-10-14"]}
          location="メインストリート ブース36"
          description="軽音部特製のラバーバンドやマフラータオルといったオリジナルグッズの販売、ドリンクの販売"
          mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12994.669619825514!2d133.0632445285708!3d35.48777202691312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f1.1!3m3!1m2!1s0x35570447d6b9c935%3A0x38f76f85ddd0e6df!2z44CSNjkwLTA4MjMg5bO25qC555yM5p2-5rGf5biC6KW_5bed5rSl55S677yR77yQ77yQ77yW77yQ!5e0!3m2!1sja!2sjp"
        />
        <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            今年の部Tが完成しました！
          </h2>
          <Link href="/events/2024BukatuT">
            <div className="flex justify-center space-x-8 cursor-pointer">
              <div className="flex flex-col items-center">
                <CustomImage
                  src="/image/keionBackImage.JPG"
                  alt="今年のTシャツ背面デザイン"
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
                  src="/image/keionMiniLogo.JPG"
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
          <p className="mt-8 text-center text-gray-500">↑各アイコンをクリックで、SNSに飛べます。</p>
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
  );
};

export default EventsPage;
