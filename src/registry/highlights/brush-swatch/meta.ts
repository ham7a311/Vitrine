import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "brush-swatch",
  name: "Brush Swatch",
  category: "highlights",
  description: "One stroke of paint laid behind a word: pressed down on a slant where it starts, wandering slightly along its length, and running dry at the end where the bristles split. It is brushed in left to right when the word comes into view.",
  tags: ["highlight", "brush", "paint", "swatch", "serif", "italic", "headline", "svg"],
  traits: ["ambient", "scroll"],
  source: "original",
  files: ["BrushSwatch.tsx", "swatch.ts", "brush-swatch.css"],
  dependencies: [],
  prompt: `Build a painted highlight behind one italic serif word in a large headline: "Version control / for your [Agents]" in Instrument Serif, the swatch in deep teal behind the italic word.

Shape: an inline-block wrapper with the word on top and an absolutely positioned paint layer behind it (z-index −1 inside a z-index 0 wrapper) that over-runs the word (left −.2em, right −.28em) and sits low (top .3em, bottom −.02em) so ascenders rise above the paint, rotated −2° about 30% of its width. The paint is an SVG sized in real pixels from a ResizeObserver, its path generated from a seeded random function so the same seed always paints the same stroke: a slanted, slightly ragged start; top and bottom edges that wander by a few percent of the height; and a dry end where the stroke splits into five bristle fingers of different lengths.

Texture: the whole stroke passes through feTurbulence (fractal noise, base frequency .035 × .55) into feDisplacementMap (scale 7% of the height) so the edges have the grit of paper tooth. Inside, clipped to the stroke, a few thin bristle streaks run along its length — some lighter (dry brush), some darker (pooled paint).

Motion: the first time the word is 60% in view (IntersectionObserver), the paint is revealed left to right by animating clip-path inset(0 100% 0 0) → inset(0) over 720ms (cubic-bezier(.3,.75,.2,1)) after a short delay. Reduced motion shows it painted.`,
  interaction: "None; it paints itself in once when the word scrolls into view.",
  animation: "Brushed in over 720ms, once, after a 150ms delay.",
  a11y: "The paint is aria-hidden SVG behind real text; the word stays selectable and is read normally. Word colour keeps 4.5:1 on the paint (white on deep teal, near-black on ochre).",
  responsive: "Sized in em and measured in pixels, so the stroke follows the headline at every width and redraws crisply on resize.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --dry rgb(255 255 255 / 0.1); --paint #1e5c55; --pool rgb(0 0 0 / 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --dry rgb(255 255 255 / 0.28); --paint #f0b443; --pool rgb(120 60 0 / 0.07). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#1b1a18", mode: "fill" },
  isNew: true,
};
