"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Event } from "@/app/data/events";
export default function EventCard({ event }: { event: Event; index?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="event-card">
      <div className="event-card-image">
        <Image
          src={failed ? "/icons/icon-512x512.png" : (event.image ?? "/icons/icon-512x512.png")}
          alt={event.title}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 33vw"
          onError={() => setFailed(true)}
        />
      </div>
      <span className="event-card-date">{event.date}</span>
      <h2>{event.link ? <Link href={event.link}>{event.title}</Link> : event.title}</h2>
      <p>{event.description}</p>
      <div className="event-tags">
        {event.tags
          .filter((tag) => tag !== "詳細あり")
          .map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
      </div>
      {event.link && (
        <Link className="text-link" href={event.link} aria-label={event.title + "の詳細を見る"}>
          詳細を見る ↗
        </Link>
      )}
    </article>
  );
}
