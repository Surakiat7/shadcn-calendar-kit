"use client";

import { CalendarProvider } from "./calendar-provider";
import { Calendar } from "./calendar";
import type { CalendarEvent } from "./calendar-types";

const d = (day: number, h = 0, m = 0) => new Date(2026, 8, day, h, m);

const initialEvents: CalendarEvent[] = [
  {
    id: "team-21",
    title: "Team Meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
    start: d(21, 10),
    end: d(21, 11),
    color: "sky",
  },
  {
    id: "lunch-22",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    location: "Downtown Cafe",
    start: d(22, 12),
    end: d(22, 13, 15),
    color: "emerald",
  },
  {
    id: "launch",
    title: "Product Launch",
    description: "New product release",
    start: d(24),
    end: d(27, 23, 59),
    allDay: true,
    color: "violet",
  },
  {
    id: "sales",
    title: "Sales Conference",
    description: "Discuss about new clients",
    location: "Downtown Cafe",
    start: d(25, 14, 30),
    end: d(26, 14, 45),
    color: "rose",
  },
  {
    id: "team-26a",
    title: "Team Meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
    start: d(26, 9),
    end: d(26, 10, 30),
    color: "orange",
  },
  {
    id: "team-26b",
    title: "Team Meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
    start: d(26, 9, 45),
    end: d(26, 11),
    color: "amber",
  },
  {
    id: "review-26",
    title: "Review contracts",
    description: "Weekly team sync",
    location: "Conference Room A",
    start: d(26, 14),
    end: d(26, 15, 30),
    color: "sky",
  },
  {
    id: "strategy",
    title: "Marketing Strategy Session",
    description: "Quarterly marketing planning",
    location: "Marketing Department",
    start: d(30, 10),
    end: d(30, 15, 30),
    color: "emerald",
  },
];

export function CalendarDemo() {
  return (
    <CalendarProvider initialEvents={initialEvents}>
      <Calendar />
    </CalendarProvider>
  );
}
