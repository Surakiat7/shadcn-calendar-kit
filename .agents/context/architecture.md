# Architecture

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** with class-based tokens and `@custom-variant dark`
- **Base UI / Radix** primitives (dialog, select, popover, checkbox, label)
- **vaul** for the right-side drawer
- **@dnd-kit/core** for drag-and-drop
- **date-fns** for date math, **lucide-react** for icons

## Directory map

```
app/
  layout.tsx                 # root layout
  page.tsx                   # renders <CalendarDemo />
  globals.css                # tokens, @custom-variant dark, theme
components/
  ui/                          # shadcn/ui-style primitives
  calendar/
    index.ts                   # public barrel exports
    core/
      calendar.tsx             # shell: toolbar + active view + dialogs
      calendar-provider.tsx    # context: state, dnd, event actions
      calendar-types.ts        # CalendarEvent, CalendarView, EventColor
      calendar-utils.ts        # date/layout/formatting helpers
    dialogs/
      event-drawer.tsx         # create / edit form (vaul drawer)
      event-details-dialog.tsx # read-only details + edit/delete
      day-events-dialog.tsx    # "events on this day" list
    views/                     # month / week / day / agenda / year
    shared/                    # event chips, time grid, droppable, styles
    demo/
      calendar-demo.tsx        # example mount + mock events
    __tests__/                 # Vitest component tests
lib/utils.ts                   # cn()
```

Consumers import from the barrel: `@/components/calendar` (exposes `Calendar`,
`CalendarProvider`, `useCalendar`, `CalendarDemo`, and the event types).

## State: `CalendarProvider`

A single React context (`useCalendar`) owns all calendar state:

- `date`, `view` — what is currently shown.
- `events`, `setEvents` — the event list (controlled by the consumer via
  `initialEvents`, then mutated in state).
- Editor drawer: `editorOpen`, `editing`, `editorBaseDate`, `openEditor`,
  `closeEditor`.
- Details dialog: `detailsOpen`, `detailEvent`, `openDetails`, `closeDetails`.
- Day list dialog: `dayEventsOpen`, `selectedDate`, `openDayEvents`,
  `closeDayEvents`.
- `deleteEvent(id)`.

It also hosts the **DndContext**:

- `sensors` — a `PointerSensor` with `activationConstraint: { distance: 5 }` so a
  plain click opens an event's details instead of being swallowed as a
  zero-distance drag.
- `id="calendar-dnd"` — pins dnd-kit's generated accessibility ids so they match
  between server and client (avoids an SSR hydration mismatch).
- `onDragEnd` — recomputes an event's start/end from the drop target and updates
  state.

## Interaction flow

- **Click an event** (any view) → `openDetails(event)` → read-only
  `EventDetailsDialog` → Edit opens `EventDrawer`, Delete calls `deleteEvent`.
- **Click a month/year day cell** → `openDayEvents(date)` → `DayEventsDialog`
  lists that day's events; a row opens details; "Create" opens the editor.
- **Drag an event** on the day/week grid → `onDragEnd` reschedules it.

## Event model

```ts
type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  color: EventColor; // sky | amber | violet | rose | emerald | orange
};
```

## Theming & color

- Design tokens are class-scoped: `.dark` on an ancestor flips them.
- `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` makes
  Tailwind `dark:` utilities follow the same `.dark` class instead of the OS
  `prefers-color-scheme`, keeping tokens and utilities in sync.
- Event colors are static class strings in `shared/event-styles.ts`
  (`colorClasses`, `dotClasses`). Light uses solid `-100` fills with `-900`
  text; dark uses tinted fills with `-50` text for contrast.

## Type scale

A single ramp across the calendar: `text-xs` (chips, chrome labels, meta),
`text-sm` (day numbers, list rows, body), `text-base` (dialog/drawer titles),
`text-lg`/`text-xl` (toolbar month heading). Avoid arbitrary `text-[10px]` /
`text-[11px]`.
