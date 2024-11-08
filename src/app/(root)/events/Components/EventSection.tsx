import React from "react";

interface EventSectionProps {
  title: string;
  dates: string[];
  location: string;
  description: string;
  mapSrc: string;
}

const EventSection: React.FC<EventSectionProps> = ({
  title,
  dates,
  location,
  description,
  mapSrc,
}) => {
  return (
    <div className="mb-12 sm:mb-16 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8 break-words">
        {title}
      </h2>
      <ul className="text-base  sm:text-lg text-gray-700 mb-4 list-disc list-inside break-words">
        <div>
          <li>日時：⏱{dates.join(" / ")}</li>
          <li>場所：{location}</li>
        </div>
      </ul>
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
          <iframe
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="w-full lg:w-1/2 lg:pl-4">
          <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">{description}</p>
          <p className="text-base sm:text-lg text-gray-700 mb-4 break-words">
            📍{location}
            <br />⏱{dates.join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventSection;
