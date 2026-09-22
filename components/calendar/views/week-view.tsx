"use client";

import { useCalendar } from "../calendar-provider";
import { dayEvents, format, weekDays } from "../calendar-utils";
import { CompactEvent, PositionedTimedEvent } from "../shared/calendar-event";
import { DayTimeColumn, TimeGutter } from "../shared/time-grid";

export function WeekView() {
  const { date, events } = useCalendar();
  const days = weekDays(date);

  return (
    <div data-slot="week-view" className="flex h-full flex-col">
      <div className="sticky top-0 z-30 grid grid-cols-8 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="py-2 text-center text-sm text-muted-foreground/70">
          <span className="max-[479px]:sr-only">GMT+7</span>
        </div>

        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="py-2 text-center text-sm text-muted-foreground/70"
          >
            <span className="sm:hidden">{format(d, "EEEEE d")}</span>
            <span className="max-sm:hidden">{format(d, "EEE d")}</span>
          </div>
        ))}
      </div>

      <div className="border-b border-border/70 bg-muted/50">
        <div className="grid grid-cols-8">
          <div className="relative border-r border-border/70">
            <span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
              All day
            </span>
          </div>

          {days.map((d) => (
            <div
              key={d.toISOString()}
              className="relative border-r border-border/70 p-1 last:border-r-0"
            >
              {dayEvents(events, d)
                .filter((e) => e.allDay)
                .map((e) => (
                  <CompactEvent key={e.id} event={e} day={d} />
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-8 overflow-hidden">
        <div className="border-r border-border/70">
          <TimeGutter />
        </div>

        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="relative border-r border-border/70 last:border-r-0"
          >
            <DayTimeColumn date={d} />

            {dayEvents(events, d)
              .filter((e) => !e.allDay)
              .map((e) => (
                <PositionedTimedEvent key={e.id} event={e} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
