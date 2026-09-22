# shadcn-calendar-kit

A modern, fully‑featured calendar UI for React, built with Next.js, Tailwind CSS v4, and shadcn/ui‑style components. It ships month, week, day, agenda, and year views, drag‑and‑drop scheduling, and accessible event dialogs — ready to drop into your own product.

> This is an original, clean‑room implementation inspired by common calendar UX patterns. It is not affiliated with, nor derived from, any vendor's proprietary source code.

## Features

- **Five views** — Month, Week, Day, Agenda, and Year, with a shared state provider.
- **Drag‑and‑drop scheduling** — reschedule events on the day/week grid (powered by `@dnd-kit`), with a pointer activation threshold so clicks still open events reliably.
- **Event details dialog** — click any event for a read‑only summary with edit and delete actions.
- **Create / edit drawer** — a right‑side form for title, description, date/time, all‑day, location, and color.
- **Rich event model** — timed, all‑day, multi‑day, and overlapping events, with a live current‑time indicator.
- **Responsive** — adaptive toolbar (compact `M / W / D / A` state under 480px) and layouts that work from mobile to desktop.
- **Light & dark themes** — class‑based design tokens with an accessible, high‑contrast pastel event palette that stays readable in both schemes.
- **Accessible** — semantic roles, `aria-label`s on events, and keyboard‑focusable controls.
- **Tested** — component tests with Vitest and Testing Library.

## Tech stack

| Area | Library | Version |
| --- | --- | --- |
| Framework | Next.js | 16.3.5 |
| UI runtime | React | 19.x |
| Styling | Tailwind CSS | 4.3.3 |
| Components | shadcn/ui + Base UI / Radix primitives | — |
| Drag & drop | @dnd-kit/core | 6.3.1 |
| Drawer | vaul | 1.1.x |
| Icons | lucide-react | 1.47.0 |
| Dates | date-fns | latest |
| Testing | Vitest + Testing Library | — |

## Getting started

```bash
# install dependencies (pnpm recommended)
pnpm install

# start the dev server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # lint with ESLint
pnpm test    # run the Vitest suite
```

## Project structure

```
app/                           # Next.js app router entry, global styles
components/
  ui/                          # shadcn/ui-style primitives (button, input, dialog, …)
  calendar/
    index.ts                   # public barrel exports
    core/                      # shell, provider, types, utils
    dialogs/                   # event drawer, details, day-events list
    views/                     # month / week / day / agenda / year
    shared/                    # event chips, time grid, color styles, helpers
    demo/                      # example mount with mock events
lib/                           # utilities (cn)
```

## Usage

Wrap your app in `CalendarProvider` and render `Calendar`. See
`components/calendar/demo/calendar-demo.tsx` for a complete example, including the
`CalendarEvent` shape and sample data.

```tsx
import { CalendarProvider, Calendar } from "@/components/calendar";

export function MyCalendar({ events }) {
  return (
    <CalendarProvider initialEvents={events}>
      <Calendar />
    </CalendarProvider>
  );
}
```

Events use static Tailwind class names for their colors (see
`components/calendar/shared/event-styles.ts`) so every class is detected at build
time. If you extend the palette, add the new classes to that static mapping
rather than composing them dynamically.

## License

Released under the [MIT License](./LICENSE) — free to use, modify, and
distribute, including for commercial projects. Attribution is appreciated but
not required.

## Contributing

Issues and pull requests are welcome. Please run `pnpm test` and `pnpm lint`
before opening a PR.
