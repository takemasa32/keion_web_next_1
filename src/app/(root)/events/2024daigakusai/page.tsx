"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { events } from "../../../data/events"; // イベントデータをインポート

const EventsPage = () => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/image/keionMiniLogo.JPG"; // デフォルトのロゴ画像のパス
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-black mb-8 sm:mb-12 break-words">
          2024年島根大学
          <br />
          大学祭
        </h1>

        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center break-words">
          島根大学軽音楽部は、
          <br />
          今年の島根大学の大学祭「淞風祭」で、
          <br />
          複数のイベントを行います。
        </p>

        {/* オープンステージでのライブパフォーマンス */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            オープンステージでの
            <br />
            ライブパフォーマンス
          </h2>
          <ul className="text-base sm:text-lg text-gray-700 mb-4 list-disc list-inside break-words">
            <li>日時：10月13日（日）13:40～16:10</li>
            <li>場所：屋外メインステージ</li>
            <li>
              内容：様々なジャンルの音楽が演奏され、観客が音楽を楽しみながら盛り上がることができます。
            </li>
          </ul>
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
            <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12994.669619825514!2d133.0632445285708!3d35.48777202691312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35570447d6b9c935%3A0x38f76f85ddd0e6df!2z44CSNjkwLTA4MjMg5bO25qC555yM5p2-5rGf5biC6KW_5bed5rSl55S677yR77yQ77yW77yQ!5e0!3m2!1sja!2sjp!4v1728468198267!5m2!1sja!2sjp"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
                OS争奪ライブを勝ち抜いた9組のバンドが演奏します！あなたの好きなバンドも見つかるかもしれません！是非ご観覧よろしくお願いします。
              </p>
            </div>
          </div>
        </div>

        {/* 屋台とグッズ販売 */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            屋台とグッズ販売
          </h2>
          <ul className="text-base sm:text-lg text-gray-700 mb-4 list-disc list-inside break-words">
            <li>日時：10月13日（日）9:00～18:00、10月14日（月）9:00～16:30</li>
            <li>場所：メインストリート ブース36</li>
            <li>
              内容：軽音部特製のラバーバンドやマフラータオルといったオリジナルグッズの販売、ドリンクの販売
            </li>
          </ul>
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
            <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12994.669619825514!2d133.0632445285708!3d35.48777202691312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35570447d6b9c935%3A0x38f76f85ddd0e6df!2z44CSNjkwLTA4MjMg5bO25qC555yM5p2-5rGf5biC6KW_5bed5rSl55S677yR77yQ77yW77yQ!5e0!3m2!1sja!2sjp!4v1728468268067!5m2!1sja!2sjp"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
                軽音特製フルーツ入りドリンクです。ライブと言えばワンドリンク制！！ぜひライブや模擬店のお供にいかがですか！？
              </p>
              <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
                📍ブース36
                <br />
                ⏱13日(日) / 14日(月·祝) 09:30~15:00
              </p>
            </div>
          </div>
        </div>

        {/* 屋内企画 */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            屋内企画
          </h2>
          <ul className="text-base sm:text-lg text-gray-700 mb-4 list-disc list-inside break-words">
            <li>日時：10月13日（日）、10月14日（月·祝）9:30～18:30</li>
            <li>場所：大学会館三階 大集会室</li>
            <li>内容：軽音楽部によるパフォーマンスライブ。様々な曲を演奏予定。</li>
          </ul>
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
            <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d756.983166807845!2d133.0672306940725!3d35.48761210334694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x355704487e9ce4d5%3A0xf3d5fb7363f95c40!2z5aSn5a2m5Lya6aSo!5e0!3m2!1sja!2sjp!4v1728468359166!5m2!1sja!2sjp"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
                軽音楽部によるパフォーマンスライブを行います！様々な曲を演奏予定なのできっと皆さんが好きな曲もあるはず！是非お越しください！
              </p>
              <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
                📍大学会館三階 大集会室
                <br />
                ⏱13日(日) / 14日(月·祝) 09:30~18:30
              </p>
            </div>
          </div>
        </div>

        {/* Tシャツデザイン */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            今年のTシャツデザインができました！
          </h2>
          <div className="flex justify-center">
            <Image
              src="/image/keionBackImage.JPG"
              alt="今年のTシャツデザイン"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
              onError={handleImageError}
            />
          </div>
          <p className="text-base sm:text-lg text-center text-gray-700 mt-4 break-words">
            今年のTシャツは、このようなデザインとなっています。部員が着用しています！
          </p>
        </div>

        {/* イベント情報 */}
        <div className="mt-8 sm:mt-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
            イベント情報
          </h1>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Link href={event.link || "#"} key={index}>
                <div
                  className={`relative bg-gray-100 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 ${
                    event.link ? "hover:bg-gray-200" : ""
                  }`}
                >
                  <Image
                    src={event.image || "/image/keionMiniLogo.JPG"}
                    alt={event.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 break-words">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 mb-2 sm:mb-4 break-words">{event.date}</p>
                    <p className="text-gray-700 break-words">{event.description}</p>
                  </div>
                  {event.link && (
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
                      <FaExternalLinkAlt className="text-gray-800" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
