import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalendarProvider } from "../core/calendar-provider";
import { Calendar } from "../core/calendar";
import type { CalendarEvent } from "../core/calendar-types";
import { format } from "../core/calendar-utils";

const d = (day: number, h = 0, m = 0) => new Date(2026, 8, day, h, m);

const events: CalendarEvent[] = [
  {
    id: "team-21",
    title: "Team Meeting",
    start: d(21, 10),
    end: d(21, 11),
    color: "sky",
  },
];

function renderCalendar() {
  return render(
    <CalendarProvider initialEvents={events}>
      <Calendar />
    </CalendarProvider>,
  );
}

const title = () => screen.getByRole("heading", { level: 2 });
const viewSlot = (name: string) =>
  document.querySelector(`[data-slot="${name}-view"]`);

function openViewPicker() {
  fireEvent.click(screen.getByRole("combobox", { name: "Calendar view" }));
}

function pickView(name: string) {
  fireEvent.click(screen.getByRole("option", { name }));
}

describe("CalendarToolbar", () => {
  it("starts in Month view with the month/year title", () => {
    renderCalendar();

    expect(viewSlot("month")).toBeTruthy();
    expect(title().textContent).toBe(format(d(21), "MMMM yyyy"));
  });

  it("navigates to the previous and next month", () => {
    renderCalendar();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(title().textContent).toBe("August 2026");

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(title().textContent).toBe("September 2026");
  });

  it("Today returns to the current date", () => {
    renderCalendar();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(title().textContent).toBe("July 2026");

    fireEvent.click(screen.getByRole("button", { name: /today/i }));
    expect(title().textContent).toBe(format(new Date(), "MMMM yyyy"));
  });

  it("lists every view option in the combobox", () => {
    renderCalendar();
    openViewPicker();

    for (const name of ["Month", "Week", "Day", "Agenda", "Year"]) {
      expect(screen.getByRole("option", { name })).toBeTruthy();
    }
  });

  it("switches to Week view", () => {
    renderCalendar();
    openViewPicker();
    pickView("Week");

    expect(viewSlot("week")).toBeTruthy();
    expect(viewSlot("month")).toBeNull();
  });

  it("switches to Day view with the full date title", () => {
    renderCalendar();
    openViewPicker();
    pickView("Day");

    expect(viewSlot("day")).toBeTruthy();
    expect(title().textContent).toBe(format(d(21), "EEE MMMM d, yyyy"));
  });

  it("switches to Agenda view", () => {
    renderCalendar();
    openViewPicker();
    pickView("Agenda");

    expect(viewSlot("month")).toBeNull();
    // agenda renders the selected day's events
    expect(screen.getByText("Team Meeting")).toBeTruthy();
  });

  it("switches to Year view with the year as the title", () => {
    renderCalendar();
    openViewPicker();
    pickView("Year");

    expect(viewSlot("year")).toBeTruthy();
    expect(title().textContent).toBe("2026");
  });

  it("navigates by year while in Year view", () => {
    renderCalendar();
    openViewPicker();
    pickView("Year");

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(title().textContent).toBe("2025");

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(title().textContent).toBe("2027");
  });

  it("marks the current view with a check and closes after selecting", () => {
    renderCalendar();
    openViewPicker();

    const monthOption = screen.getByRole("option", { name: "Month" });
    expect(monthOption.querySelector("svg")).toBeTruthy();

    const weekOption = screen.getByRole("option", { name: "Week" });
    expect(weekOption.querySelector("svg")).toBeNull();

    pickView("Week");

    // popover closed
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("shows the compact and full view labels for responsive display", () => {
    renderCalendar();

    const trigger = screen.getByRole("combobox", { name: "Calendar view" });
    const spans = trigger.querySelectorAll("span");

    // sr-only full label + visible compact label
    expect(within(trigger).getByText("Month")).toBeTruthy();
    expect(within(trigger).getByText("M")).toBeTruthy();
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });

  it("opens the create event drawer from New event", async () => {
    renderCalendar();

    fireEvent.click(screen.getByRole("button", { name: /new event/i }));

    expect(await screen.findByText("Create Event")).toBeTruthy();
  });
});
