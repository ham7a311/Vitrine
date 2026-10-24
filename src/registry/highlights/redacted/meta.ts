import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "redacted",
  name: "Redacted",
  category: "highlights",
  description: "Words blacked out with a marker, one rough bar per line. Press and hold — or hold Space — to peek: the bars pull back and the words show, lightly marked as declassified; let go and the marker sweeps over them again. A page control can open them all, one after another.",
  tags: ["highlight", "redaction", "redacted", "spoiler", "reveal", "document", "press and hold", "svg"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["Redacted.tsx", "bars.ts", "redacted.css"],
  dependencies: [],
  prompt: `Build marker redactions in a document: an incident review set in IBM Plex Mono on a paper card, with four phrases blacked out — a date in the title and three phrases in the paragraph, one long enough to wrap — and a "Declassify" button under it.

Bars: each redacted phrase is real inline text. Its line rectangles come from Range.getClientRects(), merged per line and measured relative to a zero-size anchor at the wrapper's origin (re-measured on resize and fonts.ready). Above the text (z-index 1) an SVG draws one bar per line: overshooting the words by about .1em at each end and nearly the full line height, with top and bottom edges that wobble by ±.015em and slightly pointed, uneven ends — a marker stroke, not a rectangle. Near-black #141313 on paper; on a dark page the bars are warm white #e9e4da, like correction tape.

Peeking: the phrase is a focusable role="button" with aria-pressed. Pressing and holding the pointer, or holding Space or Enter, opens it; releasing anywhere (pointerup, pointercancel, window blur, losing focus) closes it. Opening scales each bar to 0 from its right end (transform-origin right, 340ms, cubic-bezier(.5,0,.25,1)), so the bar pulls back to the right, line after line 70ms apart; the revealed words get a faint yellow tint to show they were declassified. Closing scales from the left end, so the marker sweeps back over the words (300ms). A revealed prop opens it from outside: the Declassify button opens every redaction in document order, 160ms apart, and "Redact again" closes them.

Accessibility: while closed, a visually hidden "Redacted:" precedes the words, so screen readers announce what they're reading; a visible focus ring marks the focused phrase. Reduced motion opens and closes instantly.`,
  interaction: "Press and hold a bar (or hold Space or Enter on it) to peek; Declassify opens them all in order.",
  animation: "Bars pull back in 340ms and sweep back in 300ms, 70ms apart per line; all bars open 160ms apart.",
  a11y: "Each redaction is a focusable button with aria-pressed and a visible focus ring; screen readers hear \"Redacted:\" before the words until they're revealed. Revealed text keeps its contrast; the tint is light.",
  responsive: "Bars are measured from the text, so they follow the words through any rewrap; the card padding narrows on small screens.",
  touchFallback: "Press and hold a bar to peek; long-press selection is disabled on the bars so the gesture works.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bar #141313; --focus #1f5bd8; --seen rgb(255 214 64 / 0.32). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bar #e9e4da; --focus #8fb4ff; --seen rgb(255 214 64 / 0.2). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3efe6", mode: "fill" },
  isNew: true,
};
