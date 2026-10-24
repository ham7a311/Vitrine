import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pen-loop",
  name: "Pen Loop",
  category: "highlights",
  description: "A word circled in pen, the way you'd circle it on a printout: started at the upper left, carried round a little more than once so the end overshoots the start, drifting and wobbling like a hand. It draws itself when the word comes into view and can trail an arrow to a short note.",
  tags: ["highlight", "circle", "hand-drawn", "annotation", "pen", "arrow", "note", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["PenLoop.tsx", "loop.ts", "pen-loop.css"],
  dependencies: [],
  prompt: `Build a hand-drawn pen loop around one word of a headline — "Pay once. / Keep it [forever.]" in semibold Geist, in red pen — with an arrow from the loop to a short italic note, "no subscription, ever".

Loop: an inline-block wrapper around the word with .16em of inline margin, so the loop never crosses its neighbours; an SVG at its origin (zero size, overflow visible) holds one path measured from the word's box (ResizeObserver, fonts.ready). The path is sampled from an ellipse around the word (radius half the width plus .2em, half the height plus .22em) and smoothed with Catmull-Rom → cubic Béziers. It starts at the upper left and goes clockwise for 1.1–1.17 turns, so the end overshoots the start; its radius grows 7% over the stroke (hands drift outward), wobbles by a few percent with two seeded sine terms, and the whole ellipse is tipped 3–7°. Stroke 4.2% of the font size (at least 2px), round caps, no fill. A seed keeps the shape stable.

Note and arrow: the note hangs under the word, right-aligned to its right edge (.5em below it) so it can never run off the side of the page, in Instrument Serif italic at .34em in the loop's colour, on one line. An arrow leaves the note's left side, hooks out and up as a cubic curve and lands on the bottom of the loop's first turn at the point closest above where it started, finished with a two-stroke head pointing at the loop.

Motion: when the word is 70% in view, the loop draws with stroke-dashoffset (pathLength 1) over 950ms, accelerating into the curve and easing off at the overshoot; then the note is written in left to right with a clip-path (520ms), then the arrow travels from the note to the loop (420ms) and its head (160ms). Reduced motion shows it drawn.`,
  interaction: "None; it draws once when the word scrolls into view.",
  animation: "Loop 950ms; note 520ms; arrow 420ms + 160ms head.",
  a11y: "The loop and arrow are aria-hidden SVG; the word and the note are real text, read in order.",
  responsive: "Measured from the word, so the loop fits it at every size; the note stays on one line under the word's right edge.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --loop #d93b28. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --loop #ff8a5c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f7f4ee", mode: "fill" },
  isNew: true,
};
