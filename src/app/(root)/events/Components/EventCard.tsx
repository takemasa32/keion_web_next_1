"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface EventCardProps {
  event: {
    title: string;
    date: string;
    description: string;
    image?: string;
    link?: string;
  };
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // 画像の読み込みエラー処理
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/image/keionMiniLogo.JPG";
  };

  // 日付の整形
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    };
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ja-JP", options);
    } catch (e) {
      return dateString;
    }
  };

  // カードアニメーション
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // カードごとに時間差表示
      },
    },
  };

  // イベントが終了しているか判定
  const isEventPassed = () => {
    try {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate < today;
    } catch {
      return false;
    }
  };

  const isPastEvent = isEventPassed();
  const imageClass = isPastEvent ? "grayscale" : "";

  const cardContent = (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-all duration-300 ${
        event.link ? "hover:shadow-xl" : ""
      }`}
      whileHover={event.link ? { scale: 1.02 } : {}}
      whileTap={event.link ? { scale: 0.98 } : {}}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={event.image || "/image/keionMiniLogo.JPG"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`w-full h-full object-cover transition-all duration-500 ${imageClass} ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoadingComplete={() => setIsLoading(false)}
        />
        {isPastEvent && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
            終了
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaCalendarAlt className="mr-2" />
          <time dateTime={event.date}>{formatDate(event.date)}</time>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        {event.link && (
          <div className="absolute bottom-4 right-4">
            <motion.div
              className="p-2 rounded-full bg-indigo-100 text-indigo-600"
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <FaExternalLinkAlt />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return event.link ? (
    <Link href={event.link} className="block h-full">
      {cardContent}
    </Link>
  ) : (
    <div className="opacity-75">{cardContent}</div>
  );
};

export default EventCard;
