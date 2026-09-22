"use client";

import { useCalendar } from "../calendar-provider";
import { dayEvents } from "../calendar-utils";
import { PositionedTimedEvent } from "../shared/calendar-event";
import { DayTimeColumn, TimeGutter } from "../shared/time-grid";

export function DayView() {
  const { date, events } = useCalendar();
  const timed = dayEvents(events, date).filter((e) => !e.allDay);

  return (
    <div
      data-slot="day-view"
      className="grid flex-1 grid-cols-[3rem_1fr] overflow-hidden border-t border-border/70 sm:grid-cols-[4rem_1fr]"
    >
      <TimeGutter />

      <div className="relative">
        <DayTimeColumn date={date} />

        {timed.map((e) => (
          <PositionedTimedEvent key={e.id} event={e} />
        ))}

        <CurrentTimeLine />
      </div>
    </div>
  );
}

function CurrentTimeLine() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-20"
      style={{ top: "70.4%" }}
    >
      <div className="relative flex items-center">
        <div className="absolute -left-1 h-2 w-2 rounded-full bg-primary" />
        <div className="h-0.5 w-full bg-primary" />
      </div>
    </div>
  );
}
