import type { Event } from "../data/events";

// Calendar dates are UTC values: comparisons never depend on the visitor's timezone.
export function parseEventDates(text: string): Date[] {
  let year: number | undefined;
  let month: number | undefined;
  const dates: Date[] = [];
  const pattern = /(?:(\d{4})年)?(\d{1,2})月(?:(\d{1,2})日)?|(\d{4})-(\d{2})-(\d{2})/g;
  for (const match of Array.from(text.matchAll(pattern))) {
    if (match[4]) {
      year = Number(match[4]);
      month = Number(match[5]);
    } else {
      year = match[1] ? Number(match[1]) : year;
      month = Number(match[2]);
    }
    if (!year || !month) continue;
    const day = Number(match[6] ?? match[3] ?? 1);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
      dates.push(date);
  }
  return dates;
}

export function japanToday(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(Date.UTC(value("year"), value("month") - 1, value("day")));
}

export function eventEnd(event: Event): number {
  const dates = parseEventDates(event.date);
  // A month-only entry stays current through the end of that month.
  if (!/日/.test(event.date) && !/\d{4}-\d{2}-\d{2}/.test(event.date) && dates[0]) {
    return Date.UTC(dates[0].getUTCFullYear(), dates[0].getUTCMonth() + 1, 0);
  }
  return Math.max(...dates.map((date) => date.getTime()));
}

export function isUpcoming(event: Event, today = japanToday()): boolean {
  return eventEnd(event) >= today.getTime();
}

export function sortEvents(items: Event[]): Event[] {
  return [...items].sort((a, b) => eventEnd(b) - eventEnd(a));
}
