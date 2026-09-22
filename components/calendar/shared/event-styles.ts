import type { EventColor } from "../calendar-types";

export const colorClasses: Record<EventColor, string> = {
  sky: "bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-400/25 dark:text-sky-50 dark:hover:bg-sky-400/35 shadow-sky-700/8",
  amber:
    "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-400/25 dark:text-amber-50 dark:hover:bg-amber-400/35 shadow-amber-700/8",
  violet:
    "bg-violet-100 text-violet-900 hover:bg-violet-200 dark:bg-violet-400/25 dark:text-violet-50 dark:hover:bg-violet-400/35 shadow-violet-700/8",
  rose: "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-400/25 dark:text-rose-50 dark:hover:bg-rose-400/35 shadow-rose-700/8",
  emerald:
    "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-400/25 dark:text-emerald-50 dark:hover:bg-emerald-400/35 shadow-emerald-700/8",
  orange:
    "bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-400/25 dark:text-orange-50 dark:hover:bg-orange-400/35 shadow-orange-700/8",
};

export const dotClasses: Record<EventColor, string> = {
  sky: "bg-sky-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
  emerald: "bg-emerald-400",
  orange: "bg-orange-400",
};
