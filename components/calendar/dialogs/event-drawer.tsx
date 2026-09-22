"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCalendar } from "../core/calendar-provider";
import type { EventColor } from "../core/calendar-types";
import { format, withTime } from "../core/calendar-utils";
import { dotClasses } from "../shared/event-styles";

const colors: EventColor[] = [
  "sky",
  "amber",
  "violet",
  "rose",
  "emerald",
  "orange",
];

const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const toTime = (d: Date) => format(d, "HH:mm");

export function EventDrawer() {
  const { editorOpen, closeEditor, editing } = useCalendar();

  return (
    <Drawer
      open={editorOpen}
      onOpenChange={(open) => {
        if (!open) closeEditor();
      }}
      direction="right"
    >
      <DrawerContent className="inset-x-auto inset-y-0 right-0 mt-0 h-full w-[92%] rounded-t-none rounded-l-xl border-l bg-popover text-popover-foreground sm:max-w-md [&>div:first-child]:hidden">
        <DrawerHeader className="flex-row items-center justify-between gap-0 border-b">
          <DrawerTitle className="text-base font-semibold">
            {editing ? "Edit Event" : "Create Event"}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {editing ? "Edit the selected event" : "Create a new calendar event"}
          </DrawerDescription>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close">
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {editorOpen && <EventDrawerForm />}
      </DrawerContent>
    </Drawer>
  );
}

function EventDrawerForm() {
  const { closeEditor, editing, editorBaseDate, setEvents, date } =
    useCalendar();

  const base = editorBaseDate ?? date;
  const initialStart =
    editing?.start ??
    new Date(base.getFullYear(), base.getMonth(), base.getDate(), 9);
  const initialEnd =
    editing?.end ??
    new Date(base.getFullYear(), base.getMonth(), base.getDate(), 10);

  const [title, setTitle] = React.useState(editing?.title ?? "");
  const [description, setDescription] = React.useState(
    editing?.description ?? "",
  );
  const [location, setLocation] = React.useState(editing?.location ?? "");
  const [color, setColor] = React.useState<EventColor>(
    editing?.color ?? "sky",
  );
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialStart,
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(initialEnd);
  const [startTime, setStartTime] = React.useState(toTime(initialStart));
  const [endTime, setEndTime] = React.useState(toTime(initialEnd));
  const [allDay, setAllDay] = React.useState(editing?.allDay ?? false);

  const save = () => {
    if (!title.trim() || !startDate || !endDate) return;

    const start = withTime(startDate, startTime);
    const end = withTime(endDate, endTime);

    setEvents((es) =>
      editing
        ? es.map((e) =>
            e.id === editing.id
              ? { ...e, title, description, location, color, allDay, start, end }
              : e,
          )
        : [
            ...es,
            {
              id: crypto.randomUUID(),
              title,
              description,
              location,
              color,
              allDay,
              start,
              end,
            },
          ],
    );

    closeEditor();
  };

  return (
    <>
      <div className="grid gap-4 overflow-y-auto p-4">
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Description" htmlFor="description">
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
          <Field label="Start Date">
            <DatePicker value={startDate} onChange={setStartDate} />
          </Field>
          <Field label="Start Time">
            <TimeSelect value={startTime} onChange={setStartTime} />
          </Field>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
          <Field label="End Date">
            <DatePicker value={endDate} onChange={setEndDate} />
          </Field>
          <Field label="End Time">
            <TimeSelect value={endTime} onChange={setEndTime} />
          </Field>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="all-day"
            checked={allDay}
            onCheckedChange={(v) => setAllDay(v === true)}
          />
          <Label htmlFor="all-day">All day</Label>
        </div>

        <Field label="Location" htmlFor="location">
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>

        <div className="grid gap-3">
          <Label>Color</Label>
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <Button
                key={c}
                type="button"
                variant="none"
                size="none"
                aria-label={c}
                aria-pressed={c === color}
                onClick={() => setColor(c)}
                className={`size-6 rounded-full border-2 ${c === color ? "border-foreground" : "border-transparent"} ${dotClasses[c]}`}
              />
            ))}
          </div>
        </div>
      </div>

      <DrawerFooter className="flex-row justify-end gap-2 border-t">
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
        <Button onClick={save}>Save</Button>
      </DrawerFooter>
    </>
  );
}

function DatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="h-8 w-full justify-start rounded-lg bg-transparent px-2.5 text-left font-normal shadow-none data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon className="text-muted-foreground" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = TIME_OPTIONS.includes(value)
    ? TIME_OPTIONS
    : [...TIME_OPTIONS, value].sort();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>

      <SelectContent
        position="popper"
        align="end"
        sideOffset={4}
        collisionPadding={12}
        avoidCollisions
        className="z-[70] max-h-[min(14rem,var(--radix-select-content-available-height))] min-w-0 w-(--radix-select-trigger-width)"
      >
        {options.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
