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
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sfs-bg #fffdf8; --sfs-focus #2f5fd0; --sfs-glow #d9733a; --sfs-ink #1b1a17; --sfs-l0 rgb(27 26 23 / 0.06); --sfs-l1 #c9dccb; --sfs-l2 #8fbf98; --sfs-l3 #4f9a63; --sfs-l4 #1f6b3f; --sfs-muted #6f6a62; --sfs-rim rgb(27 26 23 / 0.1); --sfs-tip #1b1a17; --sfs-tip-ink #fffdf8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sfs-bg #141217; --sfs-focus #b9cce4; --sfs-glow #f0b37a; --sfs-ink #efe8dc; --sfs-l0 rgb(239 232 220 / 0.06); --sfs-l1 #2b3b4f; --sfs-l2 #46628a; --sfs-l3 #7d9cc8; --sfs-l4 #c9dbf2; --sfs-muted #9c96a1; --sfs-rim rgb(239 232 220 / 0.1); --sfs-tip #efe8dc; --sfs-tip-ink #141217. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
