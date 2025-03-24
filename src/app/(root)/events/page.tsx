"use client";
import React, { useState, useEffect } from "react";
import { events, getAllTags } from "@/app/data/events";
import EventCard from "./Components/EventCard";
import { motion } from "framer-motion";
import FilterBar from "./Components/FilterBar";
import FloatingButton from "./Components/FloatingButton";

const EventsPage = () => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [activeTag, setActiveTag] = useState("all");
  const [scrolled, setScrolled] = useState(false);

  // 全タグを取得
  const allTags = getAllTags();

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // タグフィルタリング処理
  const filterEventsByTag = (tag: string) => {
    setActiveTag(tag);

    if (tag === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.tags.includes(tag)));
    }
  };

  // アニメーションのバリアント
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`sticky top-0 z-10 transition-all duration-300 ${
            scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-3" : "py-6"
          }`}
        >
          <h1
            className={`text-3xl font-bold text-center text-black mb-4 transition-all duration-300 ${
              scrolled ? "text-2xl" : "text-3xl"
            }`}
          >
            イベント情報
          </h1>

          {/* タグフィルターバー */}
          <FilterBar tags={allTags} activeTag={activeTag} onTagChange={filterEventsByTag} />
        </motion.div>

        <motion.div
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
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
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
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
