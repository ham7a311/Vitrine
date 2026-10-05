import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "swatch-card",
  name: "Swatch Card",
  category: "cards",
  description: "A product card for a glazed cup where choosing a colour glazes it the way a potter does: the new glaze runs down from the rim over the old and stops short of the bare clay foot.",
  tags: ["card", "product", "e-commerce", "swatches", "colour", "variant picker", "shop"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["SwatchCard.tsx", "swatch-card.css"],
  dependencies: [],
  prompt:
    "Build a two-column product card for a handmade cup (Bahla Pottery, 'Finjan cup, 90 ml'). On the left, the cup drawn in SVG on a soft plinth of light tinted by the current glaze. The cup has a body in bare red clay and a foot ring; the glaze covers the body only above an uneven dip line (a clip path), as hand-dipping leaves it, and lines the inside of the rim. One lighting layer (a horizontal gradient plus a long specular stroke and a rim highlight) sits over everything, so every glaze is lit identically.\n\nOn the right: maker in mono caps, a serif title, the glaze name tinted by the glaze, a sentence about how it's made, then a radiogroup of glossy round swatches (radial-gradient highlights; a ring on the chosen one; a diagonal line through a sold-out one; arrow keys move and select).\n\nChoosing a glaze lays a second cup layer in the new colour over the current one and reveals it from the rim downward with clip-path inset(0 0 100% 0) → inset(0) over 1.1s, ease-in-out: the glaze runs down and stops at the dip line, never covering the foot. When it lands, it becomes the base coat. The glaze name and price ('OMR 7.250') rise into place; stock reads '14 in stock', 'Only 3 left' in an accent, or 'Sold out in this glaze', and the button changes to 'Tell me when it's back'. Stacks to one column under 560px.",
  interaction: "Choose a glaze with a click or the arrow keys; the cup is glazed in the new colour from the rim down. Add to bag, or ask to be told when a sold-out glaze is back.",
  animation: "Glaze runs down over 1.1s; the plinth tint follows over 900ms; name and price rise in 520ms.",
  a11y: "Swatches are a labelled radiogroup with roving tabindex and names like 'Copper lustre, sold out'. The glaze name is announced politely when it changes. The cup drawings are decorative. Reduced motion swaps the glaze instantly.",
  responsive: "Two columns side by side; one column under 560px of container width, with a wider, shorter stage.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --swc-bg #fbf9f4; --swc-focus #2f5fd0; --swc-ink #1d1b17; --swc-line rgb(29 27 23 / 0.1); --swc-low #b4541f; --swc-muted #736c62. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --swc-bg #16151a; --swc-focus #b9cce4; --swc-ink #efe8dc; --swc-line rgb(239 232 220 / 0.1); --swc-low #f0b37a; --swc-muted #9c96a1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efebe3", mode: "fill" },
};
