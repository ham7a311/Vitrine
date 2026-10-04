import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "fan-deck-card",
  name: "Fan Deck",
  category: "cards",
  description: "A stack of cards that behaves like a hand of them: at rest a tidy pile; reach for it and it fans out in an arc so you can see every card, the one you're over lifting; pick one and it comes up out of the hand and tucks in on top. Swipe or use the arrow keys to deal through.",
  tags: ["cards", "deck", "stack", "fan", "carousel", "hover", "swipe", "travel", "itinerary"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["FanDeckCard.tsx", "fan-deck-card.css"],
  dependencies: [],
  prompt: `Build a deck of five itinerary cards (5:7, 250px, art on top, mono meta, serif title, a blurb shown only on the top card) that behaves like a hand of cards.

Each card is a button absolutely stacked in the same box; its place in the pile i (0 = top) is a CSS variable, z-index n − i. Rest: a loose pile — translateY(5px·i) and a small alternating rotation (±1.5°·i). When the pointer enters the deck (or focus enters it) it fans: every card rotates by (0.5 − i/(n−1))·46° (top card to the right, deeper cards to the left so their corners and titles show) around a transform-origin far below the cards (50% 160%), so they spread on an arc like a hand; the card under the pointer lifts (translateY −48px, scale 1.03, a deeper shadow), the ones behind dim slightly. Transitions are 520ms with a slight overshoot.

Picking a card (click, or Enter on the focused top card's neighbours via the arrows): it lifts clear of the hand (translateY −110px, −4°, z-index on top, 230ms), the order changes so it's on top, and it tucks back down into the pile while the others re-fan. Swipe left/right on the deck (≥40px within 600ms) or arrow keys deal to the next/previous card; ← → buttons under the deck do the same, with a polite live "Wadi Shab · 2 of 5". The top card is the only tabbable one and is aria-current; others are labelled "Bring … to the top". Themes: paper and night. Reduced motion: instant reordering, no transitions.`,
  interaction: "Hover to fan the cards, click one to bring it to the top; swipe, arrow keys or the ← → buttons to deal through them.",
  animation: "Fan and settle 520ms with a slight overshoot; lift 230ms then tuck.",
  a11y: "A labelled section of buttons; only the top card is in the tab order, arrows deal, and the current card is announced politely.",
  responsive: "Cards are min(250px, 62vw) wide; the fan's spread is angular, so it fits narrow screens.",
  touchFallback: "Swipe across the deck to deal; tap a card to bring it up.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#ede6da", mode: "fill" },
};
