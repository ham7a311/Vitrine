import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "isotype-stats",
  name: "Isotype Stats",
  category: "stats",
  description: "Counting in people, the way Neurath's Isotype charts did: each figure stands for a thousand riders, a row of figures is a quantity you can see at a glance, and the last figure is cut to what's left. Figures are stamped in row by row; switching the year stamps the gains and fades the losses.",
  tags: ["stats", "pictogram", "isotype", "chart", "people", "comparison", "transit"],
  traits: ["scroll", "hover", "click", "keyboard"],
  source: "original",
  files: ["IsotypeStats.tsx", "isotype-stats.css"],
  dependencies: [],
  prompt: `Build a pictogram (Isotype) stats panel: quantities as rows of identical figures, one figure per fixed unit.

Props: rows ({ label, note, values: { [period]: number } }), periods (ordered keys, the last shown first), unit (people per figure), noun, title, theme, motion.

Layout: a header with the period total in large tabular figures plus the change on the other period, and a radiogroup of periods. Each row is a three-column grid: label and note, the figures, and the value with its change (green up, red down, with a sign — never colour alone). Under 560px the figures drop to a full-width line below.

Figures: a simple standing person drawn as one SVG (a head circle and a body path), all in one ink. The figure row is a CSS grid of N equal columns, where N = ceil(max value across all rows and periods / unit), capped at 20px per figure, so one figure is the same quantity in every row and every period. Each slot's fill fraction f = clamp(value/unit − i, 0, 1). The last figure is cut to f with clip-path: inset(0 calc((1 − f) × 100%) 0 0), and a slot is only shown while f > 0.

Motion: when 30% of the panel is in view (IntersectionObserver, once), figures stamp in — opacity 0 → 1 and translateY(5px) scale(0.55) → none with an overshoot curve (380ms), delayed by row × 140ms + figure × 24ms, from the bottom. Switching period reuses the same transitions, so new figures stamp in at their place while lost ones fade and shrink, and the cut figure's clip animates. Hovering or focusing a row (tabIndex 0, with an aria-label that states the value and change) tints it, darkens its figures and lifts them 2px in a 12ms-per-figure ripple. A legend shows one figure = unit. A visually hidden table carries every value. Paper (navy figures) and Night (sky figures); reduced motion shows everything in place.`,
  interaction: "Scroll the panel in to stamp the figures; hover or Tab through the rows; switch 2024 / 2025 to see riders gained and lost.",
  animation: "Stamp 380ms with overshoot, 140ms per row and 24ms per figure; the cut figure's clip 380ms; hover lift 240ms rippling 12ms per figure.",
  a11y: "Rows are focusable with a full spoken summary (route, value, change). The period switch is a radiogroup. The figures are aria-hidden; a visually hidden table holds every number. Change is shown with a sign as well as colour. Reduced motion shows the figures without stamping.",
  responsive: "Figures share the row's width, so a figure is always one unit; under 560px the figures move to their own line.",
  touchFallback: "Rows highlight on tap focus; everything else works the same.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f1eee6", mode: "fill" },
};
