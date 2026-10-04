import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bar-race",
  name: "Bar Race",
  category: "analytics",
  description: "A year of bookings as a race: each month the destinations re-sort, and on play the bars grow, overtake and slide past each other in real time with values counting and the month watermarked behind. Colour is the region and never changes; the name on every bar identifies it.",
  tags: ["bar chart race", "ranking", "animated", "leaderboard", "timeline", "play", "scrubber", "analytics"],
  traits: ["click", "keyboard", "touch", "ambient"],
  source: "original",
  files: ["BarRace.tsx", "bar-race.css"],
  dependencies: [],
  prompt: `Build an animated bar chart race of cumulative bookings for 10 destinations over 12 months, showing the top 8.

Motion: t runs from 0 to 11 (≈1.15s per month in a rAF loop that pauses with the tab hidden and stops at the end; it auto-plays once when 40% in view). Values are smoothstep-interpolated between months; ranks are computed from the interpolated values each frame; each bar's row position eases toward its rank (22% per frame), so overtakes slide past rather than snap, and bars falling out of the top 8 fade as they leave. Bars are absolutely positioned rows (38px, 8px gaps) translated by row, with width ∝ value on a shared axis that re-fits to the leader; 4px rounded data end, square at the baseline. The destination name sits inside the bar in white (outside, after the value, when the bar is short) and the value counts beside the bar's end in ink with tabular figures. A huge 7% ink month watermark sits at the bottom right; faint gridlines with tick values across the top.

Colour encodes region with three slots only (the reference palette's first three, the subset validated for all pairs), never rank, so a destination keeps its colour wherever it moves; the names carry identity. Controls: play/pause (replays from the start at the end), a range scrubber (step 0.01, snapping to a month on release, arrow keys step whole months) with the current month. Header insight updates with the leader ("Salalah leads in Sep 26 — 18,422 bookings."), a region legend, and Chart ⇄ Table (every destination × month). role="img" summary on the plot. Light and dark. Reduced motion: shows the final month, no animation.`,
  interaction: "Watch it play when it comes into view; pause, replay, or scrub month by month (arrow keys too); Table for the numbers.",
  animation: "≈1.15s per month; smoothstep values; rows ease into their new ranks.",
  a11y: "Summary on the plot updates with the month and leader; the scrubber is a labelled range with the month as value text; the table has every value. Identity is by name, not colour.",
  responsive: "Bars fill the card's width; names shrink and move outside short bars on phones.",
  touchFallback: "Tap play or drag the scrubber.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
