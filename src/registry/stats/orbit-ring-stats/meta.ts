import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "orbit-ring-stats",
  name: "Orbit Ring Stats",
  category: "stats",
  description: "Ring gauges drawn in a slowly turning gradient: the arcs sweep in on scroll, the metric's name orbits each ring in small caps and slows when you look, and hover pours the colour in from the arc's head until the number inverts.",
  tags: ["stats", "kpi", "ring", "gauge", "progress", "conic", "orbit", "textpath"],
  traits: ["scroll", "hover", "ambient"],
  source: "original",
  files: ["OrbitRingStats.tsx", "orbit-ring-stats.css"],
  dependencies: [],
  prompt: `Build a row of ring gauges (13rem dials), each a role="meter".

Register --v (number, the share) and --a (angle) with @property. The arc is one element whose background is a conic gradient turning with --a (14s loop, offset per ring), masked by two intersected masks: conic-gradient(#000 calc(v × 360deg), transparent 0) for the share and a radial ring 12px thick. Give it a round start cap that samples the same gradient (a 12px dot with the gradient's full-size background offset to the top of the ring), and a bright bead with a face-coloured halo that rides the head, rotated by v × 360deg. A faint full track sits under it.

On scroll-in (IntersectionObserver, once) --v transitions to its value over 1.8s (ease-out, 180ms stagger) and the centre number rolls in from 0 with digit reels.

Around the outside, the metric's name and goal ('DESK UTILISATION · GOAL 75% ·') run round an SVG circle path as a textPath, repeated and spread with textLength to exactly one lap, so a plain rotation of the group loops seamlessly. One requestAnimationFrame loop rotates every orbit at 7°/s, easing to 0.8°/s for the hovered ring so you can read it; it pauses offscreen.

Hover floods the centre: a second copy of the centre with an inverted ink colour and a blurred, toned copy of the gradient behind it is revealed by clip-path: circle() growing from the arc's head (x = 50% + 50%·sin(v·1turn), y = 50% − 50%·cos(v·1turn)), so the number inverts exactly where the colour has reached. Night and Paper.`,
  interaction: "Scroll the row in to draw the arcs. Hover a ring to slow its orbiting words and flood its centre.",
  animation: "Arc 1.8s ease-out with a 180ms stagger; digits roll 1.6s; gradient turns every 14s; orbit 7°/s easing to 0.8°/s; flood 720ms.",
  a11y: "Each dial is a role=\"meter\" with its value; the drawn number, orbit words and flood are aria-hidden, and the label and note are real text. Reduced motion shows the final arcs, still words and a short flood fade.",
  responsive: "Auto-fit columns; under 560px a 2×2 grid of 10.25rem dials, and one column under 360px.",
  touchFallback: "No flood or slow-down on touch; the arcs, numbers and orbit still play.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ors-bead #fffaf1; --ors-face #141217; --ors-ink #efe8dc; --ors-muted #9c96a1; --ors-on-ink #141216; --ors-orbit rgb(239 232 220 / 0.5); --ors-ring conic-gradient(from var(--ors-a), #b9cce4, #c8b9ea, #f0b37a, #7fd1a8, #b9cce4); --ors-tone rgb(20 18 23 / 0.08); --ors-track rgb(239 232 220 / 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ors-bead #fffdf8; --ors-face #fffdf8; --ors-ink #1b1a17; --ors-muted #6f6a62; --ors-on-ink #1b1a17; --ors-orbit rgb(27 26 23 / 0.5); --ors-ring conic-gradient(from var(--ors-a), #2f5fd0, #7c5cc4, #d9733a, #1f7a4d, #2f5fd0); --ors-tone rgb(255 253 248 / 0.6); --ors-track rgb(27 26 23 / 0.07). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
