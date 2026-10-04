import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tide-gauge-stats",
  name: "Tide Gauge Stats",
  category: "stats",
  description: "A row of glass tubes that fill to each metric as they scroll in. The number floats on the rolling surface, half under water, and inverts exactly where the wave crosses it.",
  tags: ["stats", "kpi", "gauge", "meter", "water", "wave", "mask", "scroll"],
  traits: ["scroll", "hover", "ambient"],
  source: "original",
  files: ["TideGaugeStats.tsx", "tide-gauge-stats.css"],
  dependencies: [],
  prompt: `Build a row of KPI gauges drawn as tall glass tubes (7.25rem × 17rem, fully rounded), one per metric, each a role="meter".

Register --p (number), --x and --wave-height (lengths) with @property. On each tube, --top = (1 − p) × tube height is where the surface sits. Inside the tube render the number twice in the same place: once on the glass in ink, and once inside a 'water' layer whose background is the water colour and whose text is the inverted colour. Mask the water layer with two images — a seamless wave SVG (80px period, repeat-x) sized 80px × wave-height and positioned at (--x, --top − wave-height), plus a solid block sized 100% × (h − top) pinned to the bottom — so the print inverts exactly along the wave. Animate --x from 0 to 80px every 2.6s (each tube offset in phase). Add a paler back swell moving the other way.

The number rides the surface: top = clamp(0.85rem, --top − 0.46em, h − 1.45em), so it is always half under water, which makes the inversion the thing you read. Its digits are reels that roll from 0 to the value as the water rises.

An IntersectionObserver (35%) starts the fill once: --p transitions to value/max over 1.7s with a slight overshoot, staggered 160ms per tube, digits staggered 90ms per place. Optional target draws a dashed goal line with its value. Glass: a hairline rim, a vertical highlight and tick marks at quarters. Hovering a tube raises its swell. Label and note sit under each tube. Paper (teal water) and Night (frost water).`,
  interaction: "Scroll the row into view to fill the tubes; hover one to raise its swell.",
  animation: "Fill 1.7s with overshoot, 160ms stagger; digits roll 1.5s; surface rolls every 2.6s; swell 600ms.",
  a11y: "Each tube is a role=\"meter\" with min, max, value and a value text that includes the goal. The drawn numbers are aria-hidden duplicates; the label and note are real text. Reduced motion shows the final levels still, with no roll.",
  responsive: "Auto-fit columns; under 560px a 2×2 grid with shorter tubes.",
  touchFallback: "The swell stays at its resting height; everything else is the same.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
