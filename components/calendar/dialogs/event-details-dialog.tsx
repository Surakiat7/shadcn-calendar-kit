"use client";

import * as React from "react";
import {
  AlignLeft,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCalendar } from "../core/calendar-provider";
import type { CalendarEvent } from "../core/calendar-types";
import { format, isSameDay } from "../core/calendar-utils";
import { dotClasses } from "../shared/event-styles";

function dateLabel(event: CalendarEvent) {
  if (isSameDay(event.start, event.end)) {
    return format(event.start, "EEEE, MMMM d, yyyy");
  }
  return `${format(event.start, "MMM d")} – ${format(event.end, "MMM d, yyyy")}`;
}

function timeLabel(event: CalendarEvent) {
  if (event.allDay) return "All day";
  return `${format(event.start, "h:mm a")} – ${format(event.end, "h:mm a")}`;
}

function DetailRow({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function EventDetailsDialog() {
  const { detailsOpen, detailEvent, closeDetails, openEditor, deleteEvent } =
    useCalendar();

  return (
    <Dialog
      open={detailsOpen}
      onOpenChange={(open) => {
        if (!open) closeDetails();
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/40 backdrop-blur-[3px]"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-3xl bg-popover p-0 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 dark:ring-foreground/10 sm:max-w-[420px] sm:rounded-3xl"
      >
        {detailEvent && (
          <EventDetailsBody
            event={detailEvent}
            onEdit={() => {
              closeDetails();
              openEditor(detailEvent);
            }}
            onDelete={() => deleteEvent(detailEvent.id)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventDetailsBody({
  event,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="flex items-start gap-3 px-5 pt-5">
        <span
          aria-hidden="true"
          className={cn(
            "mt-1.5 size-2.5 shrink-0 rounded-full",
            dotClasses[event.color],
          )}
        />
        <DialogTitle className="min-w-0 flex-1 text-base font-semibold leading-snug">
          {event.title}
        </DialogTitle>
        <DialogClose className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>

      <DialogDescription className="sr-only">
        Details for {event.title}
      </DialogDescription>

      <div className="grid gap-3.5 px-5 py-5">
        <DetailRow icon={CalendarDays}>{dateLabel(event)}</DetailRow>
        <DetailRow icon={Clock}>{timeLabel(event)}</DetailRow>

        {event.location && (
          <DetailRow icon={MapPin}>{event.location}</DetailRow>
        )}

        {event.description && (
          <DetailRow icon={AlignLeft}>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {event.description}
            </p>
          </DetailRow>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/70 px-5 py-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onDelete}
          aria-label="Delete event"
          className="h-9 gap-2 rounded-2xl px-3 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>

        <Button
          type="button"
          onClick={onEdit}
          className="h-9 gap-2 rounded-2xl px-4 font-medium"
        >
          <Pencil className="size-4" />
          Edit
        </Button>
      </div>
    </>
  );
}
