import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "brush-zoom-chart",
  name: "Brush Zoom",
  category: "analytics",
  description: "Two years of daily data, read at any magnification: drag the window across the overview strip or pull its handles and the chart above eases to just those days, its axis re-fitting as it goes, with pins marking the events that explain the shape.",
  tags: ["brush", "zoom", "focus + context", "time series", "overview", "range selector", "events", "annotations", "analytics"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["BrushZoomChart.tsx", "brush-zoom-chart.css"],
  dependencies: [],
  prompt: `Build a focus + context time series: 730 days of daily searches with a brushable overview.

Detail chart (SVG): the daily values as a light 1.25px line over a soft area, the centred 7-day average as the 2px series-1 line, nice y-ticks re-fitted to the visible window, date ticks that switch from months to fortnights to weeks as you zoom, clipped to the plot. Event pins (dashed vertical rule, a dot in slot 2, a label with a surface halo that flips side near the right edge; a pin too close to the previous one drops to a second row so labels never collide). Crosshair snaps to the nearest day with a tooltip (date, value, 7-day average).

Overview (64px strip beneath): the whole two years as the 7-day average, quarter labels, small pin dots (click to jump), the area outside the window washed with the surface, and a rounded window with two grip handles. Pointer: drag inside to move, drag a handle to resize (minimum 7 days), drag outside to draw a new window; pointer capture; values round to whole days on release. The detail view eases toward the window with an exponential follow (rate 14/s) in a rAF loop that stops when it arrives, so the chart glides rather than jumps.

Keyboard: a focusable slider-role element (value text "1 Mar 2026 to 30 Jun 2026"): ←/→ move a week (Shift: a month), ↑/↓ or +/− zoom around the centre, Home/End. Presets 2W/3M/6M/All, event chips to jump, a header with the range and the per-day average, a legend (Daily, 7-day average, Event), and a Table view of the visible days. Light and dark themes with the reference palette. Reduced motion: the view jumps.`,
  interaction: "Drag the window on the strip (or its edges), use the presets or event chips, or focus the range and use the arrow keys; point at the chart to read a day.",
  animation: "The detail view follows the brush with an exponential ease (≈150ms to settle).",
  a11y: "The brush has a keyboard-operable slider with spoken start and end dates; event jumps are buttons; the SVG has a summary and the Table lists the visible days.",
  responsive: "Width follows the container; date ticks thin automatically.",
  touchFallback: "Drag on the strip with a finger (touch-action none on the strip only).",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --axis #c3c2b7; --grid #e1e0d9; --ink #0b0b0b; --ink-2 #52514e; --ring rgba(11, 11, 11, 0.1); --s1 #2a78d6; --s2 #eb6834; --surface #fcfcfb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --axis #383835; --grid #2c2c2a; --ink #ffffff; --ink-2 #c3c2b7; --ring rgba(255, 255, 255, 0.1); --s1 #3987e5; --s2 #d95926; --surface #1a1a19. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
