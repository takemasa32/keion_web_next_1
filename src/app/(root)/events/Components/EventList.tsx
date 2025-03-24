"use client";
import React, { useState } from "react";
import { events as tempEvents } from "@/app/data/events";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

interface Event {
  title: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
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
  const [filter, setFilter] = useState("all");
  const viewEvents = events || tempEvents;

  const filteredEvents =
    filter === "all"
      ? viewEvents
      : filter === "upcoming"
      ? viewEvents.filter((event) => new Date(event.date) >= new Date())
      : viewEvents.filter((event) => new Date(event.date) < new Date());

  return (
    <motion.div
      className="mt-8 sm:mt-12 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
        {title}
      </h1>

      {showFilter && (
        <div className="flex justify-center mb-6 pb-2 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto py-1 no-scrollbar">
            {["all", "upcoming", "past"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === option
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option === "all"
                  ? "すべて"
                  : option === "upcoming"
                  ? "今後のイベント"
                  : "過去のイベント"}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">イベントが見つかりません</p>
        </div>
      )}
    </motion.div>
  );
};

export default EventList;
