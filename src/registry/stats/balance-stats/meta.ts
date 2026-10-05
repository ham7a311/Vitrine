import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "balance-stats",
  name: "Balance Stats",
  category: "stats",
  description: "Money in against money out, on a real balance. Coins worth a fixed sum drop into the two pans one at a time; every landing knocks the beam, which swings and settles at the angle the difference asks for, and a needle at the pivot reads it. Change month and coins lift away or fall in.",
  tags: ["stats", "comparison", "balance", "income", "expenses", "physics", "finance"],
  traits: ["scroll", "click", "keyboard"],
  source: "original",
  files: ["BalanceStats.tsx", "balance-stats.css"],
  dependencies: [],
  prompt: `Build a two-quantity comparison drawn as a physical balance scale, in SVG (viewBox 520 × 292).

Props: months ({ label, left, right }), names (two pan labels), coin (value per coin), currency, title.

Drawing: a curved foot and post; a beam (rounded rect, ±168 from the pivot) that rotates about the pivot; a pivot cap; a small dial arc with five ticks behind the pivot and a needle that turns 2.2× the beam angle in the opposite direction. Each pan hangs from a beam end: three chain strings to a shallow dish, with a coloured lip — categorical slot 3 (aqua) for the left pan and slot 2 (orange) for the right — and it is translated (never rotated) to the end's position each frame, so the pans always hang level.

Coins: each pan draws every coin it could hold in any month (max(round(value / coin))) as two stacked ellipses (edge and face) arranged as a small pyramid of columns six high. A coin is live when its index is below the pan's current count: live coins sit in place, the others are 90px above and transparent. Falling uses an ease-in curve (300ms, like gravity); leaving uses an ease-out lift (360ms).

Filling: once 35% of the panel is in view, counts step toward the month's targets one coin every 85ms, always moving whichever pan is further from done, so the beam rocks as it fills. Switching month (a radiogroup) steps toward the new targets the same way.

Beam: target angle = clamp((right − left) / (left + right) × 90°, ±14°), from the coins currently in the pans. A lightly damped spring (k 38, ζ 0.32) with an extra velocity kick of 0.6 × the change each time the target moves, so every coin visibly knocks it; the loop stops once it is at rest.

Header: the difference in large tabular figures, green with + for a surplus and red with − for a shortfall (sign and word as well as colour), and "surplus/shortfall in Sep". Legend: each pan's name and exact amount with its colour key, and "1 coin = OMR 500". The SVG has role=img with a sentence summary, plus a hidden table of every month. Paper and Night; reduced motion fills instantly with no swing.`,
  interaction: "Scroll in to fill the pans; switch Jul, Aug and Sep to watch coins move and the beam find its new rest.",
  animation: "Coins every 85ms, falling 300ms ease-in, lifting 360ms ease-out; beam on a lightly damped spring (k 38, ζ 0.32) knocked by each coin.",
  a11y: "The scale is role=img with a one-sentence summary that updates with the month; the months are a radiogroup; a hidden table holds every value. Surplus or shortfall is said in words and with a sign, not just colour. Reduced motion shows the settled scale.",
  responsive: "The SVG scales to its column; the legend reflows into two columns on phones.",
  touchFallback: "Identical on touch — the month switch is the only control.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bal-bg #fbf8f2; --bal-coin #d9a63e; --bal-coin-edge #a87a1f; --bal-dish #e9e1d3; --bal-focus #1f4e8c; --bal-ink #1b1a17; --bal-l #1baf7a; --bal-metal #9b8e7b; --bal-metal-hi #c9bda8; --bal-muted #6f6a62; --bal-neg #b4432f; --bal-pos #137a52; --bal-r #eb6834; --bal-rim rgb(27 26 23 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bal-bg #131312; --bal-coin #e2b04a; --bal-coin-edge #9a6e1a; --bal-dish #2a2723; --bal-focus #b3cdf6; --bal-ink #efe8dc; --bal-l #199e70; --bal-metal #6d665b; --bal-metal-hi #9b927f; --bal-muted #9c968c; --bal-neg #f08a74; --bal-pos #5fc996; --bal-r #d95926; --bal-rim rgb(239 232 220 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f0ece4", mode: "fill" },
};
