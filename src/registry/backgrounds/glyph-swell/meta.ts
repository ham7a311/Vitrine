import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glyph-swell",
  name: "Glyph Swell",
  category: "backgrounds",
  description: "A quiet grid of monospaced marks where swells start from your pointer and travel outward as rings, lifting each cell through denser glyphs and brighter ink as they pass. Left alone, slow swells start from random cells.",
  tags: ["background", "canvas", "ascii", "glyphs", "typography", "ripple", "terminal"],
  traits: ["canvas", "cursor", "click", "ambient"],
  source: "original",
  files: ["GlyphSwell.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D background of monospaced glyphs on a 15px grid.

Pre-render a glyph atlas once (and again when the mono font finishes loading): each mark of a quiet-to-loud ramp ('·:-+=*#') drawn in the ink colour on one row and the crest colour on another, at device resolution. Every frame, compute each cell's value: a low murmur (two small sines in cell coordinates and time) plus every live swell's contribution — a Gaussian band at radius age × 17 cells (width ~2.8 cells), decaying with age (e^−0.55·age) and gently with distance. The value picks the glyph (value × ramp length) and its alpha (0.2 + value × 1.15); above 0.8 the crest colour is used. Skip cells below a threshold, and draw the rest with drawImage from the vitrine.

A new swell starts whenever the pointer reaches a new cell (at most every 140ms, amplitude 0.8), a click starts a big one (1.6), and when nobody is touching it a slow swell starts at a random cell every ~1.9s. Swells are dropped after 6s. Run at ~40fps (30 on touch), stop requesting frames offscreen or in hidden tabs, and draw one frame mid-swell under reduced motion. Colours are a prop [background, ink, crest].`,
  interaction: "Move the pointer to start swells from where it is; click or tap for a big one.",
  animation: "Rings travel at 17 cells/s and fade over ~5s; idle swells every ~1.9s; ~40fps.",
  a11y: "The canvas is aria-hidden and decorative. Reduced motion draws one still frame.",
  responsive: "Cells stay 15px (13px on touch); the grid follows the container.",
  touchFallback: "Tap to start a swell; idle swells keep it alive.",
  variants: [
    { id: "terminal", label: "Terminal", prompt: "Colours [#07090a, #9fe6b0, #e9fff0]: green glyphs on black with near-white crests, like a terminal." },
    { id: "paper", label: "Paper", prompt: "Colours [#f3efe6, #3d3a34, #a8432f]: dark grey glyphs on paper with brick-red crests; overlay text dark." },
    { id: "ember", label: "Ember", prompt: "Colours [#0d0806, #c9773f, #ffd9a0]: copper glyphs on warm black with pale gold crests." },
  ],
  preview: { bg: "#07090a", mode: "fill" },
};
