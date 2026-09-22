"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarCheck2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useCalendar } from "../calendar-provider";
import { navigate, viewTitle } from "../calendar-utils";
import type { CalendarView } from "../calendar-types";

const labels: Record<CalendarView, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
  year: "Year",
};

const views: CalendarView[] = ["month", "week", "day", "agenda", "year"];

export function CalendarToolbar() {
  const { date, setDate, view, setView, openEditor } = useCalendar();
  const [viewOpen, setViewOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between p-2 sm:p-4">
      <div className="flex min-w-0 items-center gap-1 sm:gap-4">
        <Button
          variant="outline"
          size="sm"
          className="max-[479px]:aspect-square max-[479px]:p-0"
          onClick={() => setDate(new Date())}
        >
          <CalendarCheck2 className="size-4 min-[480px]:hidden" />
          <span className="max-[479px]:sr-only">Today</span>
          <span className="max-[479px]:hidden">Today</span>
        </Button>

        <div className="flex items-center sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Previous"
            onClick={() => setDate(navigate(date, view, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Next"
            onClick={() => setDate(navigate(date, view, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <h2 className="truncate text-sm font-semibold sm:text-lg md:text-xl">
          {viewTitle(date, view)}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={viewOpen} onOpenChange={setViewOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={viewOpen}
              aria-label="Calendar view"
              className="font-normal max-[479px]:w-12 max-[479px]:px-0"
            >
              <span className="max-[479px]:sr-only">{labels[view]}</span>
              <span className="min-[480px]:hidden">{labels[view][0]}</span>
              <ChevronDown className="size-4 opacity-60" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-40 p-1">
            <Command>
              <CommandList>
                <CommandGroup>
                  {views.map((v) => (
                    <CommandItem
                      key={v}
                      value={v}
                      onSelect={() => {
                        setView(v);
                        setViewOpen(false);
                      }}
                    >
                      {labels[v]}
                      {view === v && <Check className="ml-auto" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          onClick={() => openEditor()}
          className="max-[479px]:aspect-square max-[479px]:p-0"
        >
          <Plus className="size-4 opacity-60" />
          <span className="max-sm:sr-only">New event</span>
        </Button>
      </div>
    </div>
  );
}
