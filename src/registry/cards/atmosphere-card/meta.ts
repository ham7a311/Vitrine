import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "atmosphere-card",
  name: "Atmosphere Card",
  category: "cards",
  description: "Smoked-glass link cards: colour pooled in the corners, slow contour currents underneath, a field that leans toward you.",
  tags: ["card", "link", "ambient", "cursor", "gradient", "parallax"],
  traits: ["cursor", "hover", "ambient"],
  source: "original",
  files: ["AtmosphereCard.tsx", "atmosphere-card.css"],
  dependencies: [],
  prompt: `Design a row of three link cards that feel like smoked glass with weather inside. Present them in a single rounded container with 1px gaps so the hairline dividers are just the background showing through.

Each card has one muted accent (violet, cyan or teal) and is built from six stacked, pointer-events-none layers:
1. Atmosphere — oversized (inset −28%) radial gradients that pool colour in the bottom-left and top-right corners plus a faint diagonal wash, breathing on a slow 19–25s loop (tiny translate, 5% scale, 1.2° rotation), each card out of phase.
2. Bloom — inset box-shadows that glow up from the bottom edge and in from one side.
3. Field — an SVG of four thin contour "currents" (0.55–0.95px strokes at 14–34% opacity) drawn as long cubic curves, each drifting on its own 18–25s loop. Violet curves tangle, cyan curves run in parallel bands, teal curves cross. The whole field parallaxes toward the pointer by up to ±5px (normalised pointer position in CSS variables, 850ms ease).
4. Quiet — a dark radial scrim behind the top-left, so the copy always sits in calm shade.
5. Presence — a soft accent spotlight centred at the pointer, fading in on hover (550ms).
6. Ring — an inset 1px accent ring that appears on hover.
Content: a 40px icon tile that tints and glows in the accent on hover, a medium label with an ↗ that fades in, and a short faint description. Motion is always slow; nothing snaps.`,
  interaction: "Pointer position drives the parallax field and spotlight; hover/focus deepens the atmosphere, shows the ring and tints the icon.",
  animation: "Breathing 19–25s, currents 18–25s (offset delays), parallax 850ms, spotlight 550ms, surface/ring 450ms.",
  a11y: "Each card is a real <a>. All atmospheric layers are aria-hidden. Focus-visible triggers the same state as hover plus an inset outline.",
  responsive: "Stacks to one column below 640px, where two of the four currents are dropped for calm and performance.",
  touchFallback: "Without a pointer the field rests at its default lean (78%, 82%) and the ambient motion carries the card.",
  preview: { bg: "#0c0b0a", mode: "fill", frame: [960, 720] },
  featured: true,
};
