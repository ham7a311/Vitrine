import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "eclipse-event-card",
  name: "Eclipse Event Card",
  category: "cards",
  description: "An editorial event plate with an oversized date and an orbital eclipse bleeding in from the right, alive with slow drift.",
  tags: ["card", "event", "svg", "editorial", "ambient", "cursor"],
  traits: ["cursor", "hover", "ambient"],
  source: "original",
  files: ["EclipseEventCard.tsx", "eclipse-event-card.css"],
  dependencies: [],
  prompt: `Design a wide, editorial "next event" card on a warm near-black surface (10px radius, hairline border). A top chrome bar holds two amber pill badges (category; status with a small dot). Below, a 12-column grid: a giant date on the left (72px medium-weight tabular day with -0.04em tracking, amber mono month/year, mono weekday) and on the right a semibold headline (28ch max), a lead paragraph, an optional "in collaboration with" line and an amber Register button. The footer is a label/value meta grid whose hairline seams come from 1px gaps.

The right side of the card is an oversized orbital-eclipse artwork (SVG, 640×400 viewBox, clipped by the card): a black elliptical core with a faint gold limb, sitting inside a copper-to-rose radial wrap with a film-grain overlay (feTurbulence at 3.5% alpha). Around it, a family of thin tilted elliptical orbits — some dashed in irregular rhythms via pathLength=100 — in gold, copper and dusty rose at 7–48% opacity. Two groups of orbits drift on 22s and 28s loops (±1.4° rotation, a few px of travel). A short bright dash (6/94 dash array) with a blurred twin travels the "hot" orbit every 18s. Behind it all, a breathing gold atmosphere (16s) and a blurred bloom (18s).

A horizontal scrim fades the surface from solid (left 55%) to transparent (75%), so the copy column (max 55% width) sits on calm ground while the eclipse bleeds in. The artwork layers parallax toward the pointer (±7px, 900ms), and on hover a gain variable multiplies their brightness by 1.16, lifts the hot orbit to 68% and tints the border amber. On narrow cards the eclipse sinks to the bottom-right corner and the extra orbits are dropped.`,
  interaction: "Pointer position parallaxes the atmosphere and bloom; hover or focus-within raises every artwork layer's brightness via a single --eclipse-gain variable.",
  animation: "Atmosphere breathe 16s, bloom glow 18s, orbit drift 22s/28s, travelling signal 18s linear. Hover transitions 500–550ms, parallax 900ms.",
  a11y: "Semantic <article> with <h3>, a <dl> for metadata and a real link for the CTA. The whole artwork is aria-hidden. Reduced motion freezes every loop.",
  responsive: "Container queries: stacked below 56rem, 3/9 grid above; below 40rem the eclipse moves to the corner and the copy column widens to 78%.",
  preview: { bg: "#0c0b0a", mode: "fill", frame: [1040, 780], height: 640 },
  featured: true,
};
