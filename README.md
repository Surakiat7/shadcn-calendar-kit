# shadcn-calendar-kit

This is an original implementation reconstructed from the user-provided DOM/screenshots of the Shadcn UI Kit calendar. It is **not the vendor's proprietary source code**.

## Stack (verified 2026-09-21)
- Next.js 16.3.5
- React 19.x
- Tailwind CSS 4.3.3
- shadcn CLI 4.21.0
- @dnd-kit/core 6.3.1
- lucide-react 1.47.0

## Included
- Month / Week / Day / Agenda modes
- Responsive toolbar (`M/W/D/A` compact state under 480px)
- Month grid and multi-day segmented events
- 24h day/week time grid with 15-minute drop slots
- Timed events with absolute time positioning
- Current-time indicator
- Agenda cards
- Right-side create/edit drawer shell
- Shared pastel event colors and dark mode tokens
- dnd-kit drag/drop infrastructure

## Run
```bash
pnpm install
pnpm dev
```

## Notes
The supplied DOM showed Vaul/Radix-style drawer attributes, but this clean-room package uses a dependency-light controlled drawer so the example is portable. Replace `components/calendar/event-drawer.tsx` with your project's shadcn Drawer/Sheet primitive if desired.

The color picker intentionally uses static Tailwind class names elsewhere; if you keep the dynamic `bg-${color}-400` expression in the drawer, replace it with a static mapping before production so Tailwind can detect every class reliably.
