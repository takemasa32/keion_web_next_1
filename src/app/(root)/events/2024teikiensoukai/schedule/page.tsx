"use client"
import React from "react";
import Link from "next/link";
import BandSchedule from "../../Components/BandSchedule";
import { bandScheduleData } from "../data";
import { events } from "@/app/data/events";
import EventList from "../../Components/EventList";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

const EventsPage = () => {
  return (
    <div className="relative bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="container relative z-10 mx-auto px-4">
        <BandSchedule
          eventName="2024年度定期演奏会"
          eventDate="2024-12-21"
          bandSchedule={bandScheduleData}
          isDebugMode={process.env.NODE_ENV === "development"}
          viewSetting="open"
        />

        {/* 定期演奏会ページへ戻る案内 */}
        <Link href="/events/2024teikiensoukai">
          <div className="mt-2 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
            <p className="block text-center text-blue-500 hover:underline">
              <i className="fas fa-chevron-left mr-2"></i>定期演奏会ページへ戻る
            </p>
          </div>
        </Link>

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
