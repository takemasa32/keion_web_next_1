import React from "react";
import { events as tempEvents } from "@/app/data/events";
import EventCard from "./EventCard";

interface Event {
  title: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
}

interface EventListProps {
  events?: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const viewEvents = events || tempEvents;
  return (
    <div className="mt-8 sm:mt-12 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
        イベント情報 一覧
      </h1>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {viewEvents.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
