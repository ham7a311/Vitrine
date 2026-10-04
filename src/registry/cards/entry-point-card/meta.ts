import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "entry-point-card",
  name: "Entry Point Card",
  category: "cards",
  description: "A case-study card whose colour blooms from the exact point your cursor crossed its edge and drains toward where you leave; every word inverts precisely along the circle.",
  tags: ["card", "case study", "portfolio", "link", "direction-aware", "clip-path", "text-reveal"],
  traits: ["hover", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["EntryPointCard.tsx", "entry-point-card.css"],
  dependencies: [],
  prompt:
    "Build a case-study link card (20px radius, hairline ring) with a client and year in mono caps, a balanced 1.5rem title, a muted summary, a ruled footer with one big result ('+38%' / 'completed bookings in 3 months') and a round arrow, and small tag pills.\n\nRender the whole content twice in identical boxes: once on the card, and once inside a full-size fill layer (deep plum on paper, frost on night) with inverted colours, achieved by overriding the colour custom properties on the fill. Clip the fill with clip-path: circle(0% at var(--ex) var(--ey)). On pointerenter, write the entry point as percentages of the card to --ex/--ey and open the circle to 150% over 820ms on an expo-out curve; on pointerleave, move the point to where the pointer exits and close it on an ease-in curve (560ms), so the colour drains toward the side you left through. Because both copies line up exactly, the letters invert along the edge of the moving circle. The card lifts 3px while open. Keyboard focus blooms from the centre; touch blooms from the finger on press.",
  interaction: "Enter from any side and the colour blooms from there; leave and it drains to the exit. Tab to it and it blooms from the centre.",
  animation: "Bloom 820ms expo-out; drain 560ms ease-in; lift 520ms.",
  a11y: "One real link per card; the inverted copy is aria-hidden so the content is read once. Focus shows the filled state plus an outline. Reduced motion makes the bloom instant.",
  responsive: "Cards sit in an auto-fit grid (min 17rem) and stack on phones; titles balance.",
  touchFallback: "The colour blooms from your finger when you press.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
