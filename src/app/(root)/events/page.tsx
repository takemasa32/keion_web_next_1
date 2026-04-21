"use client";
import React, { useMemo, useState } from "react";
import { events, getAllTags } from "@/app/data/events";
import EventCard from "./Components/EventCard";
import { motion } from "framer-motion";
import FilterBar from "./Components/FilterBar";
import FloatingButton from "./Components/FloatingButton";

const EventsPage = () => {
  const [activeTag, setActiveTag] = useState("all");

  // 全タグを取得
  const allTags = getAllTags();
  const filteredEvents = useMemo(
    () => (activeTag === "all" ? events : events.filter((event) => event.tags.includes(activeTag))),
    [activeTag]
  );

  // タグフィルタリング処理
  const filterEventsByTag = (tag: string) => {
    setActiveTag(tag);
  };

  // アニメーションのバリアント
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-6 sm:pt-8 lg:pt-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-indigo-500">
            Live Schedule
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            イベント情報
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            新歓ライブ、大学祭、定期演奏会など、島根大学軽音楽部の活動予定と記録をまとめています。
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-16 z-30 mt-8 border-y border-slate-200/80 bg-slate-50/95 py-3 backdrop-blur-md md:top-20"
        >
          {/* タグフィルターバー */}
          <FilterBar tags={allTags} activeTag={activeTag} onTagChange={filterEventsByTag} />
        </motion.div>

        <motion.div
          key={activeTag}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredEvents.map((event, index) => (
            <EventCard key={`${event.title}-${event.date}`} event={event} index={index} />
          ))}
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-xl">「{activeTag}」のイベントはありません</p>
            <button
              onClick={() => filterEventsByTag("all")}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-700"
            >
              すべてのイベントを表示
            </button>
          </motion.div>
        )}
      </div>

      {/* スクロールトップボタン */}
      <FloatingButton />
    </div>
  );
};

export default EventsPage;
