"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import type { CalendarEvent, CalendarView } from "./calendar-types";
import { minutesFromMidnight, setTimeOfDay } from "./calendar-utils";

type Ctx = {
  date: Date;
  setDate: (d: Date) => void;
  view: CalendarView;
  setView: (v: CalendarView) => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  openEditor: (e?: CalendarEvent, baseDate?: Date) => void;
  editorOpen: boolean;
  editing?: CalendarEvent;
  editorBaseDate?: Date;
  closeEditor: () => void;
  selectedDate: Date | null;
  dayEventsOpen: boolean;
  openDayEvents: (d: Date) => void;
  closeDayEvents: () => void;
  detailsOpen: boolean;
  detailEvent?: CalendarEvent;
  openDetails: (e: CalendarEvent) => void;
  closeDetails: () => void;
  deleteEvent: (id: string) => void;
};

const Context = React.createContext<Ctx | null>(null);

export function useCalendar() {
  const v = React.useContext(Context);
  if (!v) throw new Error("useCalendar must be inside CalendarProvider");
  return v;
}

export function CalendarProvider({
  children,
  initialEvents,
}: {
  children: React.ReactNode;
  initialEvents: CalendarEvent[];
}) {
  const [date, setDate] = React.useState(new Date(2026, 8, 21));
  const [view, setView] = React.useState<CalendarView>("month");
  const [events, setEvents] = React.useState(initialEvents);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CalendarEvent | undefined>();
  const [editorBaseDate, setEditorBaseDate] = React.useState<Date>();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [dayEventsOpen, setDayEventsOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailEvent, setDetailEvent] = React.useState<CalendarEvent>();

  const openEditor = (e?: CalendarEvent, baseDate?: Date) => {
    setEditing(e);
    setEditorBaseDate(baseDate);
    setEditorOpen(true);
  };

  const closeEditor = () => setEditorOpen(false);

  const openDayEvents = (d: Date) => {
    setDate(d);
    setSelectedDate(d);
    setDayEventsOpen(true);
  };

  const closeDayEvents = () => setDayEventsOpen(false);

  const openDetails = (e: CalendarEvent) => {
    setDetailEvent(e);
    setDetailsOpen(true);
  };

  const closeDetails = () => setDetailsOpen(false);

  const deleteEvent = (id: string) => {
    setEvents((es) => es.filter((e) => e.id !== id));
    setDetailsOpen(false);
  };

  // Require a small drag distance before a pointer press becomes a drag, so a
  // plain click on an event still fires onClick (opens its details) instead of
  // being swallowed as a zero-distance drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragEnd = (ev: DragEndEvent) => {
    const event = ev.active.data.current?.event as CalendarEvent | undefined;
    const drop = ev.over?.data.current as
      | { date?: Date; minutes?: number }
      | undefined;

    if (!event || !drop?.date) return;

    const duration = event.end.getTime() - event.start.getTime();
    const minutes = drop.minutes ?? minutesFromMidnight(event.start);
    const start = setTimeOfDay(drop.date, minutes);
    const end = new Date(start.getTime() + duration);

    setEvents((es) =>
      es.map((e) => (e.id === event.id ? { ...e, start, end } : e)),
    );
  };

  return (
    <Context.Provider
      value={{
        date,
        setDate,
        view,
        setView,
        events,
        setEvents,
        openEditor,
        editorOpen,
        editing,
        editorBaseDate,
        closeEditor,
        selectedDate,
        dayEventsOpen,
        openDayEvents,
        closeDayEvents,
        detailsOpen,
        detailEvent,
        openDetails,
        closeDetails,
        deleteEvent,
      }}
    >
      <DndContext id="calendar-dnd" sensors={sensors} onDragEnd={onDragEnd}>
        {children}
      </DndContext>
    </Context.Provider>
  );
}
