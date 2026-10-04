import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lenticular-card",
  name: "Lenticular Card",
  category: "cards",
  description: "Two images interleaved behind ribbed plastic, like a lenticular print — tilt it and the stripes hand over from one to the other.",
  tags: ["card", "flip", "3d", "cursor", "drag", "before-after"],
  traits: ["cursor", "touch", "keyboard"],
  source: "original",
  files: ["LenticularCard.tsx", "lenticular-card.css"],
  dependencies: [],
  prompt: `Design a two-state card that behaves like a lenticular print instead of a flip card. Stack two full-bleed faces (e.g. a poster at dawn and the same poster at night) in a 3:4 card with 18px radius and a deep shadow.

Mask both faces with the same fine vertical stripe pattern (6px pitch) using repeating-linear-gradient masks driven by one CSS variable --t: in every stripe, the front owns the first (1 − t) of the pitch and the back owns the rest. At t = 0 you see only the front, at t = 1 only the back, and in between the two images interleave in thin slivers — exactly the ghosted handover of a real lenticular. Over the top, add ribbed plastic: a repeating highlight-and-shadow gradient per stripe in overlay blend, and a broad band of sheen that slides across the ribs as the card tilts.

Map the pointer's x position to --t through a smoothstep across the middle third, so the handover happens as you "turn" the card past centre; tilt the card ±9° with the pointer and shift the two faces a few pixels in opposite directions for parallax. On touch, drag horizontally to turn it and it settles to the nearest side on release; on keyboard, arrow keys or Enter/Space turn it with a 500ms settle. Screen readers are told which side is showing.`,
  interaction: "Pointer x (or horizontal drag, or ←/→/Enter) turns the card; the stripes hand over between the two faces across the middle band.",
  animation: "Continuous while tracking; 500ms ease-out-expo settle on leave, release or key press.",
  a11y: "Focusable group with a descriptive label that states the visible side; the hidden face is aria-hidden. Arrow keys and Enter/Space work. Reduced motion removes tilt and sheen (the stripe handover itself is the content, so it stays).",
  responsive: "Fluid up to 20rem at a fixed 3:4 ratio; stripe pitch is a prop.",
  touchFallback: "Horizontal drag turns the card and snaps to the nearest side; vertical scrolling still works (touch-action: pan-y).",
  preview: { bg: "#0b080d", mode: "fill", height: 600 },
};
