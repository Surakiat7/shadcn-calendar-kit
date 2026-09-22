"use client";

import { useCalendar } from "./calendar-provider";
import { CalendarToolbar } from "../shared/calendar-toolbar";
import { MonthView } from "../views/month-view";
import { WeekView } from "../views/week-view";
import { DayView } from "../views/day-view";
import { AgendaView } from "../views/agenda-view";
import { YearView } from "../views/year-view";
import { EventDrawer } from "../dialogs/event-drawer";
import { DayEventsDialog } from "../dialogs/day-events-dialog";
import { EventDetailsDialog } from "../dialogs/event-details-dialog";

export function Calendar() {
  const { view } = useCalendar();

  return (
    <div className="@container/main mx-auto w-full max-w-7xl">
      <div
        className="flex h-(--content-full-height) flex-col rounded-lg border"
        style={
          {
            "--event-height": "24px",
            "--event-gap": "4px",
            "--week-cells-height": "64px",
          } as React.CSSProperties
        }
      >
        <CalendarToolbar />

        <div className="calendar-scrollbar flex flex-1 flex-col overflow-auto">
          {view === "month" && <MonthView />}
          {view === "week" && <WeekView />}
          {view === "day" && <DayView />}
          {view === "agenda" && <AgendaView />}
          {view === "year" && <YearView />}
        </div>

        <EventDrawer />
        <DayEventsDialog />
        <EventDetailsDialog />
      </div>
    </div>
  );
}
