import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "hour-dial-stats",
  name: "Hour Dial Stats",
  category: "stats",
  description: "A day of footfall on a 24-hour clock face: one bar per hour radiating from the centre, sunrise and sunset on the rim, the busiest stretch washed in softly. Turn the hand to read any hour; switch weekdays and weekend and the bars grow into the other day's shape.",
  tags: ["stats", "radial", "clock", "hours", "footfall", "slider", "chart"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["HourDialStats.tsx", "hour-dial-stats.css"],
  dependencies: [],
  prompt: `Build a 24-hour radial stats dial in SVG (viewBox 360).

Data: days = { [dayType]: number[24] } with midnight first; a radiogroup switches day types.

Face: a soft radial-gradient disc; a slightly deeper 20px ring from sunset round to sunrise (arc from sunset × 15° to sunrise × 15° + 360°); hour ticks round the rim (longer every 6 hours) with mono labels 00, 06, 12, 18 inside; sunrise and sunset dots on the rim with a legend giving their times.

Bars: 24 rounded rects, one per hour, each in a group rotated i × 15° about the centre, running from an inner radius of 62 out to 132. Each is scaled with CSS transform: scaleY(value / max across all day types) with transform-box: fill-box and transform-origin at its inner end, so switching day types grows and shrinks every bar into the other shape (620ms with a slight overshoot) and scales stay comparable. The selected hour's bar takes the accent colour; the others are a quiet tint. The busiest stretch — the longest run of hours at 75% of the day's best or more — is a soft filled ring sector behind the bars, and its range is printed in the header.

Hand: a line from the hub to the rim with a knob, rotated on a spring (k 240, ζ 0.78) that always turns the short way round; while dragging it tracks the pointer exactly. The SVG itself is the control: role=slider (0–23) with aria-valuetext "19:00, 78 guests, busy"; pointerdown captures the pointer and snaps to the nearest hour from the angle (ignoring the hub); Arrow keys step 1 hour, PageUp/PageDown 3, Home and End jump to 00 and 23; touch-action none. The hub shows the hour in mono, the value large, and a mood chip — Closed, Quiet, Steady, Busy or Peak — from the value against the day's mean while open. A visually hidden table lists every hour for each day type. Paper (terracotta accent) and Night (apricot).`,
  interaction: "Drag the hand round the dial, or focus it and use the arrow keys, PageUp/PageDown, Home and End. Switch Weekdays and Weekend.",
  animation: "Bars morph 620ms with a slight overshoot; the hand turns on a spring (k 240, ζ 0.78) the short way round; colours 200ms.",
  a11y: "The dial is one slider with a spoken value (time, count and mood) and full keyboard control; the day switch is a radiogroup; a hidden table carries every number. Reduced motion jumps the hand and bars instead of animating.",
  responsive: "The dial scales to its column (max 25rem); the copy stacks above it on narrow screens.",
  touchFallback: "Drag the hand with a finger — touch-action is off on the dial so it doesn't scroll.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --hd-accent #b5541f; --hd-bar #dcc9b2; --hd-bg #fbf7f0; --hd-face-1 #fffdf8; --hd-face-2 #f3ece0; --hd-focus #b5541f; --hd-ink #1b1a17; --hd-muted #706a60; --hd-night rgb(27 26 23 / 0.06); --hd-rim rgb(27 26 23 / 0.1); --hd-rise #e09a2c; --hd-set #8a5a9c; --hd-tick rgb(27 26 23 / 0.22); --hd-wash rgb(181 84 31 / 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --hd-accent #f0a36a; --hd-bar #4a4038; --hd-bg #141312; --hd-face-1 #1e1c1a; --hd-face-2 #171614; --hd-focus #f0a36a; --hd-ink #efe8dc; --hd-muted #9c968c; --hd-night rgb(0 0 0 / 0.28); --hd-rim rgb(239 232 220 / 0.1); --hd-rise #f2c14e; --hd-set #b99ad0; --hd-tick rgb(239 232 220 / 0.25); --hd-wash rgb(240 163 106 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f2ede4", mode: "fill" },
};
