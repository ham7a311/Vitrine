import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gel-toggle",
  name: "Gel Toggle",
  category: "controls",
  description: "A switch whose thumb is a drop of gel: it stretches as it leaves, squashes when it lands, and the track fills behind it with a wobbling meniscus.",
  tags: ["toggle", "switch", "gooey", "jelly", "settings", "svg filter", "css", "playful"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["GelToggle.tsx", "gel-toggle.css"],
  dependencies: [],
  prompt: `Build a toggle switch (<button role="switch" aria-checked>, 84×44px) whose thumb behaves like a drop of gel, in CSS plus one SVG filter. The thumb is two white circles — a head (34px) and a slightly smaller tail — inside a layer filtered by a goo filter (feGaussianBlur 4 → feColorMatrix alpha row "0 0 0 22 −10"), with a soft drop shadow after it. Switching moves both with translate, but the head leaves first (380ms) and the tail follows later and slower (520ms, 70ms delay), so while they travel the filter draws a gooey bridge between them and the drop visibly stretches; when the head lands it plays a squash keyframe (1.12 × 0.86 → 0.94 × 1.06 → 1). Two identical keyframes alternate on each switch, so the squash replays without remounting.

Under the drop, the track (pale grey with an inset shadow) fills with the accent colour from the left on a springy curve (cubic-bezier(0.3,1.25,0.4,1)); the fill's leading edge is a rounded bulge that wobbles (a short stretch-and-settle keyframe) as it arrives, like a meniscus. A crisp highlight outside the filter rides on the head, so the drop stays glossy. Controlled or uncontrolled, accent colour as a prop. Demo: a settings list with three switches in different accents.`,
  interaction: "Click, tap, Space or Enter flips the switch.",
  animation: "Head 380ms, tail 520ms with a 70ms delay; landing squash 560ms; fill 520ms springy with a 700ms meniscus wobble.",
  a11y: "A real switch with aria-checked and an accessible label (the row's visible text). Reduced motion removes the travel and squash.",
  responsive: "Fixed control size; sits at the end of settings rows at any width.",
  touchFallback: "Works the same on touch.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#efede8", mode: "fill", height: 440 },
};
