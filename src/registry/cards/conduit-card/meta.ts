import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "conduit-card",
  name: "Conduit Card",
  category: "cards",
  description: "A square card set in the path of a beam of light that pours down from above, spreads across its top edge and runs out of the bottom, with circuit traces carrying pulses in from either side.",
  tags: ["card", "feature", "beam", "light", "glow", "circuit", "svg", "dark", "fintech"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["ConduitCard.tsx", "bell.ts", "conduit-card.css"],
  dependencies: [],
  prompt: `Build a feature card staged inside a beam of light (React + SVG + CSS, no libraries).

Scene: a 4:3 frame (max 1200px wide; at least 680px wide on phones, with the sides cropping) on a near-black page with a faint radial wash of the halo colour and a dozen fixed, twinkling stars. Type sizes come from the frame width (20px at 1200px, never under about 11px).

Beam: one SVG in a 1200 × 900 viewBox draws a beam pouring from the top edge into the card's top edge, and a mirrored one from the card's bottom edge to the floor. Each is a closed "bell" path whose half-width is w0 + flare / (distance-to-the-card + soft), a thread far away that spreads like liquid on contact, in three layers: a wide halo-colour fill blurred 30, a lighter mid fill blurred 6 and a thin white core blurred 1.4. Two broad halo-colour blooms (blurred 60) sit where the beams strike the card. The beams flicker gently (opacity 0.86–1 over 2.8s, out of phase) and brighten on hover.

Circuit traces: eight 1.6px polylines with 45° bends come in from the left and right edges to the card's sides, at 50% opacity, each with a short bright dash (dasharray 60/940 on a pathLength of 1000) running along it every 5.5s.

Card: 37.9% × 49.8% of the frame, centred just below the middle, radius 1.75em, filled with a vertical gradient (darker edge tone at top and bottom, the main tone through the middle) and a slightly lighter centre, a soft light pool at its lower left and a fine 135° hatch at 2.8% white. A 3px masked ring carries white light along the top edge (fading in from the left), down the first part of the right edge and along the bottom; a blurred copy of the ring makes the glow. At the top right, an original hatched bolt mark at 32% of the ink colour. At the bottom left: a mono index ("01", 0.6em), a light 1.6em title and a 0.7em muted two- or three-line description. Hover lifts the card a little. Reduced motion stops the flicker, pulses and twinkle. Props: index, title, children (the description), tone {card[2], halo, trace, ink, muted, page}.`,
  interaction: "Hover lifts the card and quickens the beam; otherwise it plays on its own. The card holds a real heading and paragraph.",
  animation: "Beam flicker 2.8s alternate (1.4s on hover); trace pulses every 5.5s; stars twinkle over 4s; card lift 0.5s.",
  a11y: "The scene SVG is aria-hidden; the card is an article with a heading and paragraph. Light text on the deep card stays above 7:1 for the title and 4.5:1 for the description. Reduced motion stops every loop and hides the pulses.",
  responsive: "Keeps a 4:3 frame; below 680px the frame stays 680px wide and crops at the sides so the card and its text stay legible.",
  touchFallback: "No hover lift on touch; the beam and pulses run on their own.",
  isNew: true,
  variants: [
    { id: "violet", label: "Violet", prompt: "Card #3524ab with #2a1d88 edges, halo #7c5cff, traces #3f33b8, ink #ece8ff, muted #a198e6, page #07071a." },
    { id: "cyan", label: "Cyan", prompt: "Card #0f5d8f → #0b3f6b, halo #2fc8ff, traces #1d6fb0, ink #e6f8ff, muted #8fc6e3, page #05111c." },
    { id: "rose", label: "Rose", prompt: "Card #8c1f5e → #5f1442, halo #ff5fa8, traces #a8306f, ink #ffe8f3, muted #e39cbf, page #14050d." },
  ],
  preview: { bg: "#0a0a1f", mode: "fill", height: 640 },
};
