import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "percentile-curve-stats",
  name: "Percentile Curve",
  category: "stats",
  description: "Where you sit among everyone else. A distribution curve shows how a number is spread; your marker drops onto it and the share of people you're ahead of fills in and counts up. Drag the marker to ask what if; switch metric and the curve reshapes into the new distribution.",
  tags: ["stats", "distribution", "percentile", "comparison", "curve", "slider", "personal"],
  traits: ["scroll", "click", "keyboard", "touch"],
  source: "original",
  files: ["PercentileCurveStats.tsx", "percentile-curve-stats.css"],
  dependencies: [],
  prompt: `Build a percentile panel: a distribution curve with "you" on it, in SVG (viewBox 640 × 240).

Metrics: { label, unit, min, max, step, you, lowerIsBetter?, density(x), people }. For each, sample the density at 72 evenly spaced points across [min, max], normalise to peak 1, and build a cumulative distribution by the trapezoid rule, normalised to 1. Every metric uses the same 72 sample positions, so curves can morph point by point.

Drawing: the curve is a Catmull-Rom spline through the samples, written as cubic Béziers, with a 2px stroke over a faint area fill; round axis ticks (a 1, 2, 2.5 or 5 × 10ⁿ step giving four to six) with tabular labels and the unit on the last. The share you beat is the same area, clipped by a rect from the marker to the right end (when lowerIsBetter, i.e. people slower than you) or from the left end to the marker (people below you), in the accent at about 26% — a single hue, slot 1 blue. The marker is a 2px accent stem from the baseline up to the curve, a 7px dot with a surface-coloured ring, and a dark pill tag "You · 21 min" sized to its text and clamped inside the plot.

Motion, in one rAF loop that sleeps when idle: when 40% is in view the dot falls from above onto the curve on an under-damped spring (k 120, ζ 0.42), and the shaded area and the headline percentage fade and count up with it. Switching metric (a tablist with arrow-key roving) morphs the sampled heights from whatever is on screen to the new shape over 650ms (ease-in-out cubic), while the marker slides to your value on that metric on a spring (k 160, ζ 0.8). The loop reads the current metric and values from a ref, so it never chases stale state.

What-if: the SVG is role=slider (min, max, now, valuetext "21 min, faster than 79% of Muscat commuters"). Dragging (pointer capture, touch-action pan-y, snapped to the step) or Arrow keys, PageUp/PageDown (a tenth of the range) and Home/End move it, and the marker follows exactly; the headline becomes "At 30 min: faster than 45% of …" and a "Back to you" button appears. The headline reads "Faster than" when lowerIsBetter, else "More than". Paper and Night.`,
  interaction: "Scroll in to drop your marker. Drag along the curve (or use the arrow keys) to try other values; switch Commute time, Daily steps and CO₂ saved.",
  animation: "Drop on a spring (k 120, ζ 0.42) with the percentage counting up; curve morph 650ms ease-in-out; marker slide on a spring (k 160, ζ 0.8).",
  a11y: "The plot is a slider whose value text says the value and the percentile in words; the metrics are a tablist with roving focus; the headline is real text. Reduced motion places everything at once with no drop, morph or slide.",
  responsive: "The SVG scales to its column; the headline wraps on narrow screens.",
  touchFallback: "Drag horizontally on the curve; vertical swipes still scroll the page (touch-action: pan-y).",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f1eee7", mode: "fill" },
};
