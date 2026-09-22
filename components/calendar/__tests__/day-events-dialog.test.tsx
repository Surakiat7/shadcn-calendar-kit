import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalendarProvider } from "../calendar-provider";
import { Calendar } from "../calendar";
import { YearView } from "../views/year-view";
import { DayEventsDialog } from "../day-events-dialog";
import type { CalendarEvent } from "../calendar-types";
import { format } from "../calendar-utils";

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
    id: "team-26a",
    title: "Standup",
    start: d(26, 9),
    end: d(26, 10),
    color: "orange",
  },
  {
    id: "team-26b",
    title: "Planning",
    start: d(26, 9, 45),
    end: d(26, 11),
    color: "amber",
  },
  {
    id: "review-26",
    title: "Review contracts",
    start: d(26, 14),
    end: d(26, 15, 30),
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

function dialogTitle(day: number) {
  return `Events on ${format(d(day), "EEEE, MMMM d, yyyy")}`;
}

function clickDay(day: string) {
  fireEvent.click(screen.getByText(day));
}

describe("DayEventsDialog", () => {
  it("opens the dialog with an empty state when clicking a date with no events", async () => {
    renderCalendar();
    clickDay("10");

    expect(
      await screen.findByText(dialogTitle(10)),
    ).toBeTruthy();
    expect(screen.getByText("No event planned")).toBeTruthy();
  });

  it("shows the correct event when clicking a populated date", async () => {
    renderCalendar();
    clickDay("21");

    expect(await screen.findByText(dialogTitle(21))).toBeTruthy();

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Team Meeting")).toBeTruthy();
    expect(within(dialog).getByText("10:00am - 11:00am")).toBeTruthy();
    expect(
      within(dialog).getByRole("button", {
        name: "Team Meeting, 10:00 AM to 11:00 AM",
      }),
    ).toBeTruthy();
  });

  it("renders every event for a date with multiple events", async () => {
    renderCalendar();
    clickDay("26");

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Standup")).toBeTruthy();
    expect(within(dialog).getByText("Planning")).toBeTruthy();
    expect(within(dialog).getByText("Review contracts")).toBeTruthy();
    // multi-day "Product Launch" (Sep 24-27) covers Sep 26
    expect(within(dialog).getByText("Product Launch")).toBeTruthy();
  });

  it("shows a multi-day event on every covered date", async () => {
    renderCalendar();

    for (const day of ["24", "25", "26", "27"]) {
      clickDay(day);
      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByText("Product Launch")).toBeTruthy();
      expect(within(dialog).getByText("All day")).toBeTruthy();
      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).toBeNull(),
      );
    }
  });

  it("opens the create flow prefilled with the clicked date", async () => {
    renderCalendar();
    clickDay("10");

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: /create new event/i }),
    );

    expect(
      await screen.findByText("Create Event"),
    ).toBeTruthy();
    expect(
      screen.getAllByText(format(d(10), "PPP")).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("opens event details when clicking an event row, then edits", async () => {
    renderCalendar();
    clickDay("21");

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByText("Team Meeting"));

    // the day list is replaced by the read-only details view
    await waitFor(() =>
      expect(screen.queryByText(dialogTitle(21))).toBeNull(),
    );
    const editButton = await screen.findByRole("button", { name: "Edit" });
    fireEvent.click(editButton);

    expect(await screen.findByText("Edit Event")).toBeTruthy();
  });

  it("closes via the close button", async () => {
    renderCalendar();
    clickDay("10");

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Close" }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).toBeNull(),
    );
  });

  it("closes on Escape", async () => {
    renderCalendar();
    clickDay("10");

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).toBeNull(),
    );
  });

  it("keeps the dialog viewport-constrained on small screens", async () => {
    renderCalendar();
    clickDay("10");

    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("max-w-[calc(100%-2rem)]");
    expect(dialog.className).toContain("max-h-[calc(100dvh-2rem)]");
  });

  it("opens the dialog when clicking a day in Year view", async () => {
    render(
      <CalendarProvider initialEvents={events}>
        <YearView />
        <DayEventsDialog />
      </CalendarProvider>,
    );

    const september = screen
      .getAllByText("September")
      .map((el) => el.closest("div"))
      .find((el) => el && within(el).queryByText("Su"));
    expect(september).toBeTruthy();

    fireEvent.click(
      within(september!).getByRole("button", {
        name: /September 21, 2026/,
      }),
    );

    expect(await screen.findByText(dialogTitle(21))).toBeTruthy();
    expect(screen.getByText("Team Meeting")).toBeTruthy();
  });
});
