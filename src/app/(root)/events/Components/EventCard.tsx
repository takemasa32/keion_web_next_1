"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

interface EventCardProps {
  event: {
    title: string;
    date: string;
    description: string;
    image?: string;
    link?: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/image/keionMiniLogo.JPG"; // デフォルトのロゴ画像のパス
  };

  const imageClass = event.link ? "object-cover" : "object-cover filter grayscale";

  const cardContent = (
    <div
      className={`relative bg-gray-100 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform ${
        event.link ? "hover:scale-105 hover:bg-gray-200" : "scale-90"
      }`}
    >
      <Image
        src={event.image || "/image/keionMiniLogo.JPG"}
        alt={event.title}
        width={500}
        height={300}
        className={`w-full h-48 ${imageClass}`}
        onError={handleImageError}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-4">{event.date}</p>
        <p className="text-gray-700">{event.description}</p>
      </div>
      {event.link && (
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
          <FaExternalLinkAlt className="text-gray-800" />
        </div>
      )}
    </div>
  );

  return event.link ? <Link href={event.link}>{cardContent}</Link> : <div>{cardContent}</div>;
};

export default EventCard;
