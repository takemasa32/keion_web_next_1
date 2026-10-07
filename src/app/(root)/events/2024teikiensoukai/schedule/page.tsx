import SNSButton from "../../../components/SNSButton";
import React from "react";
import Link from "next/link";
import BandSchedule from "../../Components/BandSchedule";
import { bandScheduleData } from "../data";
import { events } from "@/app/data/events";
import EventList from "../../Components/EventList";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

const EventsPage = () => {
  return (
    <div className="detail-shell relative min-h-screen">
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
            <p className="text-lg text-gray-500">お問い合わせは公式SNSから。</p>
          </div>
          <SNSButton />
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
