import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stratum-button",
  name: "Stratum",
  category: "buttons",
  description: "A face resting on three glassy plates that fan out away from your cursor, deeper layers further, then squeeze flat on press.",
  tags: ["button", "layers", "depth", "cursor", "directional", "glass"],
  traits: ["cursor", "hover", "click"],
  source: "original",
  files: ["StratumButton.tsx", "stratum-button.css"],
  dependencies: [],
  prompt: `Design a button that reveals it is made of layers. The visible face is a dark plum rounded rectangle (56px, 12px radius) with a hairline cream border and a faint top sheen. Directly behind it, in the same grid cell, sit three paper-thin translucent plates with their own hairline borders — frost blue, lilac and cream, each at low opacity with a whisper of backdrop blur.

At rest the plates hide exactly behind the face. When the cursor moves over the button, compute the vector from the pointer to the button's centre — the direction the stack is being pushed — and write it to two CSS variables. Each plate translates along that vector by a third, two thirds and all of a 9px spread respectively, while the face shifts a touch the other way, so the stack fans out on the side opposite your fingertip, like a deck of cards under pressure. Plates follow with a 520–560ms ease-out-expo and 25ms stagger per layer, so the motion reads as depth rather than one block sliding. The plates brighten on hover.

Pressing squeezes everything flat in 140ms and sinks the face to 98.5%. Keyboard focus fans the stack gently down-right with a frost outline. On touch devices, the plates rest slightly fanned so the layered idea is visible without hover.`,
  interaction: "Pointer position sets the fan direction continuously; leaving collapses the stack; press squeezes it flat.",
  animation: "Plates 560ms ease-out-expo with 0/25/50ms stagger; face 520ms; press 140ms.",
  a11y: "A real <button>; plates are aria-hidden decoration. Focus-visible shows the fanned state plus an outline. Reduced motion makes transitions instant.",
  responsive: "Intrinsic width with a 10rem minimum; spread is a prop.",
  touchFallback: "Plates rest in a slight fan on devices without hover.",
  preview: { bg: "#0b080d", mode: "fill" },
};
