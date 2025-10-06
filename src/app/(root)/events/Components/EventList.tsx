"use client";
import React, { useState, useEffect } from "react";
import { events as tempEvents } from "@/app/data/events";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

interface Event {
  title: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
  tags: string[];
}

interface EventListProps {
  events?: Event[];
  title?: string;
  showFilter?: boolean;
}

const EventList: React.FC<EventListProps> = ({
  events,
  title = "イベント情報 一覧",
  showFilter = false,
}) => {
  const [activeTag, setActiveTag] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const viewEvents = events || tempEvents;

  // 利用可能なタグの抽出
  const availableTags = React.useMemo(() => {
    const tags = new Set<string>();
    viewEvents.forEach((event) => {
      event.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [viewEvents]);

  // 初回レンダリング時と events 変更時にイベントを設定
  useEffect(() => {
    setFilteredEvents(viewEvents);
  }, [viewEvents]);

  // タグによるフィルタリング
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    if (tag === "all") {
      setFilteredEvents(viewEvents);
    } else {
      setFilteredEvents(viewEvents.filter((event) => event.tags.includes(tag)));
    }
  };

  return (
    <motion.div
      className="mt-8 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:mt-12 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-6 break-words text-center text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">
        {title}
      </h1>

      {showFilter && availableTags.length > 0 && (
        <div className="flex justify-center mb-6 pb-2 border-b border-gray-200">
          <div className="flex flex-wrap justify-center gap-2 py-1">
            <button
              onClick={() => handleTagChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTag === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              すべて
            </button>

            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTag === tag
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">「{activeTag}」のイベントはありません</p>
          <button
            onClick={() => handleTagChange("all")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            すべて表示
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EventList;
