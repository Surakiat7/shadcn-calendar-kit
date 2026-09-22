"use client";

import { Droppable } from "./droppable";
import { HOUR_HEIGHT } from "../calendar-utils";

export function TimeGutter() {
  return (
    <div>
      {Array.from({ length: 24 }, (_, h) => (
        <div
          key={h}
          className="relative border-b border-border/70"
          style={{ height: HOUR_HEIGHT }}
        >
          {h > 0 && (
            <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
              {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function DayTimeColumn({ date }: { date: Date }) {
  return (
    <div className="relative">
      {Array.from({ length: 24 }, (_, h) => (
        <div
          key={h}
          className="relative border-b border-border/70"
          style={{ height: HOUR_HEIGHT }}
        >
          {[0, 15, 30, 45].map((m) => (
            <Droppable
              key={m}
              id={`${date.toDateString()}-${h}:${m}`}
              date={date}
              minutes={h * 60 + m}
              className="absolute w-full"
            >
              <div
                style={{
                  height: HOUR_HEIGHT / 4,
                  marginTop: ((m / 15) * HOUR_HEIGHT) / 4,
                }}
              />
            </Droppable>
          ))}
        </div>
      ))}
    </div>
  );
}
