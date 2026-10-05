import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "scrub-sparkline-stats",
  name: "Scrub Sparkline Stats",
  category: "stats",
  description: "KPI tiles you can read back through: drag along a sparkline and the big number turns to that day — only the digits that differ roll — while the date and the change follow. Let go and it springs back to today.",
  tags: ["stats", "kpi", "sparkline", "scrub", "dashboard", "odometer", "chart"],
  traits: ["hover", "touch", "keyboard"],
  source: "original",
  files: ["ScrubSparklineStats.tsx", "scrub-sparkline-stats.css"],
  dependencies: [],
  prompt: `Build a strip of KPI tiles (revenue, orders, average order, refund rate), each with a label, a big value, a delta line and a 30-day sparkline.

The sparkline is an SVG in a 100 × 40 box with preserveAspectRatio="none" and vector-effect: non-scaling-stroke. Draw it twice: a dim full line underneath, and on top a second SVG holding a soft area fill (currentColor gradient) and the full-strength line, clipped with clip-path: inset(… calc(100% − cursor) …) so the colour reaches only as far as the cursor.

The cursor position is a float in days. Pointer move (mouse) or press-and-drag (touch, with pointer capture and touch-action: pan-y) sets it directly; a crosshair and a haloed dot sit at the interpolated point. Leaving or releasing springs it back to today in requestAnimationFrame (stiffness ~90, damping ~15). The nearest day drives the readout.

The big value is split into digit reels keyed by place from the right; each reel's strip translates to −digit em with a 420ms ease and a 22ms stagger, so scrubbing from 12,480 to 12,416 rolls only the last two digits. The date chip switches from 'Today' to 'Tue 16 Sep' and takes the plot colour while held. The delta is the change on the day before, coloured good/bad with an arrow, inverted for metrics where down is good. OMR values use three decimals.

The plot is a role="slider" (1–30) with an aria-valuetext of the date, value and delta; arrow keys step a day, PageUp/PageDown a week, Home/End jump. Paper and Night.`,
  interaction: "Hover or drag along a sparkline to read any day; release and it returns to today. Keyboard: arrows, PageUp/PageDown, Home/End.",
  animation: "Digits roll 420ms with a 22ms place stagger; the cursor springs home; the crosshair fades in 200ms.",
  a11y: "Each plot is a role=\"slider\" whose value text reads the date, value and delta. The rolled digits are aria-hidden with a single text value beside them. Good and bad changes carry an arrow and a sign as well as colour. Reduced motion swaps digits in place and jumps the cursor home.",
  responsive: "Auto-fit tiles separated by hairlines; one column under 560px. Touch scrubbing keeps vertical scrolling.",
  touchFallback: "Press and drag along the line; lift to return to today.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sss-bad #b4372a; --sss-bg #fffdf8; --sss-dim rgb(27 26 23 / 0.2); --sss-focus #2f5fd0; --sss-good #1f7a4d; --sss-ink #1b1a17; --sss-line rgb(27 26 23 / 0.1); --sss-muted #6f6a62; --sss-plot #2f5fd0. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sss-bad #f08a7a; --sss-bg #141217; --sss-dim rgb(239 232 220 / 0.18); --sss-focus #b9cce4; --sss-good #7fd1a8; --sss-ink #efe8dc; --sss-line rgb(239 232 220 / 0.09); --sss-muted #9c96a1; --sss-plot #b9cce4. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
