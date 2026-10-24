import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "washi-tape",
  name: "Washi Tape",
  category: "highlights",
  description: "A strip of translucent paper tape laid over a word, a little crooked: torn ends, a printed pattern, the fibres of the paper and a faint shadow where it lifts. It is smoothed on from one end when the word comes into view.",
  tags: ["highlight", "tape", "washi", "scrapbook", "journal", "paper", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["WashiTape.tsx", "tape.ts", "washi-tape.css"],
  dependencies: [],
  prompt: `Build a washi-tape highlight for a journal headline in Instrument Serif — "Notes from a [slow] / [summer] by the sea" — with a mint striped strip and a pink dotted strip.

Strip: an inline-block wrapper (.12em inline margin) with the word, and an absolutely positioned strip — over the word on a light page, under it on a dark one, where light letters can't show through tape — across the lower two-thirds of the word that over-runs both ends (left −.24em, right −.28em, top .24em, bottom .04em), rotated a couple of degrees either way. The strip is an SVG sized in pixels from a ResizeObserver. Its path has straight long edges (the roll's cut) and two torn ends: a run of small uneven teeth, alternating in and out by up to 9% of the strip's height, generated from a seed so each strip keeps its tear.

Surface: the tape colour at 82% opacity with a printed pattern on top (45° stripes 2.6px wide every 7px, 1.5px dots every 8px, or a 1px grid every 8px) in white at 55%, clipped to the strip; the whole strip runs through a fibre filter (fractal noise, base frequency .9 × .25, used as an alpha mask) so the paper looks thinner in places; the two cut edges carry a slightly stronger line of the tape colour. On a light page the strip uses mix-blend-mode: multiply, so the letters underneath darken through it like real tape; on a dark page it blends normally at lower opacity. A faint drop shadow suggests it isn't quite flat.

Motion: when the word is 70% in view, the strip unrolls from the left (clip-path inset from 100% on the right to 0, 620ms) while settling from slightly raised and larger, with a deeper shadow, to flat (700ms); several strips follow each other with delays. Reduced motion shows them laid down.`,
  interaction: "None; each strip is laid down once when its word scrolls into view.",
  animation: "Unrolls in 620ms while settling flat over 700ms.",
  a11y: "The tape is aria-hidden SVG; the word underneath stays real, selectable text and keeps 4.5:1 contrast through the translucent tape.",
  responsive: "Sized in em and measured in pixels, so the strip follows the type at every width; each word stays on one line.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --blend multiply; --layer 1; --lift rgb(60 40 20 / 0.16); --print rgb(255 255 255 / 0.55); --tape-alpha 0.82. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --blend normal; --layer -1; --lift rgb(0 0 0 / 0.4); --print rgb(255 255 255 / 0.35); --tape-alpha 0.62. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f5f0e6", mode: "fill" },
  isNew: true,
};
