import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "split-bar-stats",
  name: "Split Bar Stats",
  category: "stats",
  description: "A breakdown in one bar. Point at a share and it springs wider while its neighbours give way; its colour floods in from the side you came from and the label inverts along the edge. Switch month and year and the shares slide while the numbers roll.",
  tags: ["stats", "breakdown", "budget", "share", "stacked bar", "legend", "invert"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["SplitBarStats.tsx", "split-bar-stats.css"],
  dependencies: [],
  prompt: `Build a spending breakdown: a big total with a Month/Year radiogroup, one tall bar of shares, and a legend.

The bar is a flex row with 3px gaps; each share's flex-grow is its percentage, transitioned with a springy curve (640ms, cubic-bezier(0.34,1.36,0.64,1)), so changing one share moves its neighbours. At rest each segment is a pale tint of its colour (color-mix 20%) with ink text: the name and a large percentage. Hovering a segment (or focusing its legend entry) raises its flex-grow to max(1.25 × share, 24) so even a small share has room for its label.

Each segment is printed twice; the second copy has the full colour and inverted ink and is revealed with clip-path: inset(), wiping in from the side the pointer crossed (left or right half on pointerenter) and draining out toward the side it leaves — so the label inverts exactly along the moving edge. When the entry side changes, jump the hidden fill to the new side with transitions off for two frames before lighting it, so the wipe always starts from the right place.

The total, percentages and legend amounts are digit reels keyed from the right; switching period re-flows the bar and rolls every number (700ms, 40ms stagger). Legend entries are buttons named with the amount and share, linked both ways to the bar (the bar itself is aria-hidden). Paper and Night.`,
  interaction: "Hover a segment or a legend entry to open it up; switch Month/Year to re-flow the bar.",
  animation: "Width spring 640ms with overshoot; colour wipe 560ms from the entry side; numbers roll 700ms.",
  a11y: "The legend carries the data as buttons with full accessible names, and focusing one opens its segment; the drawn bar is aria-hidden. The period switch is a radiogroup with arrow keys. Reduced motion jumps widths and numbers and swaps colours instantly.",
  responsive: "Fills its container; the legend auto-fits and becomes two columns under 560px.",
  touchFallback: "Tap a legend entry to open its segment.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sbs-bg #fffdf8; --sbs-focus #2f5fd0; --sbs-ink #1b1a17; --sbs-muted #6f6a62; --sbs-on #fffdf8; --sbs-rim rgb(27 26 23 / 0.1); --sbs-tint 20%. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sbs-bg #141217; --sbs-focus #b9cce4; --sbs-ink #efe8dc; --sbs-muted #9c96a1; --sbs-on #141217; --sbs-rim rgb(239 232 220 / 0.1); --sbs-tint 24%. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
