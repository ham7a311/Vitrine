import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "period-overlay",
  name: "Period Overlay",
  category: "analytics",
  description: "This period against the last on the same axis: the current line solid over a soft area, the previous one dashed behind it, and the gap between them tinted green or red by which way it went. Scrub with the pointer or arrow keys to compare any day with its counterpart; switching between 7, 30 and 90 days morphs both lines into place.",
  tags: ["chart", "line", "comparison", "period", "analytics", "dashboard", "trend", "svg", "scrub", "kpi"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["PeriodOverlay.tsx", "period-overlay.css", "period.ts"],
  dependencies: [],
  prompt:
    "Build a chart card comparing this period with the previous one. Props: title, ranges [{id, label, versus (e.g. \"previous 30 days\"), current[], previous[], labels[], previousLabels[]}], initial, format and theme.\n\nHeader: the title small and muted, the period total large and tabular with a chip showing the change from the previous total (an arrow icon and a signed percentage, green up or red down, on a 14% tint), and a line under it reading \"vs previous 30 days · 31,840\". On the right, a segmented radiogroup of ranges (7D, 30D, 90D). A legend under it: a solid key for this period and a dashed one for the previous.\n\nChart (SVG, 248px tall, its width from a ResizeObserver): a y-axis from 0 to a round maximum above 108% of the data, chosen so its four steps are round (1, 2, 2.5, 3, 4, 5, 6 or 8 × a power of ten each), with four hairline gridlines and compact labels (1.2k); x labels at the first, middle and last points. Between the two lines, each segment's gap is filled with the up colour at 10% where this period is ahead and the down colour at 12% where it's behind. Under the current line, an area fading from 24% to 0. The previous line is a 1.6px dashed muted stroke; the current line a 2.2px stroke in the series colour. Both lines are smooth monotone cubics (Fritsch–Carlson tangents) so they never overshoot the data.\n\nScrubbing: pointer movement (and a press, for touch) picks the nearest index; a dashed crosshair and a dot on each line appear, and a dark tooltip (inverted surface) shows both days with their values and the change. The plot is focusable: ← and → step, Home and End jump, Escape clears, and a polite live region reads the point aloud. Switching range morphs: both arrays are resampled to the new length, then eased (cubic out, 600ms) to the new values while the axis maximum eases too; reduced motion swaps at once.\n\nTwo themes, night and paper, each with its own surfaces and chart colours; text always uses the ink and muted tokens.",
  interaction: "Point at or tab into the chart to compare any day with its counterpart; arrow keys step, Home/End jump, Escape clears. Switch the range to morph the lines.",
  animation: "Range changes morph both lines and the axis over 600ms (cubic out). Reduced motion swaps them instantly.",
  a11y: "The plot is a labelled, focusable group with a summary of the total and the change; scrubbing is keyboard-operable and announced in a polite live region. Direction is shown by arrows and signs as well as colour; the range switch is a radiogroup.",
  responsive: "The chart follows its container's width (down to 260px); the header wraps and the range switch drops under the total on narrow screens.",
  touchFallback: "Pressing and dragging on the chart scrubs; the tooltip stays until you tap elsewhere.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --po-card #121317; --po-cur #3987e5; --po-down #ff8a7a; --po-ink #f2f3f5; --po-line rgba(255, 255, 255, 0.08); --po-muted #9a9ca4; --po-prev #858996; --po-seg rgba(255, 255, 255, 0.06); --po-tip #f2f3f5; --po-tip-ink #0a0b0e; --po-up #5fd39a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --po-card #ffffff; --po-cur #2a78d6; --po-down #c2392a; --po-ink #111318; --po-line rgba(16, 18, 24, 0.09); --po-muted #5b5e66; --po-prev #8a8d96; --po-seg rgba(16, 18, 24, 0.05); --po-tip #111318; --po-tip-ink #ffffff; --po-up #13804a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0a0b0e", mode: "center", height: 460 },
};
