import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "highlighter-pen",
  name: "Highlighter Pen",
  category: "highlights",
  description: "Text marked by hand with a chisel-tip highlighter, imperfectly: the ink sits low, starts a little late, stops short or runs over, tilts, and darkens where the pen went back over the end. A phrase that wraps is marked line by line at writing speed.",
  tags: ["highlight", "highlighter", "marker", "hand-drawn", "imperfect", "editorial", "mark", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["HighlighterPen.tsx", "marker.ts", "highlighter-pen.css"],
  dependencies: [],
  prompt: `Build a hand-marked highlighter for running text: an article (Newsreader) where three phrases are marked in pink, yellow and green, one of them long enough to wrap over two or three lines.

Element: a <mark> (background none, colour inherited) wrapping real text. Its line rectangles come from Range.getClientRects(), merged per line and measured relative to a zero-size anchor at the wrapper's origin; re-measured on the block's resize, window resize and fonts.ready. Behind the text (z-index −1 inside a z-index 0 wrapper) an SVG draws one stroke per line.

The stroke is deliberately imperfect, from a seed hashed from the phrase so it is stable: it sits low on the line (top at 30–36% of the line box, bottom at 86–92%); starts up to .08em early or .2em late and stops up to .23em short or .19em over; tilts by up to ±4.5% of the line height across its length; its long edges wander by ±1.75%; the start is a chisel slant (.14em) and the end is the rounded, slightly uneven lift of the tip. A second, shorter layer covers the last .5–1em a little offset, as if the pen went back — because the ink is translucent (fill-opacity .5 on light paper, .42 on a dark page), the overlap reads darker, like real highlighter. An feTurbulence → feDisplacementMap filter roughens the edges by about .05em.

Motion: when the phrase is fully in view, each line is revealed by a mask — a thick line along the stroke's middle animated with stroke-dashoffset — at writing speed (1.25ms per pixel, 240–720ms per line), one line after another with 90ms to move the pen down; a delay prop lets several marks go in reading order. Reduced motion shows the marks already made.

Tones: yellow #ffe03a, pink #ff7ab8, green #7ee08a, blue #7cc4ff on paper; brighter equivalents at lower opacity on a dark page. Any colour can be passed instead.`,
  interaction: "None; each mark is drawn once when it scrolls fully into view.",
  animation: "Each line at writing speed (240–720ms) with a 90ms pen move between lines.",
  a11y: "A real <mark> element, so assistive technology can announce highlighted text; the ink is aria-hidden SVG behind unchanged, selectable text, which keeps its full contrast.",
  responsive: "Measured from the text, so it re-marks correctly whenever the paragraph rewraps; the same phrase always gets the same strokes.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --alpha 0.5; --blue #7cc4ff; --green #7ee08a; --pink #ff7ab8; --yellow #ffe03a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --alpha 0.42; --blue #5cb8ff; --green #5cf08b; --pink #ff6fb6; --yellow #ffe95c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fbf8f1", mode: "fill" },
  isNew: true,
};
