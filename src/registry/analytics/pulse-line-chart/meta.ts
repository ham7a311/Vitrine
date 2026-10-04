import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pulse-line-chart",
  name: "Pulse Line",
  category: "analytics",
  description: "Revenue over time, the way a good dashboard opens: the line draws itself over a soft area, the previous period sits behind as a dashed ghost, the peak and latest day are labelled in place, ranges morph the line into its new shape, and a magnetic crosshair reads any day against last period.",
  tags: ["line chart", "area chart", "time series", "revenue", "dashboard", "crosshair", "tooltip", "comparison", "analytics"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["PulseLineChart.tsx", "pulse-line-chart.css"],
  dependencies: [],
  prompt: `Build a revenue line chart (SVG, one y-axis) with a hero figure and a period comparison.

Header: the title, the total for the range as a hero number that counts to its new value (700ms), and a delta vs the previous period with a ▲/▼ icon and text in the success/critical text tokens (never colour alone). Controls in one row: a 7D/30D/90D/12M segmented radiogroup (12M aggregates to months) and a Chart ⇄ Table toggle. A legend: "This period" (series slot 1, solid 2px) and "Previous period" (muted, dashed).

Curve: both series are interpolated with a monotone cubic (Fritsch–Carlson, so it never overshoots) and sampled at 72 positions, so switching ranges tweens every sample and the nice y-axis maximum (520ms ease-out) — the line morphs into its new shape instead of blinking. A 20% → 0 gradient area sits under the line; the previous period is a 1.5px dashed muted line. Recessive chrome: hairline gridlines, a baseline, muted tabular tick labels (4–6 x ticks by width). On first view a clip rect sweeps left to right (1.1s) to draw it in; then the peak and the latest point get dots (surface ring) and direct labels ("Peak 4.2k", "Latest 3.6k") with a surface halo.

Hover: pointer x snaps to the nearest real point (magnetic): a vertical hairline, a ringed dot on each line and a tooltip (date, value, previous, ±% with arrow) that flips side near the right edge. Keyboard: the plot is focusable; ←/→ move, Home/End, Esc clears. Accessibility: role="img" with a sentence summary; the Table view lists every point (sticky header, tabular numbers). Palette: the validated reference slot 1 (#2a78d6 light / #3987e5 dark), ink tokens for all text, light and dark themes each with their own surface and steps. Reduced motion: no tweening, counting or draw-in.`,
  interaction: "Pick a range; move along the line (or focus it and use ← →) to read any day; Table shows the numbers.",
  animation: "Draw-in 1.1s on first view; range morph 520ms; hero count 700ms.",
  a11y: "Sentence summary on the SVG, keyboard crosshair, a full table view, deltas carry an arrow and text as well as colour.",
  responsive: "Width follows the container (ResizeObserver); x ticks thin out under 520px; the header wraps.",
  touchFallback: "Drag along the chart to move the crosshair; the page still scrolls vertically.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
