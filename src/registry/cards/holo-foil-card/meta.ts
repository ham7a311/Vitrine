import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "holo-foil-card",
  name: "Holo Foil Card",
  category: "cards",
  description: "A founding-member card printed on holographic foil: tilt it and the rainbow slides across engraved foil lines, strongest at steep angles, glitter catches and goes, and a glare follows the light. Click to turn it over to a signature panel and a foil seal.",
  tags: ["card", "holographic", "foil", "tilt", "3d", "membership", "collectible", "flip", "glare"],
  traits: ["hover", "cursor", "click", "keyboard"],
  source: "original",
  files: ["HoloFoilCard.tsx", "holo-foil-card.css"],
  dependencies: [],
  prompt: `Build a holographic membership card (5:7, 300px, radius 20) inside a button that flips it.

3D: the card has transform-style preserve-3d and rotateX/rotateY from CSS variables; front and back faces are backface-hidden (the back pre-rotated 180°). A rAF spring (k 170, ζ 0.72) eases tilt toward the pointer (±15°) and a second spring (k 90, ζ 0.7) turns the card 0 ↔ 180° on click; the loop stops when settled. The pointer position (0–100%) also drives --px/--py (mirrored on the back), and --hyp (0–1, how steep the tilt is; a registered number).

Front layers: the finish's base with a soft light at the pointer; foil — a repeating 115° rainbow gradient at 260% size whose position follows the pointer, colour-dodge blended, masked to fine 135° engraved lines and fading toward the edges, its opacity 0.18 + 0.62·hyp so it blooms at steep angles; glitter — three offset grids of tiny white points that shift at different rates (so they twinkle) masked to an ellipse around the light; content (italic serif logo, number, an emblem, "Founding member", the name in serif, "Since 2026 · Muscat"); the emblem is an SVG mask (a compass ring with two peaks) filled with its own faster rainbow, saturating with the tilt; a glare (radial white at the pointer, overlay); and an inner edge highlight. Back: a dark stripe, a signature panel, terms, and a conic foil seal.

The button's label states the name, number and which side is showing (aria-pressed for flipped). A soft floor shadow shrinks while held. Reduced motion: no springs (direct, smaller tilt; the flip is instant).`,
  interaction: "Move the pointer over the card to tilt it and move the light; click or press Enter/Space to turn it over.",
  animation: "Tilt spring k 170 ζ 0.72; flip spring k 90 ζ 0.7; foil, glitter and glare follow the pointer through CSS variables.",
  a11y: "A real button with a full label and aria-pressed; the visual layers are aria-hidden. Reduced motion removes the springs.",
  responsive: "The card is min(300px, 78vw) wide and keeps its 5:7 proportion.",
  touchFallback: "Drag a finger across it to tilt; tap to flip.",
  promptAllow: ["rainbow"],
  variants: [
    { id: "rainbow", label: "Rainbow", prompt: "finish=\"rainbow\": a pale pearl base so the rainbow foil reads at full colour (the pearl uses multiply so the foil stays visible on a light card)." },
    { id: "gold", label: "Gold", prompt: "finish=\"gold\": a warm gold base; the foil and glitter shimmer over metallic gold." },
    { id: "obsidian", label: "Obsidian", prompt: "finish=\"obsidian\": a near-black glossy base; the foil blooms brightest against the dark." },
  ],
  preview: { bg: "#e6e3ec", mode: "fill" },
};
