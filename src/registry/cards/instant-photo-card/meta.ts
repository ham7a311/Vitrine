import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "instant-photo-card",
  name: "Instant Photo",
  category: "cards",
  description: "A print that develops in your hand: it comes out a murky brown-grey, the darks come up first, then the colour floods in until the evening is all there. Shake it — drag it about — and it develops faster, swinging as you go; then a caption is written along the bottom in pen.",
  tags: ["card", "photo", "polaroid", "instant", "develop", "nostalgic", "drag", "illustration", "memory"],
  traits: ["click", "touch", "ambient"],
  source: "original",
  files: ["InstantPhotoCard.tsx", "scenes.tsx", "instant-photo-card.css"],
  dependencies: [],
  prompt: `Build an instant-photo card that develops.

Card: a figure styled as an instant print — warm off-white paper with a subtle radial sheen, 16px borders with a deeper bottom for the caption, a soft lifted shadow, rotated −3°. The photo is a square hand-built SVG scene with role="img" and a real alt text; a gloss gradient lies over it.

Developing: a --dev value goes 0 → 1 over ~6.5s in a rAF loop (it starts when the card is 40% in view and stops when done). The scene's filter is contrast(0.35 + 0.65·min(1, 1.6·dev)) saturate(1.43·max(0, dev − 0.3)) brightness(0.55 + 0.45·dev) sepia(0.6·(1 − dev)) — so the darks come up first, then the colour — and a murky brown-grey layer fades out with (1 − dev)^1.5.

Shake: dragging the card (pointer capture, touch-action none) moves it a little (clamped ±60/±40px, drifting back when let go), kicks a rotational spring (k 90, c 9) with the horizontal speed, and adds to a "shake" level that multiplies the development rate up to 4× and decays. When it's done, the caption is revealed left to right by a clip-path sweep in an italic serif in blue pen, slightly rotated, and the date fades in. A polite status line reads "Developing… shake it to hurry it along" then "Developed"; "Take another" ejects a fresh print (slide-in) and develops it again. Reduced motion: developed and captioned at once.`,
  interaction: "Watch it develop; drag it about to shake it faster; Take another for a fresh print.",
  animation: "Development ~6.5s (up to 4× faster when shaken); swing spring k 90 c 9; caption written over 1.6s.",
  a11y: "The scene has descriptive alt text, the caption is real text in a figcaption, and the status is announced politely. Reduced motion shows the finished print.",
  responsive: "The print is min(300px, 80vw) wide; the SVG scales with it.",
  touchFallback: "Drag with a finger to shake it (touch-action: none on the print only).",
  variants: [
    { id: "corniche", label: "Corniche", prompt: "scene=\"corniche\": the Mutrah corniche at dusk — the fort on its hill, a dhow under sail and the sun setting on the water; caption \"Mutrah, staying out late\"." },
    { id: "desert", label: "Desert", prompt: "scene=\"desert\": golden dunes at sunset with a small camel caravan along a ridge; caption \"Wahiba — Sami fell off twice\"." },
    { id: "night", label: "Night", prompt: "scene=\"night\": old Muscat at night under a full moon, warm windows and a minaret against the hills; caption \"Muscat from the roof, 2am\"." },
  ],
  preview: { bg: "#cbbb9b", mode: "fill" },
};
