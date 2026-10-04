import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "arrival-cta",
  name: "Arrival CTA",
  category: "ctas",
  description: "A closing call to action that feels like reaching a destination — a route descends onto a gold node, then everything rises in.",
  tags: ["cta", "section", "closing", "reveal", "svg", "draw-in"],
  traits: ["scroll", "hover"],
  source: "original",
  files: ["ArrivalCta.tsx", "arrival-cta.css"],
  dependencies: [],
  prompt: `Design the final section of a landing page as an arrival. On pure black, centre a narrow column (42rem). At the top, a short hand-drawn route line (an S-curve SVG path in amber) draws itself downward over 1.4s with a symmetric ease (cubic-bezier(0.65,0,0.35,1)) and ends on a small gold node that pops in from 40% scale at 1.25s — the end of a journey that other sections on the page might have been tracing.

Then the content rises in sequence (opacity 0 → 1, 16px → 0, 600ms ease-out-expo, staggered 60ms): a mono uppercase eyebrow with a short leading rule; a 600-weight headline whose final phrase switches to an italic serif; a muted lead paragraph; two actions — an amber primary with an ↗ arrow that nudges up-right on hover, and a secondary with a translucent light border on a dark surface; and finally a "focus areas" row of tiny mono pill tags. Everything triggers once, when a quarter of the section is visible.

Anchor the bottom of the section with a wide plate (2688:1080 aspect) whose top is crisp and whose base fades out via a mask — here a generated line-drawn horizon of ridges catching a soft amber glow, replaceable with any image. The section reserves exactly the plate's height as bottom padding so text never lands on it.`,
  interaction: "Plays once on scroll-in. Buttons: amber brightens with a glow, arrow nudges; secondary border and surface lift.",
  animation: "Route draw 1.4s, node pop 0.5s @ 1.25s, content rise 0.6s staggered by 60ms (0–240ms).",
  a11y: "Semantic <section> with <h2>, real links, and a list of tags. Route and plate are aria-hidden. Reduced motion shows the final state immediately.",
  responsive: "Container queries: actions stack full-width below 36rem; headline scales with cqi units; the plate scales with width.",
  touchFallback: "Scroll-triggered, so identical on touch.",
  preview: { bg: "#000000", mode: "scroll", frame: [1040, 780], height: 720 },
};
