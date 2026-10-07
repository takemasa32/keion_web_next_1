import Link from "next/link";
import { events as allEvents, type Event } from "@/app/data/events";
import { sortEvents } from "@/app/lib/event-dates";
import EventCard from "./EventCard";
export default function EventList({
  events = allEvents,
  title = "ほかのイベント",
  showFilter = false,
}: {
  events?: Event[];
  title?: string;
  showFilter?: boolean;
}) {
  return (
    <section className="related-events">
      <div className="archive-heading">
        <h2>{title}</h2>
        <Link className="text-link" href="/events">
          {showFilter ? "一覧・絞り込み" : "すべて見る"} ↗
        </Link>
      </div>
      <div className="events-grid">
        {sortEvents(events)
          .slice(0, 3)
          .map((event) => (
            <EventCard key={event.title + event.date} event={event} />
          ))}
      </div>
    </section>
  );
}
