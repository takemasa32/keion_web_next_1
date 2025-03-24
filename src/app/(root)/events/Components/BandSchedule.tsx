"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaChevronDown, FaChevronUp, FaCalendarAlt } from "react-icons/fa";

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
  let nextBandIndex = null;

  for (let i = 0; i < bandSchedule.length; i++) {
    const band = bandSchedule[i];
    if (
      band.date === currentDate &&
      parseTime(currentTime) >= parseTime(band.start) &&
      parseTime(currentTime) <= parseTime(band.end)
    ) {
      currentBandIndex = i;
      break;
    } else if (band.date === currentDate && parseTime(currentTime) < parseTime(band.start)) {
      nextBandIndex = i;
      break;
    }
  }

  return { currentBandIndex, currentDate, currentTime, nextBandIndex };
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
    viewSetting ? (viewSetting === "open" ? true : viewSetting === "close" ? false : false) : false
  );
  const [isActive, setIsActive] = useState(false);

  // ページロード時にアニメーションを有効化
  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = new Date(e.target.value);
    if (!isNaN(selectedDateTime.getTime())) {
      setVirtualDateTime(selectedDateTime);
    } else {
      setVirtualDateTime(null);
    }
  };

  const { currentBandIndex, currentDate, currentTime, nextBandIndex } = getCurrentBandIndex(
    bandSchedule,
    isDebugMode ? virtualDateTime : null
  );

  const eventStartTime = bandSchedule[0]?.start || "00:00";
  const eventEndTime = bandSchedule[bandSchedule.length - 1]?.end || "23:59";

  const bandsToShow = showAll
    ? bandSchedule
    : nextBandIndex === null
    ? bandSchedule.slice(
        Math.max(0, currentBandIndex - 1),
        Math.min(bandSchedule.length, currentBandIndex + 5)
      )
    : bandSchedule.slice(
        Math.max(0, nextBandIndex - 1),
        Math.min(bandSchedule.length, nextBandIndex + 5)
      );

  // 現在の時間に対する進行状況をパーセントで計算
  const calculateProgressPercent = () => {
    if (currentDate !== eventDate) return 0;

    const start = parseTime(eventStartTime);
    const end = parseTime(eventEndTime);
    const current = parseTime(currentTime);

    // 開始前か終了後の場合
    if (current < start) return 0;
    if (current > end) return 100;

    // 進行中の場合
    return Math.min(100, Math.max(0, ((current - start) / (end - start)) * 100));
  };

  return (
    <motion.div
      className="mb-12 sm:mb-16 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
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

      {/* イベントステータス表示 */}
      <div className="mb-6">
        {/* 進行状況バー */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${calculateProgressPercent()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>開始 {eventStartTime}</span>
          <span>終了 {eventEndTime}</span>
        </div>

        <div className="flex flex-col items-center">
          {currentDate < eventDate && (
            <motion.div
              className="flex items-center gap-2 text-indigo-600 mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaCalendarAlt />
              <p className="text-lg font-medium">
                イベントは{" "}
                {new Date(eventDate).toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                に開催されます！
              </p>
            </motion.div>
          )}

          {currentDate === eventDate && (
            <div className="w-full max-w-md mx-auto mb-6 bg-indigo-50 rounded-lg p-4 shadow-inner">
              {parseTime(currentTime) < parseTime(eventStartTime) && (
                <motion.p
                  className="text-center text-indigo-700"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <FaClock className="inline mr-2" />
                  演奏は <span className="font-bold">{eventStartTime}</span> に開始します！
                </motion.p>
              )}

              {parseTime(currentTime) > parseTime(eventEndTime) && (
                <motion.p
                  className="text-center text-indigo-700"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <FaClock className="inline mr-2" />
                  本日の演奏は終了しました。ご来場ありがとうございました！
                </motion.p>
              )}

              {currentDate === eventDate && currentBandIndex !== -1 && (
                <motion.div
                  className="text-center"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <p className="text-lg text-indigo-700">
                    <span className="font-bold">現在演奏中</span>:{" "}
                    {bandSchedule[currentBandIndex].name}
                  </p>
                  <p className="text-sm text-indigo-600">
                    ({bandSchedule[currentBandIndex].start} - {bandSchedule[currentBandIndex].end})
                  </p>
                </motion.div>
              )}

              {currentDate === eventDate &&
                parseTime(currentTime) < parseTime(eventEndTime) &&
                parseTime(currentTime) > parseTime(eventStartTime) &&
                currentBandIndex === -1 && (
                  <motion.div
                    className="text-center"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <p className="text-lg text-indigo-700">
                      <span className="font-bold">現在休憩中</span>
                    </p>
                    {bandSchedule.find(
                      (band) => parseTime(currentTime) < parseTime(band.start)
                    ) && (
                      <p className="text-sm text-indigo-600 mt-2">
                        次の演奏:{" "}
                        {
                          bandSchedule.find(
                            (band) => parseTime(currentTime) < parseTime(band.start)
                          )?.name
                        }{" "}
                        (
                        {
                          bandSchedule.find(
                            (band) => parseTime(currentTime) < parseTime(band.start)
                          )?.start
                        }
                        )
                      </p>
                    )}
                  </motion.div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* スケジュールテーブル */}
      <div className="overflow-hidden rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  バンド名
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開始
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  終了
                </th>
              </tr>
            </thead>
            <tbody>
              {bandsToShow.map((band, index) => {
                const previousBandEnd = index > 0 ? parseTime(bandSchedule[index - 1].end) : null;
                const currentBandStart = parseTime(bandSchedule[index].start);
                const gap = previousBandEnd !== null ? currentBandStart - previousBandEnd : 0;

                const isCurrentBand = bandSchedule.indexOf(band) === currentBandIndex;
                const isCurrentBreak =
                  previousBandEnd !== null &&
                  currentTime > formatTime(previousBandEnd) &&
                  currentTime < formatTime(currentBandStart);

                return (
                  <React.Fragment key={index}>
                    {gap > 0 && previousBandEnd && (
                      <motion.tr
                        className={`${isCurrentBreak ? "bg-yellow-100" : "bg-gray-100"}`}
                        initial={{ opacity: 0, backgroundColor: "#fff" }}
                        animate={{
                          opacity: 1,
                          backgroundColor: isCurrentBreak ? "#fef3c7" : "#f3f4f6",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <td
                          colSpan={3}
                          className="py-2 px-4 border-b border-gray-200 text-center text-gray-600"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <FaClock className="text-gray-400" />
                            休憩時間 ({formatTime(previousBandEnd)} - {formatTime(currentBandStart)}
                            )
                          </span>
                        </td>
                      </motion.tr>
                    )}
                    <motion.tr
                      className={`${isCurrentBand ? "bg-yellow-200" : "bg-white"} hover:bg-gray-50`}
                      initial={{ opacity: 0, backgroundColor: "#fff" }}
                      animate={{
                        opacity: 1,
                        backgroundColor: isCurrentBand ? "#fef08a" : "#fff",
                      }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-900">
                        {band.name}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        {band.start}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        {band.end}
                      </td>
                    </motion.tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        {viewSetting ? null : (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {showAll ? <FaChevronUp /> : <FaChevronDown />}
            {showAll ? "一部だけ表示" : "全て表示"}
          </motion.button>
        )}

        {BandScheduleLink && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={BandScheduleLink}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>詳細スケジュールへ</span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* 実際の時間によって表示が変化する案内 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">※現在の日付・時刻によって表示が自動で更新されます</p>
      </div>
    </motion.div>
  );
};

export default BandSchedule;
