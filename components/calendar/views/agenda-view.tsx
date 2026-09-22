"use client";

import { addDays } from "date-fns";

import { useCalendar } from "../core/calendar-provider";
import { dayEvents, format } from "../core/calendar-utils";
import { AgendaEvent } from "../shared/calendar-event";

export function AgendaView() {
  const { date, events } = useCalendar();
  const days = Array.from({ length: 45 }, (_, i) => addDays(date, i));

  return (
    <div className="border-t border-border/70 px-4">
      {days.map((d) => {
        const list = dayEvents(events, d);
        if (!list.length) return null;

        return (
          <div
            key={d.toISOString()}
            className="relative my-12 border-t border-border/70"
          >
            <span className="absolute -top-3 left-0 flex h-6 items-center bg-background pe-4 text-xs uppercase">
              {format(d, "d MMM, EEEE")}
            </span>

            <div className="mt-6 space-y-2">
              {list.map((e) => (
                <AgendaEvent key={e.id} event={e} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
