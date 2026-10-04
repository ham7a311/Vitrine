import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ring-flood-card",
  name: "Ring Flood Card",
  category: "cards",
  description: "Plan cards with a gradient looping round each border; choose one and its face draws in from every side until the gradient floods the whole card.",
  tags: ["card", "pricing", "plan picker", "radio", "border", "gradient", "conic"],
  traits: ["hover", "click", "keyboard", "ambient"],
  source: "original",
  files: ["RingFloodCard.tsx", "ring-flood-card.css"],
  dependencies: [],
  prompt:
    "Build a plan picker from three cards that behave as one radiogroup. Each card's own background is a conic gradient (frost, lilac, amber, mint on night; cobalt, violet, orange, green on paper) whose angle is registered with @property and turns once every 10s. A ::before 'face' in the surface colour sits inset 1.5px, so at rest each card shows only a thin gradient ring.\n\nHover an unchosen card: the face's inset grows to 3px so the ring thickens, and a copy of the gradient masked to a soft frame (two linear-gradient masks fading in from the edges) fades in at ~20% so the colour bleeds a little way inward.\n\nChoose a card (click, Space/Enter, or arrow keys, which move and select): its face draws in from every side to the centre (inset 1.5px → 50%, 760ms ease-in-out) and fades at the end, so the gradient floods the card. The text crosses to ink as the colour arrives; on paper a 60% cream tone under the face washes the saturated gradient toward pastel so ink still reads. The card lifts 4px with a long soft shadow. The card you leave grows its face back over the gradient. Content: plan name, an optional mono badge, a large tabular price, a muted line, a ruled list of features with checks, and a radio dot reading 'Choose' / 'Your plan'.",
  interaction: "Hover to bleed the ring's colour inward; click or use the arrow keys to choose a plan, which floods it with the gradient.",
  animation: "Gradient turns every 10s; ring thickens in 760ms; flood is 760ms ease-in-out with the text colour following 260ms later.",
  a11y: "A radiogroup of role=radio cards with roving tabindex, named by the plan and described by its line. Arrow keys, Home and End move and select; Space and Enter select. The flooded state changes text colour with the fill so contrast holds. Reduced motion stops the loop and crossfades the flood.",
  responsive: "Cards sit in an auto-fit grid (min 15.5rem) and stack to one column on phones.",
  touchFallback: "Tap to choose; the flood is the confirmation.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
