# Project context

## What this is

**shadcn-calendar-kit** is a modern, reusable calendar UI for React. It is an
original, clean-room implementation inspired by common calendar UX patterns —
not derived from any vendor's proprietary source. It is published publicly under
the MIT license for others to drop into their own products.

## Goals

- A polished, production-quality calendar that works out of the box.
- Five interchangeable views: Month, Week, Day, Agenda, Year.
- Drag-and-drop rescheduling that never gets in the way of clicking an event.
- Accessible, responsive, and themable (light/dark) by default.
- Small, readable surface area so consumers can fork and adapt it.

## Non-goals

- No backend, persistence, or auth — events are passed in as props and held in
  component state. Wiring to an API is left to the consumer.
- No recurrence engine, timezone conversion, or calendar syncing (yet).
- Not a drop-in replacement for a specific vendor's kit; it borrows patterns,
  not code.

## Audience

- App developers embedding a calendar surface.
- Contributors and AI agents extending the kit — start with
  [`architecture.md`](./architecture.md).

## Conventions

- TypeScript throughout; prefer explicit `CalendarEvent` types.
- Tailwind CSS v4 with class-based design tokens (see `app/globals.css`).
- Event colors come from a **static** class map (`shared/event-styles.ts`) so
  Tailwind can detect every class at build time — never compose color classes
  dynamically.
- Tests use Vitest + Testing Library and live in `components/calendar/__tests__`.

## Definition of done for a change

1. `pnpm test` passes.
2. `pnpm lint` and `npx tsc --noEmit` are clean.
3. New UI verified in both light and dark schemes and at mobile width.
