import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "streak-field-stats",
  name: "Streak Field Stats",
  category: "stats",
  description: "A year of days as a field of squares with the streaks pulled out beside it. Touch a day and a ripple spreads out from it through the field; pick a streak and its days light up one after another.",
  tags: ["stats", "calendar", "heatmap", "streak", "activity", "grid", "ripple"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["StreakFieldStats.tsx", "streak-field-stats.css"],
  dependencies: [],
  prompt: `Build an activity calendar with streak stats. Left: an eyebrow, the year's total (2.5rem), active days, and two toggle buttons — Longest streak and Current streak — each with its length and date range, computed from the data.

Right: 52 weeks × 7 days of 10px squares with 3px gaps in a CSS grid (weeks as columns, Monday first), five levels of one hue, month labels over the column where each month starts and Mon/Wed/Fri down the side. Each day is a real button with a full date and value as its name, inside a role="grid" with role="row" wrappers (display: contents) and a roving tabindex: arrows move by day and week, Home/End jump.

Hover or focus a day: set its column and row as --oc/--or on the field and flip a data-wave attribute between two identical keyframes so the animation restarts. Each square computes --d = hypot(c − oc, r − or), waits --d × 28ms and lifts and brightens by a factor that falls off to nothing about 11 squares out — a ripple from the day you touched, which never reaches the whole year. Throttle new ripples to one per 220ms. A small dark tooltip shows '9 km Tue 16 Sep', kept inside the frame at the edges.

Pressing a streak dims every other day to 30% and lights its run in order, 40ms per day, ending with a thin accent ring around each. The field scrolls horizontally inside itself on narrow screens, opened at the latest weeks (direction: rtl on the scroller). Paper (greens) and Night (frost blues).`,
  interaction: "Hover or arrow through the days to send a ripple from each; press a streak to light up its run.",
  animation: "Ripple 520ms per square, delayed 28ms per square of distance and fading by 11 squares; streak cells light 460ms, 40ms apart.",
  a11y: "Every day is a button named with its full date and value, in a grid with roving tabindex and arrow-key movement. The streak toggles use aria-pressed. The tooltip and labels are visual; the same facts are in the buttons' names. Reduced motion turns off the ripple and the sequence and keeps the dimming.",
  responsive: "Two columns above 760px; stacked below, with the field scrolling sideways inside its card and the streaks side by side.",
  touchFallback: "Tap a day to ripple and show its value; streak buttons work the same.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
