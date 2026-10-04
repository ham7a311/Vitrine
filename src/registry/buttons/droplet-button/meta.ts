import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "droplet-button",
  name: "Droplet Button",
  category: "buttons",
  description: "A pill whose arrow is a drop of the button itself: hover and it pulls out of the end, stretching a neck that thins and snaps like water; click and it flies off while a new drop wells up.",
  tags: ["button", "liquid", "goo", "metaball", "svg filter", "arrow", "cta"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["DropletButton.tsx", "droplet-button.css"],
  dependencies: [],
  prompt:
    "Build a pill button with its arrow in a round well at the right end. Draw the pill and a circular drop of the same colour together inside one layer filtered by an SVG goo filter: feGaussianBlur (stdDeviation 6) → feColorMatrix boosting alpha (22, −10) → feComposite atop the source. Shapes that are close melt into each other with a liquid neck.\n\nThe drop starts inside the pill's end, under the arrow. On hover or focus, translate the drop and the arrow 3.75rem to the right on a springy curve (720ms, cubic-bezier(0.34,1.35,0.64,1)). The goo filter stretches a neck between pill and drop, thins it and snaps it, leaving the drop hanging just beside the pill with the arrow inside. On leave it drifts back more slowly (900ms) and merges. The button reserves room on the right so the drop is always inside its hit area. On click, the drop accelerates away (+5rem, shrinking and fading), then a new drop wells up from the pill's end (scale 0.2 → 1) and pulls out again.",
  interaction: "Hover or focus to pull the drop out; leave to let it merge back; click to send it off.",
  animation: "Pull-out 720ms spring; merge 900ms ease; click sequence 980ms.",
  a11y: "A real button whose text is its label; the drop, pill and arrow are aria-hidden decoration. Focus pulls the drop out and rings the pill. Reduced motion keeps the drop still.",
  responsive: "Intrinsic width from its label, with fixed room for the drop on the right.",
  touchFallback: "A tap sends the drop off; there's no hover state.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
