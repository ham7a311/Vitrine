import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "calendar-heatmap",
  "name": "Calendar Heatmap",
  "category": "analytics",
  "description": "A year of daily activity, one square per day on a single-hue ramp; hover or arrow through the year to read any day exactly.",
  "tags": [
    "heatmap",
    "calendar",
    "activity",
    "daily",
    "chart",
    "analytics",
    "streak",
    "contribution"
  ],
  "traits": [
    "hover",
    "keyboard",
    "click"
  ],
  "source": "original",
  "files": [
    "CalendarHeatmap.tsx",
    "calendar-heatmap.css"
  ],
  "dependencies": [],
  "prompt": "Build a calendar heatmap of a year of daily values in SVG with no chart library: 53 Monday-first week columns of seven 12px rounded squares (3px gaps), month labels over the first week of each month and Mon/Wed/Fri row labels. Each day is shaded on a six-step single-hue sequential ramp (empty, then light to dark blue, with the dark theme re-stepped rather than inverted) by its value relative to the year's maximum. The headline is the year's total; three derived stats sit under it — busiest day, longest streak of active days, quietest weekday.\n\nHover a day (or focus the calendar and move with the arrow keys: ±1 day vertically, ±1 week horizontally, Home/End) to outline it and read \"Sat 14 Feb: 37 bookings\" in a polite live line below. A Less → More legend shows the ramp. A year switch recolours the squares with a short fill transition that sweeps across the weeks (6ms per column). Monthly totals are also in a visually hidden table. The demo data is seeded and plausible: busier in winter and at weekends, quiet on Fridays, softer during Ramadan.",
  "interaction": "Hover a day, or focus the calendar and use the arrow keys, to read exact values; switch the year above.",
  "animation": "Year switch: fills transition 420ms, staggered 6ms per week column.",
  "a11y": "The calendar is a focusable role=\"img\" with a summary and full arrow-key reading through a polite live line; monthly totals are in a visually hidden table; the legend explains the ramp. Reduced motion recolours instantly.",
  "responsive": "Scales with its container; the calendar scrolls horizontally inside its card on narrow screens rather than shrinking squares.",
  "touchFallback": "Tap to highlight; the table view covers precise reading.",
  "variants": [
    {
      "id": "light",
      "label": "Light"
    },
    {
      "id": "dark",
      "label": "Dark"
    }
  ],
  "preview": {
    "bg": "#f2f1ed",
    "mode": "fill",
    "height": 560
  },
};
