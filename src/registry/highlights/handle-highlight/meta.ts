import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "handle-highlight",
  name: "Handle Highlight",
  category: "highlights",
  description: "Words marked the way a design tool marks a selected layer: a soft tint, a hairline frame and handles on every corner and edge. The frame traces itself in and the handles pop on one by one. Phrases that wrap stay one selection, with handles only at the two ends.",
  tags: ["highlight", "selection", "handles", "design tool", "frame", "headline", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["HandleHighlight.tsx", "handles.ts", "handle-highlight.css"],
  dependencies: [],
  prompt: `Build an inline highlight that marks words like a selected layer in a design tool: "Ship the layout you [actually designed.]" in a semibold Inter headline, the marked phrase wrapping onto its own line on narrow screens.

Geometry: the marked words stay real inline text. Their line rectangles come from Range.getClientRects(), merged per line and measured relative to a zero-size anchor at the wrapper's origin (so it works however the browser places absolutely positioned children of a wrapped inline); re-measured on the block's resize, window resize and fonts.ready. Each line box is padded .1em horizontally and .02em vertically, and the wrapper has .14em of inline margin so a frame never touches the neighbouring words. Behind the text (z-index −1 in a z-index 0 wrapper) a tint fills each box: the accent mixed 13% into transparent. In front, a 1.25px hairline frame outlines each box.

Handles: a single-line selection gets eight — four corners and four edge midpoints. A phrase that wraps stays one selection: the first line carries the start (left corners, left and top midpoints), the last line the end (right corners, right and bottom midpoints). Each handle is 10% of the font size (5–10px), white with a 1.4px accent outline, and knows which way is outward.

Motion: the first time the phrase is half in view, the tint fades in (360ms), the frame traces around its perimeter (stroke-dasharray with pathLength 1, 640ms), then the handles scale in from 0 with a springy overshoot (420ms, cubic-bezier(.3,1.6,.5,1)), 45ms apart; a delay prop staggers several highlights. There is no hover effect. Reduced motion shows the finished selection.`,
  interaction: "None; the selection draws itself once when the words scroll into view.",
  animation: "Tint 360ms; frame traced in 640ms; handles spring in 420ms, 45ms apart.",
  a11y: "Frames and handles are aria-hidden SVG; the words remain ordinary selectable text with their colour unchanged.",
  responsive: "Measured from the text, so it follows the words through wrapping and resizing; handles scale with the font size within 5–10px.",
  variants: [
    { id: "circles", label: "Circles", prompt: "Handles are round dots (white fill, accent outline) on a near-black page (#0e0f13, text #f1f2f5); accent pink #ff5fa2." },
    { id: "squares", label: "Squares", prompt: "Handles are small squares (white fill, accent outline), as in most design tools, on a warm off-white page (#f6f5f1, text #15161a); accent orange #f0601f." },
    { id: "triangles", label: "Triangles", prompt: "Handles are solid accent arrowheads with a thin white edge, each pointing outward from the selection — diagonally at corners, straight out at edge midpoints — on a near-black page (#0e0f13, text #f1f2f5); accent violet #a58bff." },
    { id: "diamonds", label: "Diamonds", prompt: "Handles are diamonds — small rhombi standing on a point, white fill with an accent outline — on a warm off-white page (#f6f5f1, text #15161a); accent green #178a64." },
  ],
  preview: { bg: "#0e0f13", mode: "fill" },
  isNew: true,
};
