"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface EventSectionProps {
  title: string;
  dates: string[];
  location: string;
  description: string;
  mapSrc: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

const EventSection: React.FC<EventSectionProps> = ({
  title,
  dates,
  location,
  description,
  mapSrc,
  onButtonClick,
  buttonText,
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 改行を保持してHTMLを生成
  const formattedDescription = description.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <motion.div
      className="mb-12 sm:mb-16 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
        {title}
      </h2>

      <div className="space-y-6">
        {/* イベント詳細 */}
        <motion.div
          className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col w-full sm:w-1/2 space-y-4">
            {/* 日時情報 */}
            <div className="flex items-start">
              <FaClock className="text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700">日時</h3>
                <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                  {dates.map((date, index) => (
                    <li key={index} className="pl-1">
                      {date}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 場所情報 */}
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700">場所</h3>
                <p className="text-gray-600 mt-1">{location}</p>
              </div>
            </div>

            {/* 説明文 */}
            <div className="text-gray-700 mt-4 sm:mt-0">{formattedDescription}</div>
          </div>

          {/* Google Map */}
          <div className="relative w-full sm:w-1/2 aspect-video sm:aspect-square">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                <div className="w-10 h-10 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
              </div>
            )}
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              className={`shadow-md transition-opacity duration-300 ${
                isMapLoaded ? "opacity-100" : "opacity-0"
              }`}
            ></iframe>
          </div>
        </motion.div>

        {/* CTAボタン */}
        {onButtonClick && buttonText && (
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={onButtonClick}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {buttonText}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventSection;
