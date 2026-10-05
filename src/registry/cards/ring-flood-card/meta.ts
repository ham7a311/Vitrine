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
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rfc-face #141217; --rfc-focus #efe8dc; --rfc-ink #efe8dc; --rfc-lift 0 30px 60px -32px rgb(0 0 0 / 0.85); --rfc-muted #9c96a1; --rfc-on-ink #141216; --rfc-on-muted rgb(20 18 22 / 0.7); --rfc-ring conic-gradient(from var(--rfc-a) at 50% 50%, #b9cce4, #c8b9ea, #f0b37a, #7fd1a8, #b9cce4); --rfc-tone rgb(255 255 255 / 0.06). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rfc-face #fffdf8; --rfc-focus #2f5fd0; --rfc-ink #1b1a17; --rfc-lift 0 30px 50px -34px rgb(60 40 20 / 0.45); --rfc-muted #6f6a62; --rfc-on-ink #1b1a17; --rfc-on-muted rgb(27 26 23 / 0.72); --rfc-ring conic-gradient(from var(--rfc-a) at 50% 50%, #2f5fd0, #7c5cc4, #d9733a, #1f7a4d, #2f5fd0); --rfc-tone rgb(255 253 248 / 0.62). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
