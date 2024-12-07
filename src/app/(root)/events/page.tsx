"use client";
import React from "react";
import { events } from "@/app/data/events";
import EventCard from "./Components/EventCard";

const EventsPage = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-black mb-8">イベント情報</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
