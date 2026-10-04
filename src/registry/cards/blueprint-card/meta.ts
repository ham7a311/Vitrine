import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "blueprint-card",
  name: "Blueprint Card",
  category: "cards",
  description: "A spec card drawn like a technical drawing: frame, dimension lines and callouts trace themselves in, and hovering a spec lights its leader.",
  tags: ["card", "specs", "svg", "draw-in", "technical", "scroll"],
  traits: ["scroll", "hover", "keyboard"],
  source: "original",
  files: ["BlueprintCard.tsx", "blueprint-card.css"],
  dependencies: [],
  prompt: `Design a specification card as an engineering blueprint. The card is deep navy with a faint 20px graph-paper grid and a 6px radius. When 35% of it enters the viewport (IntersectionObserver, once), its linework draws itself in a sequence: the title-block frame first (a rect plus two rules, 1.1s and 0.7s with a 0.8s delay, using stroke-dasharray/dashoffset on pathLength=1 with vector-effect: non-scaling-stroke), then every stroke in the supplied drawing (1.4s, symmetric ease), then numbered callout leaders scale in from the right, staggered 120ms apart.

Below the drawing is a spec table in a mono face: numbered circular badges, small-caps keys in a dim blue, values in pale blue, dashed row dividers. Hovering or focusing a row lights its callout leader on the drawing bright white and highlights the row, so the table and drawing are visibly linked. Under reduced motion everything is simply drawn.`,
  interaction: "Draws once on scroll into view. Hover/focus a spec row to highlight its callout leader.",
  animation: "Frame 1.1s, rules 0.7s (+0.8s), drawing 1.4s (+0.5s), leaders 0.5s staggered from 1.6s.",
  a11y: "The drawing and leaders are aria-hidden; the specs are a real <dl> in the DOM, and rows are focusable so the linked highlight works from the keyboard. Reduced motion shows the finished drawing.",
  responsive: "Fluid up to 26rem; the drawing keeps its 16:10 aspect.",
  touchFallback: "Draw-in is scroll-triggered; the row highlight works on tap-focus.",
  preview: { bg: "#050b14", mode: "fill", height: 640, frame: [560, 420] },
};
