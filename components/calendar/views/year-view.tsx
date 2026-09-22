"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useCalendar } from "../calendar-provider";
import type { CalendarEvent } from "../calendar-types";
import {
  dayKey,
  format,
  groupEventsByDay,
  isSameDay,
  isSameMonth,
  monthDays,
  WEEKDAY_LABELS_NARROW,
} from "../calendar-utils";
import { dotClasses } from "../shared/event-styles";

const NO_EVENTS: CalendarEvent[] = [];

export function YearView() {
  const { date, events, openDayEvents } = useCalendar();
  const year = date.getFullYear();
  const today = new Date();

  const eventsByDay = React.useMemo(
    () =>
      groupEventsByDay(events, new Date(year, 0, 1), new Date(year, 11, 31)),
    [events, year],
  );

  const select = (day: Date) => {
    openDayEvents(day);
  };

  return (
    <div data-slot="year-view" className="flex min-h-0 flex-1 flex-col">
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }, (_, month) => (
            <YearMonthCard
              key={month}
              year={year}
              month={month}
              today={today}
              eventsByDay={eventsByDay}
              onSelect={select}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function YearMonthCard({
  year,
  month,
  today,
  eventsByDay,
  onSelect,
}: {
  year: number;
  month: number;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onSelect: (day: Date) => void;
}) {
  const first = new Date(year, month, 1);
  const days = monthDays(first);

  return (
    <div className="rounded-lg border bg-card p-3">
      <h3 className="mb-2 text-center text-sm font-semibold">
        {format(first, "LLLL")}
      </h3>

      <div className="mx-auto w-fit">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS_NARROW.map((d) => (
            <div
              key={d}
              className="flex size-9 items-center justify-center py-1 text-center text-[10px] font-normal text-muted-foreground/70"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => (
            <YearDayCell
              key={day.toISOString()}
              day={day}
              inMonth={isSameMonth(day, first)}
              today={today}
              events={
                isSameMonth(day, first)
                  ? (eventsByDay.get(dayKey(day)) ?? NO_EVENTS)
                  : NO_EVENTS
              }
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function YearDayCell({
  day,
  inMonth,
  today,
  events,
  onSelect,
}: {
  day: Date;
  inMonth: boolean;
  today: Date;
  events: CalendarEvent[];
  onSelect: (day: Date) => void;
}) {
  const label = format(day, "MMMM d, yyyy");

  if (!inMonth) {
    return (
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="none"
          size="none"
          disabled
          tabIndex={-1}
          aria-label={label}
          className="flex size-9 cursor-default select-none flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] opacity-25"
        >
          <span>{format(day, "d")}</span>
          <span className="min-h-2" />
        </Button>
      </div>
    );
  }

  const count = events.length;

  return (
    <div className="flex flex-col items-center">
      <Button
        type="button"
        variant="none"
        size="none"
        tabIndex={0}
        onClick={() => onSelect(day)}
        aria-label={
          count ? `${label}, ${count} event${count === 1 ? "" : "s"}` : label
        }
        className={cn(
          "flex size-9 cursor-pointer select-none flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] transition",
          isSameDay(day, today)
            ? "bg-primary font-semibold text-primary-foreground"
            : "hover:bg-primary/10 dark:hover:bg-primary/20",
        )}
      >
        <span>{format(day, "d")}</span>

        <span aria-hidden className="flex min-h-2 items-center gap-px">
          {events.slice(0, 2).map((e) => (
            <span
              key={e.id}
              className={cn(
                "size-1 shrink-0 rounded-full",
                dotClasses[e.color],
              )}
            />
          ))}
          {count > 2 && (
            <span className="text-[8px] font-medium leading-none">
              +{count - 2}
            </span>
          )}
        </span>
      </Button>
    </div>
  );
}
