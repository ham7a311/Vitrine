import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "depth-card",
  name: "Depth Card",
  category: "cards",
  description: "A destination card that is a little diorama: tilt it and the sky, ridges and foreground slide past each other at different speeds.",
  tags: ["card", "parallax", "3d", "tilt", "travel", "illustration", "svg", "depth"],
  traits: ["cursor", "hover", "keyboard"],
  source: "original",
  files: ["DepthCard.tsx", "depth-card.css"],
  dependencies: [],
  prompt: `Build a destination card (21rem, 4:5, 24px radius, one link) that works like a diorama. The picture is an SVG landscape built in layers — a sky gradient, a sun with a soft glow, far ridges, mid ridges, a near ridge with a small village on the rim, and a foreground of rocks and a palm — each layer in its own group. Pointer position over the card (−1…1 on both axes) is smoothed on a spring (stiffness 0.09, damping 0.78) and written to --px/--py; each layer translates opposite the pointer by its depth (4px for the sun up to 46px for the foreground, 60% as much vertically), the whole card tilts in perspective (±7° Y, ±6° X), a soft-light highlight follows, and the text block drifts a little the other way. Leaving springs it back. The scene is drawn 6% oversize so edges never show. The text sits on a bottom gradient: a frosted badge, an Instrument Serif title and a meta line. The loop sleeps once settled; reduced motion keeps it flat.`,
  interaction: "Move across the card to tilt it and open up the layers; leave and it settles.",
  animation: "Spring stiffness 0.09, damping 0.78; layer travel 4–46px by depth; tilt ±7°.",
  a11y: "One link with a real heading; the illustration is aria-hidden. Reduced motion keeps the card still.",
  responsive: "Fills narrower screens up to 21rem and keeps its 4:5 shape; the SVG crops to cover.",
  touchFallback: "No tilt on touch; the card is a normal tappable link.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Dusk: a violet-to-apricot sky (#2b1b4a → #f29b6b), pale gold sun, ridges stepping from mauve (#a8607a) through plum to near-black violet, warm white text." },
    { id: "day", label: "Day", prompt: "Day: a clear blue-to-white sky (#7cb9ef → #e9f3fa), pale sun, ridges stepping from sand (#c9a27a) through ochre to dark brown, warm white text." },
  ],
  preview: { bg: "#120b18", mode: "fill", height: 620 },
};
