# Calendar reference notes

Working notes on the UX patterns and implementation details behind the kit.
Reference material, not API docs — see `../context/architecture.md` for those.

## Views

| View | Purpose | Key file |
| --- | --- | --- |
| Month | Overview grid; up to 3 chips per cell + "+N more" | `views/month-view.tsx` |
| Week | 7-day timed grid with an all-day lane | `views/week-view.tsx` |
| Day | Single-day timed grid + current-time indicator | `views/day-view.tsx` |
| Agenda | Chronological list of upcoming events (45 days) | `views/agenda-view.tsx` |
| Year | 12 mini-months; click a day → day dialog | `views/year-view.tsx` |

## Time grid

- One hour = `HOUR_HEIGHT` px (`core/calendar-utils.ts`); the gutter renders 24 rows.
- Drop targets are 15-minute slots (`DayTimeColumn` renders 0/15/30/45 per hour).
- Timed events are absolutely positioned from their start/duration
  (`timedStyle` → top/height), see `PositionedTimedEvent`.

## Multi-day & all-day events

- `dayEvents(events, day)` expands an event across every day it covers.
- In month/week chips, `segmentKind(event, day)` returns
  `single | start | middle | end` to round the correct corners and hide the
  title on continuation segments.

## Drag-and-drop (dnd-kit)

- Events are `useDraggable`; grid slots are `useDroppable` (`shared/droppable.tsx`).
- **Activation constraint** `{ distance: 5 }` is essential: without it, any
  pointer movement starts a drag and suppresses the click, so events feel
  unclickable. With it, clicks open details and drags still work.
- **SSR:** dnd-kit derives `aria-describedby` ids from a module counter that
  drifts between server and client. Passing `id="calendar-dnd"` to `DndContext`
  makes them deterministic and removes the hydration warning.

## Color system

- Six palettes: sky, amber, violet, rose, emerald, orange.
- Defined as **static** class strings in `shared/event-styles.ts` so Tailwind's
  content scan detects them. Do not build classes like `bg-${color}-100`.
- Contrast target: readable in light (solid `-100` fill, `-900` text) and dark
  (tinted fill, `-50` text) — verified against the craft floor's ≥4.5:1 goal.

## Dark mode gotcha

Tailwind v4 defaults `dark:` to `prefers-color-scheme`. The tokens here are
class-based (`.dark`), so the two must be aligned with
`@custom-variant dark (&:where(.dark, .dark *))` — otherwise an OS in dark mode
applies dark event styles over a light background and text becomes invisible.

## Accessibility

- Every event button has an `aria-label` (`eventAriaLabel`) with title + time.
- Dialogs use Base UI/Radix roles; the day dialog and details dialog expose a
  title and description (some visually hidden via `sr-only`).
