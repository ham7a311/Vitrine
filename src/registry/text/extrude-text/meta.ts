import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "extrude-text",
  name: "Extrude",
  category: "text",
  description: "Poster letters with real depth: every letter is a stack of thin slices darkening toward the back, so turning the word shows solid sides. It sways on its own, turns to face the pointer on a spring, and pops its letters forward one by one when clicked.",
  tags: ["3d", "extrude", "extruded text", "poster", "depth", "tilt", "spring", "playful", "text animation"],
  traits: ["cursor", "click", "ambient"],
  source: "original",
  files: ["ExtrudeText.tsx", "extrude-text.css"],
  dependencies: [],
  prompt: `Build a 3D extruded word ("MUSCAT", Hanken Grotesk 900, clamp(4rem, 17vw, 12.5rem), uppercase, tight tracking) inside a button.

Geometry: each letter is an inline-block with transform-style: preserve-3d containing 28 absolutely positioned copies (slices) at translateZ(−t × 0.34em) for t = 0…1, coloured color-mix(in oklab, sideNear, sideFar t%), plus a front face at translateZ(0.5px) filled with a 170° gradient (highlight → face) via background-clip:text. The word sits in a sway wrapper (CSS: rotateY −16° ↔ 16°, rotateX 8° ↔ 2°, 7s alternate) and an inner turn wrapper whose rotation follows the pointer on a spring (k 120, ζ 0.62, up to ±30° Y and ±22° X) in a rAF loop that stops when settled; the sway pauses while the pointer is over it. perspective 900px on the button (the parent of the 3D tree). A blurred elliptical floor shadow slides opposite the turn.

Click or Enter: each letter animates (WAAPI) translateZ(0.5em) translateY(−0.08em) and back with a small overshoot, 720ms, 70ms apart. A visually hidden h2 carries the word; the 3D spans are aria-hidden; the button is labelled. Reduced motion: a fixed three-quarter angle, no sway, spring or pop.`,
  interaction: "Move the pointer to turn the word; click or press Enter to pop the letters.",
  animation: "Pointer spring (k 120, ζ 0.62); 7s CSS sway; pop 720ms with 70ms stagger.",
  a11y: "A visually hidden heading carries the word and the 3D layers are aria-hidden; the pop is a real button with a label and a focus ring. Reduced motion holds a fixed angle.",
  responsive: "Font size is fluid (17vw), so the word always fits one line.",
  touchFallback: "Tap pops the letters; dragging turns it.",
  variants: [
    { id: "tomato", label: "Tomato", prompt: "palette=\"tomato\": face #ff5a36 with highlight #ff8a5c, sides #d93a1c → #6e1606, on a cream page (#f3ead8)." },
    { id: "cobalt", label: "Cobalt", prompt: "palette=\"cobalt\": face #2350ff with highlight #5f84ff, sides #1736c4 → #06125a, on a sky-blue page (#c9e4ff)." },
    { id: "mint", label: "Mint", prompt: "palette=\"mint\": face #7cf2c2 with highlight #c2ffe6, sides from #3fbf8f deepening, on a near-black ink page (#0f1513)." },
  ],
  preview: { bg: "#f3ead8", mode: "fill" },
};
