"use client";

import { CalendarProvider } from "./calendar-provider";
import { Calendar } from "./calendar";
import type { CalendarEvent } from "./calendar-types";

const d = (day: number, h = 0, m = 0) => new Date(2026, 8, day, h, m);

const initialEvents: CalendarEvent[] = [
  {
    id: "design-review",
    title: "Design review",
    description: "Walk through the new dashboard flows in Figma.",
    location: "Design Studio",
    start: d(21, 9, 30),
    end: d(21, 10, 30),
    color: "sky",
  },
  {
    id: "one-on-one",
    title: "1:1 with Priya",
    description: "Career growth check-in and quarter goals.",
    location: "Room 4B",
    start: d(21, 14),
    end: d(21, 14, 30),
    color: "violet",
  },
  {
    id: "focus-docs",
    title: "Focus: API migration guide",
    description: "Draft the v2 migration guide for the SDK.",
    start: d(21, 16),
    end: d(21, 18),
    color: "amber",
  },
  {
    id: "standup-22",
    title: "Engineering standup",
    description: "Daily sync on sprint progress.",
    location: "Google Meet",
    start: d(22, 9, 15),
    end: d(22, 9, 30),
    color: "sky",
  },
  {
    id: "sprint-planning",
    title: "Sprint planning",
    description: "Scope and estimate the next two-week sprint.",
    location: "Zoom",
    start: d(22, 10),
    end: d(22, 11, 30),
    color: "emerald",
  },
  {
    id: "client-demo",
    title: "Client demo — Acme",
    description: "Walk Acme through the beta release.",
    location: "Google Meet",
    start: d(23, 13),
    end: d(23, 14),
    color: "rose",
  },
  {
    id: "launch-week",
    title: "Launch week",
    description: "Coordinated product rollout across regions.",
    start: d(24),
    end: d(26, 23, 59),
    allDay: true,
    color: "violet",
  },
  {
    id: "marketing-sync",
    title: "Marketing sync",
    description: "Align launch messaging and press timing.",
    location: "Room 2A",
    start: d(25, 11),
    end: d(25, 12),
    color: "orange",
  },
  {
    id: "team-lunch",
    title: "Team lunch",
    description: "Celebrate the Q3 launch together.",
    location: "Sushi Bar",
    start: d(25, 12, 30),
    end: d(25, 13, 30),
    color: "amber",
  },
  {
    id: "retro",
    title: "Sprint retro",
    description: "What went well, what to improve.",
    location: "Room 4B",
    start: d(26, 15),
    end: d(26, 16),
    color: "sky",
  },
  {
    id: "investor-update",
    title: "Investor update",
    description: "Monthly metrics and roadmap review.",
    location: "Boardroom",
    start: d(28, 15),
    end: d(28, 16),
    color: "emerald",
  },
  {
    id: "onboarding",
    title: "New hire onboarding",
    description: "Welcome session for the engineering cohort.",
    location: "Auditorium",
    start: d(29, 9),
    end: d(29, 10),
    color: "rose",
  },
  {
    id: "q4-planning",
    title: "Q4 planning offsite",
    description: "Set objectives and key results for Q4.",
    location: "Riverside Offsite",
    start: d(30, 10),
    end: d(30, 15),
    color: "violet",
  },
];

export function CalendarDemo() {
  return (
    <CalendarProvider initialEvents={initialEvents}>
      <Calendar />
    </CalendarProvider>
  );
}
