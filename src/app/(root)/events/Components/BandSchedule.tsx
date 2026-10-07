"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
type Band = { date: string; start: string; end: string; name: string };
type Props = {
  eventName: string;
  eventDate: string;
  bandSchedule: Band[];
  isDebugMode?: boolean;
  viewSetting?: "open" | "close";
  BandScheduleLink?: string;
};
const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};
export default function BandSchedule({
  eventName,
  eventDate,
  bandSchedule,
  isDebugMode = false,
  viewSetting,
  BandScheduleLink,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [virtual, setVirtual] = useState("");
  const [showAll, setShowAll] = useState(viewSetting === "open");
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const instant = isDebugMode && virtual ? new Date(virtual + ":00+09:00") : now;
  const jst = instant ? new Date(instant.getTime() + 9 * 3600000) : null;
  const date = jst?.toISOString().slice(0, 10);
  const time = jst ? jst.toISOString().slice(11, 16) : "";
  const currentIndex =
    date === eventDate
      ? bandSchedule.findIndex(
          (band) => band.date === date && time >= band.start && time < band.end
        )
      : -1;
  const nextIndex =
    date === eventDate
      ? bandSchedule.findIndex((band) => band.date === date && time < band.start)
      : -1;
  const anchor = currentIndex >= 0 ? currentIndex : Math.max(0, nextIndex);
  const visible = showAll ? bandSchedule : bandSchedule.slice(Math.max(0, anchor - 1), anchor + 4);
  const ended = date
    ? date > eventDate || (date === eventDate && time >= (bandSchedule.at(-1)?.end ?? "23:59"))
    : false;
  return (
    <section className="schedule-section mb-12 border-b border-[#d7dcd7] pb-10">
      <h2 className="mb-4 text-2xl font-bold">
        {eventName}
        <br />
        タイムスケジュール
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        {eventDate} / 時刻は日本時間です。
        {ended
          ? " このイベントは終了しました。"
          : currentIndex >= 0
            ? " 現在演奏中：" + bandSchedule[currentIndex].name
            : nextIndex >= 0
              ? " 次の出演：" + bandSchedule[nextIndex].name
              : ""}
      </p>
      {isDebugMode && (
        <details className="mb-5">
          <summary className="cursor-pointer text-xs text-slate-500">開発用：日時の確認</summary>
          <label className="mt-3 block text-sm">
            仮想日時（日本時間）
            <input
              type="datetime-local"
              value={virtual}
              onChange={(event) => setVirtual(event.target.value)}
              className="ml-3 border border-slate-300 p-2"
            />
          </label>
        </details>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{eventName}の出演順と演奏時間</caption>
          <thead>
            <tr className="border-y border-slate-300">
              <th scope="col" className="py-3 pr-4">
                出演バンド
              </th>
              <th scope="col" className="py-3 pr-4">
                開始
              </th>
              <th scope="col" className="py-3">
                終了
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((band) => {
              const index = bandSchedule.indexOf(band);
              const previous = bandSchedule[index - 1];
              const gap =
                previous &&
                previous.date === band.date &&
                minutes(band.start) > minutes(previous.end);
              const current = index === currentIndex;
              return (
                <Fragment key={band.date + band.start + band.name}>
                  {gap && (
                    <tr className="bg-[#edf0e9]">
                      <td colSpan={3} className="px-3 py-2 text-xs text-slate-600">
                        転換・休憩 {previous.end} – {band.start}
                      </td>
                    </tr>
                  )}
                  <tr
                    className={
                      current
                        ? "border-b border-slate-200 bg-[#d4ec76]"
                        : "border-b border-slate-200"
                    }
                  >
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {band.name}
                      {current && <span className="ml-2 text-xs">演奏中</span>}
                    </th>
                    <td className="whitespace-nowrap py-4 pr-4">{band.start}</td>
                    <td className="whitespace-nowrap py-4">{band.end}</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap gap-6">
        {viewSetting !== "open" && bandSchedule.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-link"
            aria-expanded={showAll}
          >
            {showAll ? "一部だけ表示 −" : "すべての出演を表示 ＋"}
          </button>
        )}
        {BandScheduleLink && (
          <Link className="text-link" href={BandScheduleLink}>
            詳細スケジュールへ ↗
          </Link>
        )}
      </div>
    </section>
  );
}
