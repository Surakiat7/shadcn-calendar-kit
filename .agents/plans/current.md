# Current plan

_Last updated: 2026-09-22_

## Recently shipped

- Event **details dialog** on click, in every view, with edit/delete actions.
- Fixed dnd-kit swallowing clicks (added a 5px pointer activation constraint).
- Fixed an SSR hydration mismatch by pinning the `DndContext` id.
- Made event text readable across color schemes: added `@custom-variant dark`
  so `dark:` utilities follow the `.dark` class, and raised chip contrast.
- Unified the type scale (removed arbitrary `text-[10px]/[11px]`).
- Refreshed the mock events with a varied, realistic September 2026 set.
- Added an MIT `LICENSE` and a public-facing `README`.

## In progress

- _(none)_

## Backlog / ideas

- Keyboard navigation across the grid (arrow keys, Enter to open).
- Event resizing (drag the bottom edge) in day/week views.
- Timezone-aware rendering and an all-day lane in day view.
- Recurrence (RRULE) support in the event model and editor.
- Extract a headless `useCalendar` package separate from the UI.
- Storybook or a docs site with live examples.
- Address the pre-existing `font-family: Arial` body font (pick a real face).

## Working agreement

- Keep changes small and verifiable; run `pnpm test` + `npx tsc --noEmit`.
- Verify UI in light + dark and at mobile width before calling it done.
- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `init:`.
