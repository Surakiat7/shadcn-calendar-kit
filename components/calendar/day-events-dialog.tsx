"use client";

import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCalendar } from "./calendar-provider";
import type { CalendarEvent } from "./calendar-types";
import {
  dayEvents,
  eventAriaLabel,
  eventTimeLabel,
  format,
} from "./calendar-utils";
import { colorClasses } from "./shared/event-styles";

export function DayEventsDialog() {
  const {
    selectedDate,
    dayEventsOpen,
    closeDayEvents,
    events,
    openEditor,
    openDetails,
  } = useCalendar();

  const list = selectedDate ? dayEvents(events, selectedDate) : [];
  const title = selectedDate
    ? `Events on ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
    : "Events";

  const handleEventClick = (e: CalendarEvent) => {
    closeDayEvents();
    openDetails(e);
  };

  const handleCreate = () => {
    const d = selectedDate;
    closeDayEvents();
    if (d) openEditor(undefined, d);
  };

  return (
    <Dialog
      open={dayEventsOpen}
      onOpenChange={(open) => {
        if (!open) closeDayEvents();
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/40 backdrop-blur-[3px]"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden rounded-3xl bg-popover p-4 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 dark:ring-foreground/10 sm:max-w-[480px] sm:rounded-3xl sm:p-5"
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full bg-rose-500"
          />
          <DialogTitle className="min-w-0 flex-1 text-base font-semibold leading-tight">
            {title}
          </DialogTitle>
          <DialogClose className="inline-flex size-7 shrink-0 items-center justify-center rounded-2xl transition-colors hover:bg-muted">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <DialogDescription className="sr-only">
          {selectedDate
            ? `Events scheduled for ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
            : "Day events"}
        </DialogDescription>

        {list.length ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {list.map((e) => (
                <Button
                  key={e.id}
                  type="button"
                  variant="none"
                  size="none"
                  onClick={() => handleEventClick(e)}
                  aria-label={eventAriaLabel(e)}
                  className={cn(
                    "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors",
                    colorClasses[e.color],
                  )}
                >
                  <span className="min-w-0 truncate">{e.title}</span>
                  <span className="shrink-0 text-xs font-medium">
                    {eventTimeLabel(e)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-5 text-center text-sm text-muted-foreground">
            No event planned
          </p>
        )}

        <Button
          variant="outline"
          onClick={handleCreate}
          className="h-10 w-full gap-2 rounded-2xl border-border font-medium hover:bg-muted"
        >
          <Plus className="size-4" />
          Create new event
        </Button>
      </DialogContent>
    </Dialog>
  );
}
