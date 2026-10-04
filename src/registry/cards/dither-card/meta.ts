import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-card",
  name: "Dither Card",
  category: "cards",
  description: "A project card whose picture waits as a coarse one-bit print and resolves on hover — finer and finer dots, then colour — while its meta line types in.",
  tags: ["card", "dither", "dithered", "portfolio", "project", "hover", "pixel", "1-bit"],
  traits: ["hover", "keyboard", "canvas"],
  source: "original",
  files: ["DitherCard.tsx", "dither-card.css", "../../media/dither-portrait/dither.ts", "../../media/art-gallery/studies.ts"],
  dependencies: [],
  prompt: `Build a portfolio project card (22.5rem wide, 14px radius, hairline border) that is one link. The top is a 4:3 picture shown as a one-bit Atkinson-dithered print in the card's ink and paper colours; under it an Instrument Serif title with a mono year, a mono uppercase meta line and "Read the case study →".

Prepare five prints of the same picture up front, at dither cells of 6, 4, 3, 2 and 1 px (each a tiny canvas drawn up with image-rendering: pixelated). On hover or focus, step through them every 95ms, so the dots get visibly finer, then fade in the full-colour picture over 420ms; a small mono badge reports the current state ("1-BIT · 4PX", "COLOUR"). Meanwhile the meta line types itself in at 22ms per character behind a block caret, the card lifts 3px with a soft shadow, and the arrow nudges 4px. Leaving steps back down to the coarse print faster (60ms per step). The picture defaults to a generated canvas study; pass an image URL to use your own.`,
  interaction: "Hover or focus the card to resolve the print from coarse dots to colour; leave to drop it back.",
  animation: "Print steps every 95ms (60ms on the way back), colour fade 420ms, meta typing 22ms per character, lift 400ms.",
  a11y: "The whole card is one link with a visible focus ring; the full meta text is always available to screen readers while the typed copy is aria-hidden. Reduced motion jumps straight between the print and the colour picture with no typing.",
  responsive: "Width is min(100%, 22.5rem); prints are prepared at a fixed size and scaled, so they stay crisp on any screen.",
  touchFallback: "On touch, focus (tap) resolves the picture; a second tap follows the link.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#e9e3d6", mode: "fill", height: 620 },
};
