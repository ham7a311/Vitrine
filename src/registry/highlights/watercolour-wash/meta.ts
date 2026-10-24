import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "watercolour-wash",
  name: "Watercolour Wash",
  category: "highlights",
  description: "A wash of pigment that blooms out behind a word as the paper takes the water: paler in the middle, darker where the pigment pooled and dried at the edge, granulated, with a small bloom where the water ran back. It spreads once when the word comes into view.",
  tags: ["highlight", "watercolour", "paint", "wash", "organic", "serif", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["WatercolourWash.tsx", "wash.ts", "watercolour-wash.css"],
  dependencies: [],
  prompt: `Build a watercolour wash behind italic words in an Instrument Serif headline on warm paper (#fbf7ee): "Learn to paint [slowly], / and [loosely]." — each word in its own pigment, the second following the first.

Shape: an inline-block, nowrap wrapper (.04em inline margin; the wash may spread behind its neighbours) with an SVG behind the word (z-index −1) that is larger than the word (−.42em on each side, −.2em top, −.24em bottom), sized in pixels from a ResizeObserver. The wash is a closed blob: an ellipse (46% × 40% of the box) whose radius wanders with three seeded low harmonics (2, 3 and 5 lobes, a few percent each), smoothed with Catmull-Rom. A low-frequency displacement (fractal noise .016 × .026, two octaves, scale .28em) makes its edge organic.

Layers, like real watercolour: the body filled with a radial gradient that is paler in the middle (pigment at 20%) and denser toward the edge (42%), where pigment pools; granulation — the darker shade passed through a fine noise thresholded into specks, at 22% — settled into the paper's tooth; a dried rim, the same blob stroked in the darker shade at 42%, displaced identically and slightly blurred; and a small backrun ("cauliflower") toward the upper right — a smaller blob filled with the paper colour at 40% with a faint dark rim, where water crept back into the drying wash.

Motion: when the word is 70% in view the wash spreads from a small, blurred pool where the brush touched (scale .3 about 38% × 55%, blur 6px) to full size over 1500ms (cubic-bezier(.18,.75,.2,1)), the blur clearing over 1300ms; the backrun blooms in 900ms later. Reduced motion shows the dried wash.`,
  interaction: "None; each wash spreads once when its word scrolls into view.",
  animation: "Spreads over 1500ms; the backrun blooms 900ms later.",
  a11y: "The wash is aria-hidden SVG behind real text; the wash is light where the letters sit, so the text keeps 4.5:1 or better.",
  responsive: "Measured in pixels and offset in em, so the wash keeps its proportions around the word at every size.",
  variants: [
    { id: "indigo", label: "Indigo", prompt: "Pigments: indigo #3a4fb0 with a dried edge of #1f2a6e for the first word, and a lighter cobalt #4a7fc0 with #22406e for the second." },
    { id: "sienna", label: "Sienna", prompt: "Pigments: burnt sienna #c3612b with a dried edge of #7e3510 for the first word, and raw sienna #d0903a with #7a4d12 for the second." },
  ],
  preview: { bg: "#fbf7ee", mode: "fill" },
  isNew: true,
};
