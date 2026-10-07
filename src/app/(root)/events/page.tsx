"use client";
import { useEffect, useMemo, useState } from "react";
import { events, getAllTags } from "@/app/data/events";
import { isUpcoming, japanToday, sortEvents } from "@/app/lib/event-dates";
import EventCard from "./Components/EventCard";
import FilterBar from "./Components/FilterBar";
export default function EventsPage() {
  const [tag, setTag] = useState("all");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [period, setPeriod] = useState("all");
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(japanToday());
  }, []);
  const years = Array.from(
    new Set(events.map((event) => event.date.match(/\d{4}/)?.[0]).filter(Boolean))
  )
    .sort()
    .reverse();
  const filtered = useMemo(
    () =>
      sortEvents(events).filter(
        (event) =>
          (tag === "all" ||
            (tag === "詳細あり" ? Boolean(event.link) : event.tags.includes(tag))) &&
          (year === "all" || event.date.startsWith(year)) &&
          (period === "all" ||
            (today &&
              (period === "upcoming" ? isUpcoming(event, today) : !isUpcoming(event, today)))) &&
          (event.title + event.description + event.tags.join(" "))
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      ),
    [tag, query, year, period, today]
  );
  const reset = () => {
    setTag("all");
    setQuery("");
    setYear("all");
    setPeriod("all");
  };
  return (
    <div>
      <section className="page-intro site-container">
        <p className="eyebrow">EVENTS & ARCHIVE</p>
        <h1>イベント情報</h1>
        <p>
          新歓ライブ、大学祭、定期演奏会。
          <br />
          島根大学軽音楽部の活動予定と、これまでの記録です。
        </p>
      </section>
      <div className="site-container">
        <div className="event-controls">
          <label>
            キーワード
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="イベント名・ジャンルなど"
            />
          </label>
          <label>
            開催年
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">すべての年</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}年
                </option>
              ))}
            </select>
          </label>
          <label>
            開催状況
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option value="all">すべて</option>
              <option value="upcoming">これから開催</option>
              <option value="past">過去の記録</option>
            </select>
          </label>
        </div>
        <FilterBar tags={getAllTags()} activeTag={tag} onTagChange={setTag} />
        <div className="result-line">
          <p role="status" aria-live="polite">
            {filtered.length}件のイベント
          </p>
          <button onClick={reset}>条件をリセット</button>
        </div>
        {filtered.length ? (
          <div className="events-grid">
            {filtered.map((event) => (
              <EventCard key={event.title + event.date} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              {period === "upcoming"
                ? "現在、掲載されている今後のイベントはありません。最新の日程は公式SNSをご確認ください。"
                : "条件に合うイベントがありません。"}
            </p>
            <button className="button button-lime" onClick={reset}>
              すべてのイベントを表示
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
