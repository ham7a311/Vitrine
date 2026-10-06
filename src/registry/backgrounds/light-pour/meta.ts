import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "light-pour",
  name: "Light Pour",
  category: "backgrounds",
  description: "A single shaft of light pours down the frame like a stream of liquid, a hairline at the top that flares into a bright pool on the floor, with drifting smoke, falling glints and film grain. A background only, with no text.",
  tags: ["background", "beam", "light", "pour", "spotlight", "glow", "smoke", "webgl", "shader", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["LightPour.tsx", "pour.ts", "light-pour.css"],
  dependencies: [],
  prompt: `Build a full-bleed dark background with no text: one vertical shaft of light pouring from the top edge to the floor like liquid, flaring out where it lands. Draw it in one WebGL1 full-screen triangle (no libraries) and leave an optional slot for content on top.

Measure in frame heights, y down, with f = 1 − y the height above the floor. The stream falls at x 57.4% of the width. Its core half-width is a hyperbola, w = 0.0045 / (f + 0.015): a hairline at the top, about 0.015 at a third of the way up, flaring to a wide pool at the floor. The core is a Gaussian of width 0.9w in the core colour (×2.2) with a softer 2.2w glow, and its brightness flows: noise sampled across the stream and scrolling downward (y × 7 − 1.6t) plus a slow flicker.

Around it: a halo colour body exp(−d / (4w + 0.035)) that strengthens with depth and a wider, fainter one. The lower 60% fills a bell, smoothstep(2.9w, 1.1w, d), cooling from near-white to the halo colour (accent colour toward the right), edged by three thin streamlines at 2.75w, 3.55w and 4.85w that follow the flare (halo-tinted on the left, accent-tinted on the right). Accent light runs into the right of the pool. The pool spreads along the floor (exp(−f / 0.022) × exp(−d / 0.32), rippling outward) with a white sheet right at the edge.

Atmosphere: domain-warped five-octave fbm smoke in cold grey, drifting slowly, fading to black at the far right; a soft halo-coloured cloud just right of the stream near the top; wide masses of halo colour at the lower right and in the lower-left corner. Glints fall down the stream on a jittered 2.5px grid, thicker near it and twinkling. A 3px dot grid shows faintly only where light falls, and film grain (±1.75%) sits over everything. Tone-map with 1 − exp(−1.25x).

Motion: about 30fps, paused offscreen and in hidden tabs; reduced motion draws one still frame. A fine pointer sways the stream up to 1.5% of the width toward it, eased. Without WebGL layered CSS gradients from the same palette stand in. Props: palette [dark, halo, accent, core], x, flare, speed, motion, children.`,
  interaction: "A fine pointer sways the stream a little toward it; there is nothing to click. Content placed inside works as normal.",
  animation: "Core flow scrolls down at 1.6 per second with a 2.3 rad/s flicker; glints fall at 0.11 heights per second; the pool ripples at 2.2 rad/s; smoke drifts at 0.012; pointer sway eased at 0.04; about 30fps.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Keep text to the left half, away from the bright stream and pool.",
  responsive: "Fills its container. Sizes follow the height, so the stream keeps its shape at any width; DPR capped at 2.",
  touchFallback: "No pointer sway on touch; the light keeps pouring on its own.",
  isNew: true,
  variants: [
    { id: "blue", label: "Blue", prompt: "Palette [#05060c dark, #3f63ff halo, #9a62ff accent, #f3f6ff core]: a white stream in cold blue light with violet at the right of the pool." },
    { id: "ember", label: "Ember", prompt: "Palette [#0a0604 dark, #ff5a1f halo, #ff2d78 accent, #fff4ea core]: molten orange light with a hot pink edge, like pouring metal." },
    { id: "mint", label: "Mint", prompt: "Palette [#030a09 dark, #14c79c halo, #2f8bff accent, #effffa core]: a mint-green stream with an azure edge." },
    { id: "magenta", label: "Magenta", prompt: "Palette [#0a040c dark, #c934ff halo, #ff5c9a accent, #fff0fb core]: a purple-magenta stream with a pink edge." },
  ],
  preview: { bg: "#05060c", mode: "fill", height: 600 },
};
