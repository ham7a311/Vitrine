import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "orbit-card",
  name: "Orbit Card",
  category: "cards",
  description: "Profile cards where hovering sends a swarm of coloured dots orbiting the border, in an endless draggable marquee.",
  tags: ["card", "team", "marquee", "hover", "offset-path", "profile"],
  traits: ["hover", "touch", "keyboard"],
  source: "original",
  files: ["OrbitCard.tsx", "orbit-card.css"],
  dependencies: [],
  prompt: `Design a compact team card (288×104px, 10px radius, near-black surface, hairline border) showing a name (medium, -0.015em tracking) and a two-line muted role. Each person has a unique signature colour.

On hover or keyboard focus, seven small glowing dots in that colour (4–6px, each with a soft glow of the same hue) begin travelling around the card's rounded border. Use CSS offset-path: inset(0 round 10px) and animate offset-distance to 100%, each dot with its own duration (3.55–5.1s) and a negative delay so they're already spread around the edge when they appear — like electrons around a nucleus. The animation stays paused and the dots invisible until hover, then they fade in over 400ms and start moving. At the same time the border mixes 55% toward the person's colour.

The cards can also be presented in an endless strip: a rAF loop drifting 30px/s (22px/s on mobile) that pauses while a card is hovered or focused, stops when offscreen, and has pager buttons plus arrow keys that step exactly one card with a 480ms ease-out-cubic tween. Touch users can swipe: a drag past 45% of a card's width steps in that direction. Duplicated sets are aria-hidden. Edges fade out with a horizontal mask. Under reduced motion, show a static grid with no orbit.`,
  interaction: "Hover/focus a card to start its orbit; the marquee pauses underneath you. Pager buttons, arrow keys and swipe step one card.",
  animation: "Dots: offset-distance loop at 3.55–5.1s each, 400ms fade-in. Marquee: 30px/s drift, 480ms ease-out-cubic steps.",
  a11y: "Cards are focusable articles; duplicate loop copies are aria-hidden and untabbable. Pager buttons have labels. Region is labelled and arrow keys work while focus is inside.",
  responsive: "Fixed-size cards, fluid marquee. Mobile drift slows to 22px/s, and below 640px the pager arrows sit under the track instead of over the cards. Reduced motion swaps to a 1/2/4-column grid.",
  touchFallback: "Orbit is hover-only (fine pointers); on touch the marquee is swipeable and cards show their static border.",
  promptAllow: ["cards"],
  variants: [
    { id: "marquee", label: "Marquee", prompt: "Marquee: six cards in the endless drifting strip described above (OrbitMarquee with label \"Team\"), with pager buttons, arrow keys and swipe." },
    { id: "single", label: "Cards", prompt: "Cards: two standalone OrbitCards side by side (wrapping on narrow screens) with no drifting strip — just the hover/focus orbit on each card." },
  ],
  preview: { bg: "#0c0b0a", mode: "fill", frame: [880, 660] },
};
