import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "latency-heatmap",
  name: "Latency Heatmap",
  category: "analytics",
  description: "Every request in a day, by when it happened and how long it took: time across, latency up a log scale, each cell shaded by how many requests landed there, with the p50, p95 and p99 traced through it and the target drawn across. Point at a cell to read it; drag, or Shift and the arrow keys, to select a region and count what's in it.",
  tags: ["chart", "heatmap", "latency", "percentiles", "observability", "performance", "devops", "analytics", "svg", "histogram"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["LatencyHeatmap.tsx", "latency-heatmap.css", "latency.ts"],
  dependencies: [],
  prompt:
    "Build a latency heatmap card. Props: title, columns [{label, counts[] — requests per latency bucket, lowest first}], edges (bucket edges in ms, one more than the buckets, log-spaced), slo (a target in ms), and theme.\n\nHelpers (pure functions): log-spaced edges between two latencies; the latency at a percentile from a histogram, found by walking the cumulative counts and interpolating on the log scale inside the bucket where it crosses; the requests in a rectangle of columns and buckets (either corner order) with their share of all requests in those columns; and a 0–1 shade for a count on a log scale (log1p(v) / log1p(max)), so quiet cells still show.\n\nHeader: the title, then a line with the day's total and its overall p50, p95 and p99 (from all columns merged). On the right, three toggle chips (aria-pressed) with line keys to show or hide each percentile line.\n\nChart (SVG, 300px tall, width from a ResizeObserver): one rect per column and bucket with a 1px gap and 1.5px corners, filled from a five-step blue sequential ramp — the lowest step is barely off the card for empty cells — by mixing the two neighbouring steps in oklab (color-mix) at the cell's shade. A log y-axis labelled at 3, 10, 30… ms and 1 s, 3 s; time labels along the bottom about every eighth column. Percentile lines run through the column centres: p50 in the ink colour, p95 orange, p99 a dashed aqua, each labelled with its last value at the right edge. The target is a dashed red line labelled \"Target 400 ms\".\n\nInteraction: pointing at a cell outlines it and shows a tooltip (\"14:30 · 160–230 ms\", \"1,284 requests · 9.8% of the slot\"). Pressing and dragging selects a rectangle (dashed outline, faint fill); the footer reads the count, the time and latency ranges and the share of traffic in those columns, with a Clear button. The plot is focusable: arrows move a cell cursor, Shift + arrows extend a selection from where it started, Escape clears. The footer also shows the ramp from Fewer to More.\n\nTwo themes, night and paper, each with its own ramp and line colours.",
  interaction: "Point at a cell to read it; drag to select a region and count it; toggle the percentile lines. Keyboard: arrows move, Shift + arrows select, Escape clears.",
  animation: "None beyond quick hover states — it's a reading tool.",
  a11y: "The plot is a labelled, focusable group whose label gives the total and overall percentiles; cells, selections and the region count are reachable by keyboard, and the count is in a polite live region. Percentile lines differ by dash and label as well as colour.",
  responsive: "The grid stretches to its container (down to 300px) and time labels thin out on narrow screens; the header wraps.",
  touchFallback: "Dragging a finger selects a region (the plot doesn't scroll the page while you do); tapping a cell reads it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --lh-card #121317; --lh-ink #f2f3f5; --lh-line rgba(255, 255, 255, 0.08); --lh-muted #9a9ca4; --lh-p50 #f2f3f5; --lh-p95 #ff9a5c; --lh-p99 #3fd6a0; --lh-r0 #1a1d24; --lh-r1 #184f95; --lh-r2 #2a78d6; --lh-r3 #5598e7; --lh-r4 #b9d6f7; --lh-sel #ffffff; --lh-slo #ff8a7a; --lh-tip #f2f3f5; --lh-tip-ink #0a0b0e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --lh-card #ffffff; --lh-ink #111318; --lh-line rgba(16, 18, 24, 0.09); --lh-muted #5b5e66; --lh-p50 #111318; --lh-p95 #c4501f; --lh-p99 #0e7a55; --lh-r0 #f0efea; --lh-r1 #b7d3f6; --lh-r2 #6da7ec; --lh-r3 #2a78d6; --lh-r4 #133f7a; --lh-sel #111318; --lh-slo #c2392a; --lh-tip #111318; --lh-tip-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0a0b0e", mode: "center", height: 500 },
};
