import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { CalendarEvent, CalendarView } from "./calendar-types";

export const HOUR_HEIGHT = 64;
export const QUARTER_HEIGHT = HOUR_HEIGHT / 4;

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_LABELS_NARROW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function monthDays(date: Date) {
  const s = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const e = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  const out: Date[] = [];

  for (let d = s; d <= e; d = addDays(d, 1)) out.push(d);

  return out;
}

export function weekDays(date: Date) {
  const s = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(s, i));
}

export function navigate(date: Date, view: CalendarView, dir: -1 | 1) {
  if (view === "month") return addMonths(date, dir);
  if (view === "week") return addWeeks(date, dir);
  if (view === "day") return addDays(date, dir);
  if (view === "year") return addYears(date, dir);
  return addMonths(date, dir);
}

export function viewTitle(date: Date, view: CalendarView) {
  if (view === "agenda")
    return `${format(date, "MMM")} - ${format(addMonths(date, 1), "MMM yyyy")}`;
  if (view === "day") return format(date, "EEE MMMM d, yyyy");
  if (view === "year") return format(date, "yyyy");
  return format(date, "MMMM yyyy");
}

export function minutesFromMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

export function timedStyle(e: CalendarEvent) {
  const top = (minutesFromMidnight(e.start) / 60) * HOUR_HEIGHT;
  const height = Math.max(
    16,
    ((e.end.getTime() - e.start.getTime()) / 3600000) * HOUR_HEIGHT,
  );

  return { top, height };
}

export function eventTouchesDay(e: CalendarEvent, d: Date) {
  return (
    d >=
      new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate()) &&
    d <= new Date(e.end.getFullYear(), e.end.getMonth(), e.end.getDate())
  );
}

export function segmentKind(e: CalendarEvent, d: Date) {
  const span = differenceInCalendarDays(e.end, e.start);

  if (span <= 0) return "single";
  if (isSameDay(d, e.start)) return "start";
  if (isSameDay(d, e.end)) return "end";
  return "middle";
}

export function dayEvents(events: CalendarEvent[], d: Date) {
  return events.filter((e) => eventTouchesDay(e, d));
}

export function dayKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function groupEventsByDay(
  events: CalendarEvent[],
  from: Date,
  to: Date,
) {
  const map = new Map<string, CalendarEvent[]>();
  const rangeStart = startOfDay(from);
  const rangeEnd = startOfDay(to);

  for (const e of events) {
    const start =
      startOfDay(e.start) < rangeStart ? rangeStart : startOfDay(e.start);
    const end = startOfDay(e.end) > rangeEnd ? rangeEnd : startOfDay(e.end);

    for (let d = start; d <= end; d = addDays(d, 1)) {
      const key = dayKey(d);
      const list = map.get(key);
      if (list) list.push(e);
      else map.set(key, [e]);
    }
  }

  return map;
}

export function eventTimeLabel(e: CalendarEvent) {
  return e.allDay
    ? "All day"
    : `${format(e.start, "h:mma").toLowerCase()} - ${format(e.end, "h:mma").toLowerCase()}`;
}

export function eventAriaLabel(e: CalendarEvent) {
  return e.allDay
    ? `${e.title}, all day`
    : `${e.title}, ${format(e.start, "h:mm a")} to ${format(e.end, "h:mm a")}`;
}

export function setTimeOfDay(d: Date, minutes: number) {
  const out = new Date(d);
  out.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return out;
}

export function withTime(d: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  return setTimeOfDay(d, h * 60 + m);
}

export { format, isSameDay, isSameMonth };
