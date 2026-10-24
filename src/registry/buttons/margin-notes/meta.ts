import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "margin-notes",
  name: "Margin Notes",
  category: "buttons",
  description: "Point at the button and an invisible editor marks it up: an arrow swooping in at it or a ring scribbled round it, then a few of sparkles, a double underline, a star or a pair of exclamation marks — each drawn in a stroke at a time, slightly differently every hover, like notes in a margin.",
  tags: ["button", "hover", "doodle", "hand-drawn", "sketch", "annotation", "arrow", "playful", "svg", "edge"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["MarginNotes.tsx", "margin-notes.css", "notes.ts"],
  dependencies: [],
  prompt:
    "Build a button that gets annotated by hand when you point at it. Props: children, pen (one of three drawing styles), inks (one colour per note, cycling), tone {face, label, edge}, onClick and type.\n\nThe button: a 50px block with 12px corners, a 1.5px border in the edge colour and a hard 3px offset shadow of the same colour, which grows a pixel on hover and collapses on press.\n\nNotes, drawn in an SVG overlay that reaches 96px round the button (pointer-events none, aria-hidden). On each hover, choose a set with a seeded random from the hover count: always one note that points at the button — an arrow from the upper left, an arrow from the lower right, or a ring round it (rotating through the three) — plus two or three of: sparkles by the top-right corner (three small crosses), a double underline beneath, a five-point star below right, two exclamation marks above left; never both arrows, never the ring with the underline. Every coordinate wobbles by a few pixels from the same seeded random so it looks hand-drawn and is different every time. Arrows are a cubic curve and a separate two-stroke head; the ring is a little more than one turn, its radius growing slightly so the ends overshoot like a real pen loop.\n\nDraw the strokes one after another with pathLength=1 and stroke-dashoffset 1 → 0 (rings 520ms, arrows 300ms, underlines 220ms, small marks 120ms, each starting as the last is 85% done). On leave the notes fade out over 320ms. Keyboard focus draws them; touch draws them on press for 2.6s. Reduced motion: the finished notes fade in.",
  interaction: "Point at the button and it gets marked up; every hover draws a different set. Keyboard focus draws them too.",
  animation: "Strokes draw in one after another over about 1–1.5s and fade out over 320ms. Reduced motion fades in the finished notes.",
  a11y: "A real button with its text label; the notes are decorative SVG in an aria-hidden overlay with pointer-events none. The focus ring is a dashed outline in the edge colour.",
  responsive: "The button keeps its size; leave about 90px of room around it for the notes.",
  touchFallback: "A press draws the notes for 2.6s.",
  variants: [
    { id: "pencil", label: "Pencil", prompt: "Graphite: 1.7px strokes in #3d3a35 at 90% opacity on a #f7f3ea page; the button #fffdf7 with #22201c label, border and shadow." },
    { id: "highlighter", label: "Highlighter", prompt: "Markers: 4.2px strokes, multiplied over the page, cycling #ffd23f, #ff7eb6, #5cc8ff and #7ee081 on #fbfaf6; a white button with #1b1b1f label, border and shadow." },
    { id: "chalk", label: "Chalk", prompt: "Chalk on a board: 2.2px strokes roughened by an feTurbulence displacement filter, cycling #f4f1e8, #f7d774 and #9fd8ff on #22302a; the button is outlined in chalk (#f4f1e8, 2px, 6px corners, no shadow) on the board colour." },
  ],
  preview: { bg: "#f7f3ea", mode: "center", height: 380 },
};
