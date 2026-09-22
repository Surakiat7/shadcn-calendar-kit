"use client";

import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useCalendar } from "../core/calendar-provider";
import type { CalendarEvent } from "../core/calendar-types";
import { colorClasses } from "./event-styles";
import {
  eventAriaLabel,
  eventTimeLabel,
  format,
  segmentKind,
  timedStyle,
} from "../core/calendar-utils";

export function CompactEvent({
  event,
  day,
}: {
  event: CalendarEvent;
  day: Date;
}) {
  const { openDetails } = useCalendar();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id + ":" + day.toISOString(),
    data: { event },
  });
  const k = segmentKind(event, day);

  return (
    <Button
      ref={setNodeRef}
      type="button"
      variant="none"
      size="none"
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        openDetails(event);
      }}
      aria-label={eventAriaLabel(event)}
      className={cn(
        "mt-(--event-gap) flex h-(--event-height) size-full touch-none items-center justify-start overflow-hidden px-1 text-left text-xs font-medium backdrop-blur-md transition sm:px-2",
        colorClasses[event.color],
        k === "single" && "rounded",
        k === "start" && "rounded-l rounded-r-none",
        k === "middle" && "rounded-none",
        k === "end" && "rounded-r rounded-l-none",
        isDragging && "cursor-grabbing shadow-lg",
      )}
    >
      <span
        className={cn(
          "truncate",
          k === "middle" || k === "end" ? "invisible" : "",
        )}
      >
        {!event.allDay && (
          <span className="font-normal opacity-70">
            {format(event.start, "ha").toLowerCase()}{" "}
          </span>
        )}
        {event.title}
      </span>
    </Button>
  );
}

export function TimedEvent({ event }: { event: CalendarEvent }) {
  const { openDetails } = useCalendar();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  });

  return (
    <Button
      ref={setNodeRef}
      type="button"
      variant="none"
      size="none"
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        openDetails(event);
      }}
      aria-label={eventAriaLabel(event)}
      className={cn(
        "flex size-full touch-none flex-col items-stretch justify-start overflow-hidden rounded px-1 py-1 text-left text-xs font-medium backdrop-blur-md sm:px-2",
        colorClasses[event.color],
        isDragging && "cursor-grabbing shadow-lg",
      )}
    >
      <div className="truncate">{event.title}</div>
      <div className="truncate font-normal opacity-70">
        {format(event.start, "ha").toLowerCase()} -{" "}
        {format(event.end, "ha").toLowerCase()}
      </div>
    </Button>
  );
}

export function PositionedTimedEvent({ event }: { event: CalendarEvent }) {
  const s = timedStyle(event);

  return (
    <div
      className="absolute z-10 px-0.5"
      style={{ top: s.top, height: s.height, left: 0, right: 0 }}
    >
      <TimedEvent event={event} />
    </div>
  );
}

export function AgendaEvent({ event }: { event: CalendarEvent }) {
  const { openDetails } = useCalendar();

  return (
    <Button
      type="button"
      variant="none"
      size="none"
      onClick={() => openDetails(event)}
      aria-label={eventAriaLabel(event)}
      className={cn(
        "flex w-full flex-col items-stretch justify-start gap-1 rounded p-2 text-left transition",
        colorClasses[event.color],
      )}
    >
      <div className="text-sm font-medium">{event.title}</div>

      <div className="text-xs opacity-70">
        {eventTimeLabel(event)}
        {event.location && (
          <>
            {" "}
            <span className="px-1 opacity-35">·</span>
            {event.location}
          </>
        )}
      </div>

      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </Button>
  );
}
