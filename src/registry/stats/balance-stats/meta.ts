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
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f0ece4", mode: "fill" },
};
