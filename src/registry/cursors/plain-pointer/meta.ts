import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "plain-pointer",
  name: "Plain Pointer",
  category: "cursors",
  description: "Just the arrow. A crisp dark arrow with softly rounded corners, a white keyline and a soft shadow, drawn exactly where the pointer is — no glow, no trail, no lag. One consistent cursor for a page, and nothing more.",
  tags: ["cursor", "pointer", "minimal", "custom cursor", "arrow", "simple"],
  traits: ["cursor"],
  source: "original",
  files: ["PlainPointer.tsx", "plain-pointer.css"],
  dependencies: [],
  prompt: `Build the simplest possible scoped custom cursor: one drawn arrow, nothing else.

The host is position:relative with an aria-hidden, pointer-events:none layer over its children. Only under (hover: hover) and (pointer: fine) does it get data-live, which sets cursor:none on the host and every descendant (!important); text fields get cursor:auto back and the drawn arrow fades out over them (120ms). The arrow is a 32px SVG (viewBox 0 0 32 32) of a fat arrowhead with every corner rounded — vertices tip (2,2), (37.04,13.56), notch (19.1,19.1), (13.56,37.04) rounded with arcs of 2 at the tip and 3 at the outer corners and in the notch: M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z — filled near-black with a white keyline (stroke-width 3.8 beneath the fill via paint-order: stroke, about 1.9px visible), a 0.6px grey outline shadow and a 1px/1.5px drop shadow; a light variant swaps fill and keyline for dark pages. The rounded tip apex (3.73, 3.73) is the hotspot. Position it in the pointermove handler with translate3d, in host-local pixels corrected by rect.width / offsetWidth. Pressing scales it to 0.9 from the tip. No animation loop, no glow, no trailing.`,
  interaction: "Move over the page; press to see the arrow nudge smaller.",
  animation: "None beyond a 120ms press scale and a 120ms fade at the host's edge.",
  a11y: "The arrow is aria-hidden and pointer-events:none; focus and focus styles are untouched; fields keep the system caret. Reduced motion removes the press and fade transitions.",
  responsive: "Host-scoped, corrected for scaled hosts.",
  touchFallback: "Coarse pointers draw nothing and keep the system cursor.",
  variants: [
    { id: "light", label: "Light" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#ffffff", mode: "fill" },
};
