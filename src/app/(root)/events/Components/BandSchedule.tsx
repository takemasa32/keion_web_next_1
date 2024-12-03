"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Band = {
  date: string;
  start: string;
  end: string;
  name: string;
};

const parseTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const getCurrentBandIndex = (bandSchedule: Band[], virtualDateTime: Date | null) => {
  const now = virtualDateTime || new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const currentDate = jstNow.toISOString().split("T")[0];
  const currentTime = `${jstNow.getHours()}:${jstNow.getMinutes().toString().padStart(2, "0")}`;

  let currentBandIndex = -1;

  for (let i = 0; i < bandSchedule.length; i++) {
    const band = bandSchedule[i];
    if (
      band.date === currentDate &&
      parseTime(currentTime) >= parseTime(band.start) &&
      parseTime(currentTime) <= parseTime(band.end)
    ) {
      currentBandIndex = i;
      break;
    }
  }

  return { currentBandIndex, currentDate, currentTime };
};

type BandScheduleProps = {
  eventName: string;
  eventDate: string;
  bandSchedule: Band[];
  isDebugMode?: boolean;
  viewSetting?: "open" | "close";
  BandScheduleLink?: string;
};

const BandSchedule: React.FC<BandScheduleProps> = ({
  eventName,
  eventDate,
  bandSchedule,
  isDebugMode = false,
  viewSetting,
  BandScheduleLink,
}) => {
  const [virtualDateTime, setVirtualDateTime] = useState<Date | null>(null);
  const [showAll, setShowAll] = useState(
    viewSetting ? (viewSetting == "open" ? true : viewSetting == "close" ? false : false) : false
  );
  const router = useRouter();
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = new Date(e.target.value);
    if (!isNaN(selectedDateTime.getTime())) {
      setVirtualDateTime(selectedDateTime);
    } else {
      setVirtualDateTime(null);
    }
  };

  const { currentBandIndex, currentDate, currentTime } = getCurrentBandIndex(
    bandSchedule,
    isDebugMode ? virtualDateTime : null
  );

  const eventStartTime = bandSchedule[0]?.start || "00:00";
  const eventEndTime = bandSchedule[bandSchedule.length - 1]?.end || "23:59";

  const bandsToShow = showAll
    ? bandSchedule
    : bandSchedule.slice(
        Math.max(0, currentBandIndex - 1),
        Math.min(bandSchedule.length, currentBandIndex + 2)
      );

  return (
    <div className="mb-12 sm:mb-16 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8">
        {eventName}
        <br /> タイムスケジュール
      </h2>
      {isDebugMode && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">仮想現在日時を選択してください:</label>
          <input
            type="datetime-local"
            onChange={handleDateTimeChange}
            className="border rounded text-black px-2 py-1"
          />
        </div>
      )}
      <div className="flex flex-col items-center">
        {currentDate !== eventDate && (
          <p className="text-lg text-gray-700 mb-4">
            イベントは {eventDate} に開催されます。お楽しみに！
          </p>
        )}
        {currentDate == eventDate && parseTime(currentTime) < parseTime(eventStartTime) && (
          <p className="text-lg text-gray-700 mb-4">
            演奏は {eventStartTime} に開始します。お楽しみに！
          </p>
        )}
        {currentDate === eventDate && parseTime(currentTime) > parseTime(eventEndTime) && (
          <p className="text-lg text-gray-700 mb-4">
            本日の演奏は終了しました。ご来場ありがとうございました！
          </p>
        )}
        {currentDate === eventDate && currentBandIndex !== -1 && (
          <div className="mt-4">
            <p className="text-lg text-gray-700">
              現在演奏中のバンド: <strong>{bandSchedule[currentBandIndex].name}</strong> (
              {bandSchedule[currentBandIndex].start} - {bandSchedule[currentBandIndex].end})
            </p>
          </div>
        )}
        {currentDate === eventDate && currentBandIndex === -1 && (
          <div className="mt-4">
            <p className="text-lg text-gray-700">
              現在は休憩時間です。次に演奏するバンド:{" "}
              <strong>
                {bandSchedule.find((band) => parseTime(currentTime) < parseTime(band.start))
                  ?.name || "なし"}
              </strong>
            </p>
          </div>
        )}
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-black">バンド名</th>
              <th className="py-2 px-4 border-b border-gray-200 text-black">開始</th>
              <th className="py-2 px-4 border-b border-gray-200 text-black">終了</th>
            </tr>
          </thead>
          <tbody>
            {bandsToShow.map((band, index) => {
              const previousBandEnd = index > 0 ? parseTime(bandSchedule[index - 1].end) : null;
              const currentBandStart = parseTime(band.start);
              const gap = previousBandEnd !== null ? currentBandStart - previousBandEnd : 0;

              const isCurrentBand = bandSchedule.indexOf(band) === currentBandIndex;
              const isCurrentBreak =
                previousBandEnd !== null &&
                currentTime >= formatTime(previousBandEnd) &&
                currentTime < formatTime(currentBandStart);

              return (
                <React.Fragment key={index}>
                  {gap > 0 && (
                    <tr className={`${isCurrentBreak ? "bg-yellow-100" : "bg-gray-100"}`}>
                      <td
                        colSpan={3}
                        className="py-2 px-4 border-b border-gray-200 text-center text-gray-600"
                      >
                        休憩時間 ({formatTime(previousBandEnd!)} - {formatTime(currentBandStart)})
                      </td>
                    </tr>
                  )}
                  <tr className={`${isCurrentBand ? "bg-yellow-200" : "bg-white"}`}>
                    <td className="py-2 px-4 border-b border-gray-200 text-black">{band.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-black">{band.start}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-black">{band.end}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {viewSetting ? null : (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAll ? "閉じる" : "全て表示"}
          </button>
        )}
        {BandScheduleLink ? (
          <Link href={BandScheduleLink}>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              スケジュールページへ
            </button>
          </Link>
        ) : null}
      </div>
      {/* 実際の時間によって表示が変化する案内 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">※現在の日付,時刻によって表示が変化します。</p>
      </div>
    </div>
  );
};

export default BandSchedule;
