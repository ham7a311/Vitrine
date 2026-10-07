import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "rim-glow-card",
  name: "Rim Glow Card",
  category: "cards",
  description: "A dark glass tile lit from below: a thick rim of coloured light runs round its edge, brightest down the left and along the bottom, and a hot band rises from the bottom edge; the light climbs on hover.",
  tags: ["card", "feature", "glow", "rim", "neon", "glass", "dark", "gradient"],
  traits: ["hover", "ambient"],
  source: "original",
  files: ["RimGlowCard.tsx", "rim.ts", "rim-glow-card.css"],
  dependencies: [],
  prompt: `Build a square feature tile lit from below by a coloured rim (React + CSS, no libraries).

Tile: 19em square (16px base), radius 2.2em, clipped. A 0.22em transparent border shows a conic gradient (border-box) of the rim colour that is brightest along the bottom (the light tint at 180°), strong down the left (270–310°) and the bottom-right (140°), and fades almost to grey toward the top right (6% at 50°). The interior (padding-box) runs from a dark tint of the colour at the top through near-black #0a0a0c to the tint again at the bottom. Shadows: a coloured glow under the tile and off its left side, an inset 0.5em glow just inside the rim, and an inset glow in the top-left corner.

Band: the bottom 62% carries a vertical gradient from the light tint at the edge through the colour (7%) and fading colour (20%, 38%) to transparent by 62%, masked by a wide ellipse so it softens at the corners, blurred 0.35em and breathing from the bottom over 6s, so the bottom edge burns and the light rises into the dark.

Content at the top (padding 0.95em 1.15em): a 2.55em icon tile (dark, with a coloured hairline and glow, a 1.5-stroke white icon), a 1.9em regular-weight title, a 0.9em warm-grey line and a bold 0.8em link with an arrow that nudges right on hover. Hover lifts the tile slightly, stretches the band 18% higher and strengthens every glow. Reduced motion stops the breathing. Props: icon, title, children, action, href, tone {color, light, tint}.`,
  interaction: "Hover lifts the tile, raises the band of light and nudges the link's arrow.",
  animation: "Band breathes over 6s; hover glows ease over 0.5s and the band climbs over 0.7s; the arrow nudges with a small overshoot.",
  a11y: "An article with a real heading, paragraph and link; the band is aria-hidden. Copy sits in the dark top half, above 7:1. Visible focus ring on the link. Reduced motion stops the breathing.",
  responsive: "19em square that shrinks to its container while staying square; meant for a row of three.",
  touchFallback: "No hover on touch; the band keeps breathing.",
  isNew: true,
  variants: [
    { id: "amber", label: "Amber", prompt: "Rim #ff7a1a with a #ffc56b hot tint and a #1d0d06 interior tint; inbox icon, 'Morning Brief'." },
    { id: "azure", label: "Azure", prompt: "Rim #3d7bff with an #a9cfff hot tint and a #0a1026 interior tint; tools icon, 'Tested Tools'." },
    { id: "emerald", label: "Emerald", prompt: "Rim #29d96f with a #b9ffd2 hot tint and a #06190f interior tint; network icon, 'Field Notes'." },
  ],
  preview: { bg: "#111214", mode: "center", height: 480 },
};
