import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "highlight-cursor",
  name: "Highlight Cursor",
  category: "cursors",
  description: "A coloured arrow that highlights the line of text it's on: the line sits in a rounded box — a dark wash of the accent with a hairline accent edge — and its words take the accent colour. Move between lines and the box springs from one to the next.",
  tags: ["cursor", "highlight", "text", "selection", "hero", "headline", "accent", "spring"],
  traits: ["cursor", "touch"],
  source: "original",
  files: ["HighlightCursor.tsx", "highlight-cursor.css"],
  dependencies: [],
  prompt: `Build a cursor that highlights the line of text under it, for a dark hero.

Markup: a <Highlight text="…" as="h2" /> helper renders its text as one span per word (spaces between them, "\\n" as <br>) and marks the element data-hc-text. The wrapper measures every word with getBoundingClientRect, groups words into lines by offsetTop, and stores each line's union rect in host-local pixels (corrected by rect.width / offsetWidth). It re-measures on ResizeObserver and document.fonts.ready.

Layers: the host is isolated and holds three layers — the selection box behind the content (z 0), the content (z 1), and the cursor above (z 2), all aria-hidden except the content.

The box: border-radius 7px; background = the accent at 16% (over near-black #050505 that reads as a deep wash of the accent); a 1px inset ring of the accent at 48%; padding 5px either side and 2px above and below the words' boxes. The lit line's word spans get data-lit and turn the accent colour (160ms). The box is four springs (x, y, width, height; k 560, ζ 0.88), so moving between lines it travels and resizes to the next one; it appears in place on the first line and fades out (180ms) when the pointer leaves the text. A line counts as hovered within 26px of its padded box (vertical distance weighted 1.5×), so the box doesn't flicker in the gaps between lines.

The cursor: the same rounded arrow drawn at 26px — a 32-unit SVG (viewBox 0 0 32 32) of a fat arrowhead with every corner rounded — vertices tip (2,2), (37.04,13.56), notch (19.1,19.1), (13.56,37.04) rounded with arcs of 2 at the tip and 3 at the outer corners and in the notch: M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z, filled in the accent with no keyline, tip as hotspot, positioned in the pointermove handler. The system cursor is hidden inside the host on fine pointers only. On touch, tapping a line highlights it. One accent colour prop drives the box, ring, lit words and arrow.`,
  interaction: "Move over the headline and the paragraph; each line you point at is boxed and lit in the accent.",
  animation: "Box springs between lines (k 560, ζ 0.88); text colour 160ms; box fade 180ms.",
  a11y: "The text stays real text (word spans are inline, so it reads normally); the box and arrow are aria-hidden decoration. Reduced motion jumps the box between lines and changes colour instantly.",
  responsive: "Lines are re-measured whenever the text reflows, so the box always matches the line as it wraps at that width.",
  touchFallback: "Tap a line to highlight it; tap away to clear. No custom arrow is drawn.",
  variants: [
    { id: "teal", label: "Teal", prompt: "Accent #5fd4bf (teal): a deep teal wash in the box, teal ring, teal lit words and arrow." },
    { id: "violet", label: "Violet", prompt: "Accent #a78bfa (violet)." },
    { id: "amber", label: "Amber", prompt: "Accent #fbbf24 (amber)." },
    { id: "rose", label: "Rose", prompt: "Accent #fb7185 (rose)." },
    { id: "sky", label: "Sky", prompt: "Accent #60a5fa (sky blue)." },
    { id: "lime", label: "Lime", prompt: "Accent #a3e635 (lime)." },
  ],
  preview: { bg: "#050505", mode: "fill" },
};
