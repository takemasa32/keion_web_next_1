import React from "react";
import Head from "next/head";
import Link from "next/link";
import { events } from "../../../data/events";
import CustomImage from "../Components/CustomImage";
import EventList from "../Components/EventList";
import BandSchedule from "../Components/BandSchedule";
import EventSection from "../Components/EventSection";
import { bandData, bandScheduleData } from "./data";
import BandShowcase from "./_components/BandShowcase";

const EventsPage = () => {
  return (
    <>
      <Head>
        <title>島根大学軽音楽部 第58回定期演奏会</title>
        <meta name="description" content="島根大学軽音楽部 第58回定期演奏会の紹介ページです。" />
        <meta name="keywords" content="島根大学, 軽音楽部, 定期演奏会, 音楽, ライブ" />
        <meta property="og:title" content="島根大学軽音楽部 第58回定期演奏会" />
        <meta
          property="og:description"
          content="島根大学軽音楽部 第58回定期演奏会の紹介ページです。"
        />
        <meta property="og:image" content="/image/keionBackImage.JPG" />
        <meta property="og:url" content="https://shimadaikeion.com/events/2024teikiensoukai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="島根大学軽音楽部 第58回定期演奏会" />
        <meta
          name="twitter:description"
          content="島根大学軽音楽部 第58回定期演奏会の紹介ページです。"
        />
        <meta name="twitter:image" content="/image/keionBackImage.JPG" />
      </Head>

      <div className="relative bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 min-h-screen py-6 sm:py-8 lg:py-12">
        <div className="container relative z-10 mx-auto px-4">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-8 sm:mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-white break-words">
                島根大学軽音楽部
                <br />
                第58回定期演奏会
              </h1>
            </div>
            <div className="pt-6">
              <p className="text-base sm:text-lg text-white text-center break-words">
                もう最高の定演はじまるからねー
                <br />
                〜ん、良き定演、心賑やかなり〜
              </p>
            </div>
          </div>

          {/* 内容一覧セクションの追加 */}
          <div className="content-list bg-white bg-opacity-80 p-6 rounded-lg shadow-lg mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
              目次
            </h2>
            <ul className="list-none text-base text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li>
                <a
                  href="#about"
                  className="block bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  定期演奏会について
                </a>
              </li>
              <li>
                <a
                  href="#poster"
                  className="block bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  ポスター紹介
                </a>
              </li>
              <li>
                <a
                  href="#band-showcase"
                  className="block bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  出演バンド一覧
                </a>
              </li>
              <li>
                <a
                  href="#band-schedule"
                  className="block bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  スケジュール
                </a>
              </li>
              <li>
                <a
                  href="#sns"
                  className="block bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  SNS
                </a>
              </li>
            </ul>
          </div>

          {/* イベント紹介 */}
          <div id="about">
            <EventSection
              title="2024年度 定期演奏会"
              dates={["2024-12-21"]}
              location="安来市総合文化ホール アルテピア"
              description="島根大学軽音部 年に一度の集大成となるライブです。入場無料です。ぜひご観覧に来てください。"
              mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13005.069972902245!2d133.226691039205!3d35.423403150290596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3556fc17460f8a8b%3A0x876867d7ff94bba3!2z5a6J5p2l5biC57eP5ZCI5paH5YyW44Ob44O844OrIOOCouODq-ODhuODlOOCog!5e0!3m2!1sja!2sjp!4v1731082476456!5m2!1sja!2sjp"
            />
          </div>
          {/* ポスター紹介 */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg mb-8 sm:mb-12">
            <h2
              id="poster"
              className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words"
            >
              定期演奏会ポスター
            </h2>
            <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="flex flex-col items-center">
                <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
                  ポスター
                </p>
                <CustomImage
                  src="/image/2024teien/2024poster.jpg"
                  alt="定期演奏会ポスター"
                  width={600}
                  height={800}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <p
                  id="key-visual"
                  className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words"
                >
                  キービジュアル
                </p>
                <CustomImage
                  src="/image/2024teien/2024mainPhoto.jpg"
                  alt="定期演奏会キービジュアル"
                  width={600}
                  height={800}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
              <a href="#" className="text-black text-right">
                Topへ移動
              </a>
            </div>
          </div>
          {/* バンド紹介 */}
          <div id="band-showcase">
            <BandShowcase data={bandData} />
          </div>
          {/* スケジュール */}
          <div id="band-schedule">
            <BandSchedule
              eventName="2024年度定期演奏会"
              eventDate="2024-12-21"
              bandSchedule={bandScheduleData}
              isDebugMode={process.env.NODE_ENV === "development"}
              viewSetting="close"
              BandScheduleLink="/events/2024teikiensoukai/schedule"
            />
          </div>
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
                    src="/image/2024keionMiniLogo.JPG"
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
          <div id="sns" className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
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
