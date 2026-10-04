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
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
