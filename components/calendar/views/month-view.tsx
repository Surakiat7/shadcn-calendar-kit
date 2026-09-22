"use client";

import { useCalendar } from "../calendar-provider";
import {
  dayEvents,
  format,
  isSameDay,
  isSameMonth,
  monthDays,
  WEEKDAY_LABELS,
} from "../calendar-utils";
import { Button } from "@/components/ui/button";

import { CompactEvent } from "../shared/calendar-event";
import { Droppable } from "../shared/droppable";

export function MonthView() {
  const { date, events, openDayEvents } = useCalendar();
  const days = monthDays(date);
  const today = new Date();

  return (
    <div data-slot="month-view" className="contents">
      <div className="grid grid-cols-7 border-b border-border/70">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-sm text-muted-foreground/70"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid flex-1 auto-rows-fr">
        {Array.from({ length: days.length / 7 }, (_, w) => (
          <div key={w} className="grid grid-cols-7">
            {days.slice(w * 7, w * 7 + 7).map((day) => {
              const list = dayEvents(events, day);

              return (
                <div
                  key={day.toISOString()}
                  data-outside-cell={!isSameMonth(day, date) || undefined}
                  className="group border-b border-r border-border/70 last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70"
                >
                  <Droppable
                    id={`month-${day.toISOString()}`}
                    date={day}
                    className="flex h-full cursor-pointer flex-col overflow-hidden px-0.5 py-1 sm:px-1"
                    onClick={() => openDayEvents(day)}
                  >
                    <div
                      className={
                        isSameDay(day, today)
                          ? "mt-1 inline-flex size-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground"
                          : "mt-1 inline-flex size-6 items-center justify-center text-sm"
                      }
                    >
                      {format(day, "d")}
                    </div>

                    <div className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]">
                      {list.slice(0, 3).map((e) => (
                        <CompactEvent key={e.id} event={e} day={day} />
                      ))}
                      {list.length > 3 && (
                        <Button
                          type="button"
                          variant="none"
                          size="none"
                          className="mt-(--event-gap) h-(--event-height) w-full justify-start px-1 text-left text-[10px] text-muted-foreground hover:bg-muted/50 sm:px-2 sm:text-xs"
                        >
                          + {list.length - 3}{" "}
                          <span className="max-sm:sr-only">more</span>
                        </Button>
                      )}
                    </div>
                  </Droppable>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
