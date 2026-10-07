import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "aurora-foot-card",
  name: "Aurora Foot Card",
  category: "cards",
  description: "A dark feature card whose lower half catches fire with soft clouds of vivid colour rising into a white-hot band at the bottom edge, the colour spilling onto the page around it; the bloom climbs on hover.",
  tags: ["card", "feature", "gradient", "aurora", "glow", "blur", "dark", "fintech"],
  traits: ["hover", "ambient"],
  source: "original",
  files: ["AuroraFootCard.tsx", "aurora.ts", "aurora-foot-card.css"],
  dependencies: [],
  prompt: `Build a small feature card whose bottom half blooms with colour (React + CSS, no libraries).

Card: 15em × 19.4em (16px base), radius 1em, background from a dark tint of the variant's colour at the top to near-black #07070a by 55%, a faint white inner hairline. Behind it, a halo of the glow colour (an ellipse covering the lower three quarters and spilling 14% past each side, blurred 1.6em, 85% opacity) so the colour leaks onto the page.

Bloom (clipped to the card): a layer inset −6% −14% −10%, blurred 0.85em and saturated 1.25, holding five to seven elliptical blobs, each radial-gradient(closest-side, colour, colour 45%, transparent) placed by centre and size in percent. They sit in the lower half (centres 60–90% down), a muted accent may sit high in a corner, and a wide pale band is centred just past the bottom edge. Over the bloom, a sharper 'foot' (120% wide, 33% tall, its box reaching 11% below the edge, solid to 40%, a pale near-white, blurred only 0.55em, breathing over 6s) makes the bottom edge burn white-hot. Blobs churn on 10–15s alternate loops (translate ±5%, scale 0.94–1.1). On hover the whole bloom climbs 8% (the foot 6%), gets brighter and more saturated, and the page halo grows.

Content at the top (padding 0.95em 1em): a 1.75em icon tile (white 6% fill, hairline, a 1.7-stroke line icon), a bold 1.42em title wrapping to two lines (max 8.5em), a 0.7em muted line (#a3a5b5) and a bold underlined 0.66em "Learn more" link. Reduced motion stops the churn. Props: icon, title, children, action, href, look {glow, tint, blobs[]}.`,
  interaction: "Hover raises the bloom and widens the glow around the card; the link thickens its underline.",
  animation: "Blobs churn on 10–15s alternate loops; the hover climb eases over 0.8s and the halo over 0.6s.",
  a11y: "An article with a real heading, paragraph and link; bloom and halo are aria-hidden. The copy sits in the dark top half, above 7:1. Visible focus ring on the link. Reduced motion stops the churn.",
  responsive: "Fixed 15em width that shrinks to the container; it is meant to sit in a grid of two to four.",
  touchFallback: "No hover on touch; the bloom keeps churning slowly.",
  isNew: true,
  variants: [
    { id: "magenta", label: "Magenta", prompt: "Glow #c42bd8 over a #14163a tint: electric blue #3826ff and violet #7a2bff on the left, hot pink #ff1aa8 and #ff2a55 on the right, a muted rose high in the right corner, an ice-blue #bfe6ff spot and a white band along the bottom. Lock icon, 'Always guarded'." },
    { id: "lime", label: "Lime", prompt: "Glow #1ed84f over a #0c1a12 tint: green #11c94a, lime #8cff2a and acid yellow #f2ff4d through the middle, aqua #2fe0b4 on the right, pale mint and a white band at the bottom. Link icon, 'Pay by link'." },
    { id: "iris", label: "Iris", prompt: "Glow #5a3cff over a #0d0e24 tint: a tall violet #7a3cff on the right edge, royal blue #2b3dff and sky #4fc6ff low on the left, lavender #8a5cff on the right and a pale lilac band at the bottom. Trend icon, 'Built on best practice'." },
    { id: "ember", label: "Ember", prompt: "Glow #ff5a1a over a #1c0d07 tint: red #ff2a1a and orange #ff6a00 on the left, gold #ffd21a in the middle, amber #ff9a1a on the right, a dim brick red high in the right corner and a cream band at the bottom. Gauge icon, 'Fast across borders'." },
  ],
  preview: { bg: "#050506", mode: "center", height: 520 },
};
