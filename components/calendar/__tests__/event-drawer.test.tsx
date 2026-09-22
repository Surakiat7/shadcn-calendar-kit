import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalendarProvider } from "../calendar-provider";
import { Calendar } from "../calendar";
import type { CalendarEvent } from "../calendar-types";
import { format } from "../calendar-utils";

const d = (day: number, h = 0, m = 0) => new Date(2026, 8, day, h, m);

const events: CalendarEvent[] = [
  {
    id: "team-21",
    title: "Team Meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
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

function openCreateDrawer() {
  fireEvent.click(screen.getByRole("button", { name: /new event/i }));
}

async function openEditDrawer() {
  fireEvent.click(screen.getByText("21"));
  const dialog = await screen.findByRole("dialog");
  fireEvent.click(within(dialog).getByText("Team Meeting"));
  // row click opens the read-only details view; edit from there
  const editButton = await screen.findByRole("button", { name: "Edit" });
  fireEvent.click(editButton);
  await screen.findByText("Edit Event");
}

describe("EventDrawer", () => {
  it("opens Create Event prefilled with the selected calendar date", async () => {
    renderCalendar();
    openCreateDrawer();

    expect(await screen.findByText("Create Event")).toBeTruthy();

    // both date pickers default to the selected date (Sep 21, 2026)
    const dateButtons = screen.getAllByRole("button", {
      name: format(d(21), "PPP"),
    });
    expect(dateButtons.length).toBe(2);

    // default times 09:00 - 10:00
    const triggers = screen.getAllByRole("combobox");
    const timeTriggers = triggers.filter(
      (t) => t.getAttribute("aria-label") !== "Calendar view",
    );
    expect(timeTriggers[0].textContent).toContain("09:00");
    expect(timeTriggers[1].textContent).toContain("10:00");
  });

  it("creates an event and shows it in the month view", async () => {
    renderCalendar();
    openCreateDrawer();
    await screen.findByText("Create Event");

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "My New Event" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("My New Event")).toBeTruthy();
  });

  it("does not save without a title", async () => {
    renderCalendar();
    openCreateDrawer();
    await screen.findByText("Create Event");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    // drawer stays open, no event created
    expect(screen.getByText("Create Event")).toBeTruthy();
  });

  it("changes the start date via the date picker", async () => {
    renderCalendar();
    openCreateDrawer();
    await screen.findByText("Create Event");

    const [startButton] = screen.getAllByRole("button", {
      name: format(d(21), "PPP"),
    });
    fireEvent.click(startButton);

    const popover = document.querySelector(
      "[data-radix-popper-content-wrapper]",
    ) as HTMLElement;
    expect(popover).toBeTruthy();

    fireEvent.click(within(popover).getByText("15"));

    expect(
      await screen.findByRole("button", { name: format(d(15), "PPP") }),
    ).toBeTruthy();
  });

  it("changes the start time via the time select", async () => {
    renderCalendar();
    openCreateDrawer();
    await screen.findByText("Create Event");

    const timeTriggers = screen
      .getAllByRole("combobox")
      .filter((t) => t.getAttribute("aria-label") !== "Calendar view");
    fireEvent.click(timeTriggers[0]);

    const option = await screen.findByRole("option", { name: "14:30" });
    fireEvent.click(option);

    await waitFor(() =>
      expect(timeTriggers[0].textContent).toContain("14:30"),
    );
  });

  it("closes with Cancel and with the X button", async () => {
    renderCalendar();
    openCreateDrawer();
    await screen.findByText("Create Event");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByText("Create Event")).toBeNull(),
    );

    openCreateDrawer();
    await screen.findByText("Create Event");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("Create Event")).toBeNull(),
    );
  });

  it("prefills the editor with the event data", async () => {
    renderCalendar();
    await openEditDrawer();

    expect(screen.getByLabelText("Title")).toHaveProperty(
      "value",
      "Team Meeting",
    );
    expect(screen.getByLabelText("Description")).toHaveProperty(
      "value",
      "Weekly team sync",
    );
    expect(screen.getByLabelText("Location")).toHaveProperty(
      "value",
      "Conference Room A",
    );
  });

  it("saves edits to an existing event", async () => {
    renderCalendar();
    await openEditDrawer();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Meeting" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(screen.queryByText("Edit Event")).toBeNull(),
    );

    fireEvent.click(screen.getByText("21"));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Updated Meeting")).toBeTruthy();
    expect(within(dialog).queryByText("Team Meeting")).toBeNull();
  });
});
