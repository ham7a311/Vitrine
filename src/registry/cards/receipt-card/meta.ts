import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "receipt-card",
  name: "Receipt Card",
  category: "cards",
  description: "A pricing card with a printer slot — an itemised receipt of everything included feeds out line by line.",
  tags: ["card", "pricing", "reveal", "hover", "disclosure", "saas"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["ReceiptCard.tsx", "receipt-card.css"],
  dependencies: [],
  prompt: `Design a pricing card that prints its own feature list. The card is a dark plum panel (18px radius, hairline border, faint frost glow in the top-right) with a mono plan name, a big tabular price with its cadence, a one-line blurb, a solid cream CTA, and a quiet text button: "Print what's included". Near its bottom edge is a printer slot — a thin, deeply inset dark line.

Beneath the card, a paper slip is hidden in a zero-height feed. On hover, focus or click, the feed opens with grid-template-rows 0fr → 1fr using a steps() timing function with one step per line, so the paper advances in discrete jumps like a thermal printer; at the same time each line of the slip fades in on its own 120ms-staggered delay, and the slip shivers sideways by half a pixel in stepped keyframes — the printer's stutter. Closing retracts it smoothly.

The slip is warm off-white thermal paper with a shadow where it leaves the slot and a torn zig-zag bottom edge (a conic-gradient mask). It's set in monospace: a header with the plan and a receipt number, itemised features with dotted leaders and "INCL" in the price column, a dashed rule, a bold total per seat, and a small barcode. The disclosure button carries aria-expanded/aria-controls so the list is fully accessible without hover.`,
  interaction: "Hover, focus or click the 'Print what's included' control to feed the receipt out; leaving the card or clicking again retracts it.",
  animation: "Feed: steps(rows) over rows × 120ms + 200ms; lines fade in at 120ms intervals; stepped half-pixel jitter; retract 350ms.",
  a11y: "The toggle is a real <button> with aria-expanded and aria-controls pointing to a labelled region; the feature list is a real <ul>. The CTA is a link. Reduced motion shows the receipt instantly.",
  responsive: "Fluid up to 20rem; the receipt grows to fit any number of lines.",
  touchFallback: "Tap the toggle to print; nothing requires hover.",
  preview: { bg: "#0b080d", mode: "fill", height: 700, frame: [600, 450] },
};
