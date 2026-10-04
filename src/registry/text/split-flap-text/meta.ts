import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "split-flap-text",
  name: "Split-Flap",
  category: "text",
  description: "A departures board that changes its mind the old way: every character is a real two-leaf cell that flips through the drum in order to reach its new letter, the light leaving each falling leaf, landing with a small bounce. Changes ripple across the board, and only the characters that change move.",
  tags: ["split flap", "solari", "departures", "board", "flip", "3d", "airport", "text animation"],
  traits: ["ambient"],
  source: "original",
  files: ["SplitFlapText.tsx", "split-flap-text.css"],
  dependencies: [],
  prompt: `Build a Solari split-flap board that cycles through "boards" (arrays of rows), e.g. airport departures: "WY 903  SALALAH    14:05" → "…GATE A4" → "…BOARDING".

Cells: one per character, padded to the longest row. Each cell is two static halves (top shows the next letter's top half, bottom the current letter's bottom half) plus a leaf hinged at the middle (transform-origin bottom, preserve-3d) with a front face (the old letter's top half) and a back face rotated 180° on X (the new letter's bottom half), both backface-hidden. A half is an overflow:hidden box 50% tall containing the glyph in a 200%-tall centred span (offset by −100% for bottom halves). A 1px dark hinge line with two small pins crosses the middle.

Flipping: the drum order is " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/". To change letter a cell flips through every letter between, one leaf at a time with the Web Animations API: rotateX 0 → −180° in 64ms; the final leaf takes 230ms and bounces (−180 at 62%, −166 at 80%, −180). The falling face darkens (a registered --shade number animated 0 → .55 as an inset shadow) and the arriving face lightens. Cells start staggered by column (26ms) and row (70ms) plus up to 40ms of randomness, so changes ripple; cells whose letter doesn't change never move. One rAF scheduler advances cells; after the board settles it holds 3.2s and moves to the next.

Size: the board is a container (container-type: inline-size) and cell width = (100cqw − gaps) / columns, height 1.5×, font 1.08× width, so 24 columns fit a phone. Header with a title, subtitle and a Pause button (it loops; WCAG 2.2.2). The board is aria-hidden; the current rows are in a visually hidden list. Pauses offscreen and when the tab is hidden. Reduced motion changes letters in place with no flaps.`,
  interaction: "Watch the board update; Pause holds it.",
  animation: "Leaves 64ms each, last leaf 230ms with a bounce; staggered 26ms per column and 70ms per row; hold 3.2s between boards.",
  a11y: "The flap grid is aria-hidden; the current board is a visually hidden list (not live, so it doesn't chatter). A Pause button stops the cycle. Reduced motion swaps letters without flipping.",
  responsive: "Cells are sized from the board's own width with container units, so all 24 columns fit from phone to desktop.",
  touchFallback: "Not pointer-driven; identical on touch.",
  variants: [
    { id: "amber", label: "Amber", prompt: "theme=\"amber\": amber letters (#ffb53d) on black cells (#262628 / #1a1a1c) on a #0d0d0e board, with a faint glow — the classic departures board; page #070708." },
    { id: "white", label: "White", prompt: "theme=\"white\": off-white letters (#f1f1ef) on charcoal cells (#2b2c2e / #1d1e20) on a #121314 board, no colour; page #0a0b0c." },
    { id: "cream", label: "Cream", prompt: "theme=\"cream\": dark ink letters (#1c1a16) on cream cells (#fbf7ee / #efe8d8) on a tan board (#d8cfba), no glow and softer shading; page #efe9dc." },
  ],
  preview: { bg: "#070708", mode: "fill" },
};
