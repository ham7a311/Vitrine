import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "you-draw-it",
  name: "You Draw It",
  category: "analytics",
  description: "The reader sees the start of a trend and draws how they think it continued. Then the real line draws itself over their guess, the gap between them is shaded, and a plain sentence says how close they were and whether they got the shape right.",
  tags: ["chart", "data journalism", "quiz", "interactive", "editorial", "line chart", "engagement"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["YouDrawIt.tsx", "you-draw-it.css", "score.ts"],
  dependencies: [],
  prompt:
    "Build a 'you draw it' line chart in the tradition of interactive data journalism: asking for a guess before showing the answer makes the reader notice where their expectation was wrong. Example: 'Masar's weekly active teams grew all spring. What do you think happened next?' with January to May shown and June to December left for the reader.\n\nFigure: a 14px-radius warm paper card; the question in 20–26px Newsreader above an SVG chart (640×300 viewBox) with faint horizontal gridlines, muted y labels and month labels (the months still to guess in the accent blue). The known values are a solid 3px ink line ending in an open circle. The area to the right is a pale accent-tinted zone with a dashed accent border and a gently nudging 'Draw your guess →'.\n\nDrawing: press and drag across the zone; the stroke snaps to each month column, interpolates across columns skipped by a fast stroke, and starts from the last known point. The guess is a dotted accent line with dots at each month. A status line counts '4 of 7 points drawn' and 'Show me' unlocks when every month has a value.\n\nReveal: the real line draws itself from the last known point over 900ms, its dots fade in, the area between the guess and the truth is shaded in a soft red, and the result appears in bold: 'You were off by 18% on average. You expected it to rise; it fell.' (mean absolute error as a share of the true values, the overall bias, and a comparison of slopes). A 'Try again' button and a 'The numbers' disclosure with a table of guesses against actual values follow.",
  interaction:
    "Pointer drawing as above. Keyboard: focus the chart; ←/→ pick a month (a new month starts from the previous guess), ↑/↓ adjust it by a fortieth of the scale (Shift for five times that), Enter reveals. onReveal(result, guess) reports the score.",
  animation: "The hint nudges 6px every 1.6s; on reveal the true line draws over 900ms, the gap shading and dots fade in from 600–700ms and the sentence at 800ms. Reduced motion or motion={false} shows the reveal complete at once.",
  a11y:
    "The chart is a focusable application region whose label explains the keyboard drawing; every adjustment is spoken ('Jul: guess 620'), and the result sentence is announced. After the reveal, the numbers table gives screen-reader users the full comparison.",
  responsive: "The chart scales with its container from its viewBox; the footer wraps under narrow widths.",
  touchFallback: "Draw with a finger: the chart disables scrolling under it while you draw. Buttons are full-size tap targets.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --ydraw-bg #fbfaf7; --ydraw-gap rgb(212 76 40 / 0.16); --ydraw-guess #2d5fd2; --ydraw-ink #1e1d1b; --ydraw-line rgb(30 29 27 / 0.1); --ydraw-muted #6b675f; --ydraw-truth #1e1d1b; --ydraw-zone rgb(45 95 210 / 0.06). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --ydraw-bg #141413; --ydraw-gap rgb(255 140 100 / 0.2); --ydraw-guess #86a8ff; --ydraw-ink #eceae5; --ydraw-line rgb(255 255 255 / 0.1); --ydraw-muted #a29d94; --ydraw-truth #eceae5; --ydraw-zone rgb(134 168 255 / 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e7e3da", mode: "center", frame: [1000, 640] },
};
