import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalendarProvider } from "../core/calendar-provider";
import { YearView } from "../views/year-view";
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
  {
    id: "launch",
    title: "Product Launch",
    start: d(24),
    end: d(27, 23, 59),
    allDay: true,
    color: "violet",
  },
  {
    id: "e26a",
    title: "Standup",
    start: d(26, 9),
    end: d(26, 10),
    color: "orange",
  },
  {
    id: "e26b",
    title: "Planning",
    start: d(26, 9, 45),
    end: d(26, 11),
    color: "amber",
  },
  {
    id: "e26c",
    title: "Review contracts",
    start: d(26, 14),
    end: d(26, 15, 30),
    color: "sky",
  },
];

function renderYear() {
  return render(
    <CalendarProvider initialEvents={events}>
      <YearView />
    </CalendarProvider>,
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

describe("YearView", () => {
  it("renders all 12 months", () => {
    renderYear();

    for (const month of MONTHS) {
      expect(screen.getByText(month)).toBeTruthy();
    }
  });

  it("renders weekday labels for every month", () => {
    renderYear();

    expect(screen.getAllByText("Su").length).toBe(12);
    expect(screen.getAllByText("Sa").length).toBe(12);
  });

  it("highlights the real current day", () => {
    renderYear();

    const label = format(new Date(), "MMMM d, yyyy");
    const todayButton = screen.getByRole("button", {
      name: new RegExp(`^${label}`),
    });

    expect(todayButton.className).toContain("bg-primary");
    expect(todayButton.className).toContain("text-primary-foreground");
  });

  it("includes event counts in day aria-labels", () => {
    renderYear();

    expect(
      screen.getByRole("button", { name: "September 21, 2026, 1 event" }),
    ).toBeTruthy();
    // Sep 26: launch (multi-day) + 3 same-day events = 4
    expect(
      screen.getByRole("button", { name: "September 26, 2026, 4 events" }),
    ).toBeTruthy();
  });

  it("shows at most 2 dots plus an overflow count", () => {
    renderYear();

    const cell = screen.getByRole("button", {
      name: "September 26, 2026, 4 events",
    });

    const dots = cell.querySelectorAll(".size-1.rounded-full");
    expect(dots.length).toBe(2);
    expect(within(cell).getByText("+2")).toBeTruthy();
  });

  it("shows a dot per covered day for multi-day events", () => {
    renderYear();

    for (const day of [24, 25, 26, 27]) {
      const cell = screen.getByRole("button", {
        name: new RegExp(`September ${day}, 2026, \\d+ events?`),
      });
      expect(cell.querySelectorAll(".size-1.rounded-full").length).toBeGreaterThanOrEqual(1);
    }
  });

  it("disables outside-month days", () => {
    renderYear();

    // January 2026 starts on Thursday -> Dec 28-31 are leading outside days
    const outside = screen.getByRole("button", {
      name: "December 28, 2025",
    });
    expect(outside).toHaveProperty("disabled", true);
    expect(outside.className).toContain("opacity-25");
  });

  it("renders plain aria-labels for days without events", () => {
    renderYear();

    expect(
      screen.getByRole("button", { name: "September 10, 2026" }),
    ).toBeTruthy();
  });
});
