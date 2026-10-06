import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "halftone-rise",
  name: "Halftone Rise",
  category: "backgrounds",
  description: "A dome of warm light rising from below the frame, printed as tiny square dots on a fixed grid: grainy ordered-dither speckle at the rim, dense in the middle. A background only, with no text.",
  tags: ["background", "halftone", "dither", "stipple", "dots", "glow", "webgl", "shader", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["HalftoneRise.tsx", "halftone.ts", "halftone-rise.css"],
  dependencies: [],
  prompt: `Build a full-bleed dark background with no text: a soft glow rising from below the bottom edge, rendered as a halftone of tiny square dots. Draw it in one WebGL1 full-screen triangle (no libraries) and leave an optional slot for content on top.

Grid: split the canvas into cells of 3 CSS px (× DPR, capped at 2) and evaluate everything at the cell centre. Each cell can hold one small square dot, 40% of the cell, centred; the rest stays the near-black ground.

Glow: an ellipse centred at x 50%, y 105% (just under the frame), half-height 64% of the frame and half-width max(0.7 × width, 0.9 × height), so it reads as a wide dome whose crest reaches about 40% from the top in the middle and drops toward the side edges. Dot coverage = smoothstep(1.08, 0.62, distance) for the rim, times a plateau that eases the very middle down to 0.62 so content placed there stays readable. Multiply by 0.55 + 0.9 × a domain-warped four-octave fbm (scale 2.4, drifting at 0.04 of time) so the print has slow, streaky patches like a real halftone of a soft light.

Dither: a dot is on when coverage beats an 8×8 Bayer threshold mixed 86/14 with per-cell hash noise, so the rim breaks into grainy speckle instead of bands. Dot colour runs from the rim tone to the core tone with coverage, and each dot gets a random 62–100% brightness for shimmer.

Motion: the dome breathes ±2% in height (sin of 0.35 × time), the noise drifts, and a fine pointer adds coverage in a Gaussian around it (eased in and out). About 30fps, paused offscreen and in hidden tabs; reduced motion draws one still frame; touch skips the pointer. Without WebGL a radial gradient from the same palette stands in. Props: palette [ground, rim, core], cell, core (middle fill), rise, speed, motion, children.`,
  interaction: "A fine pointer warms the dots near it; there is nothing to click. Content placed inside works as normal.",
  animation: "Noise drift 0.04 per second, dome breath ±2% on a ~18s cycle, pointer glow eased at 0.08 (position) and 0.05 (strength); about 30fps.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Check the contrast of any text you place over the dense middle.",
  responsive: "Fills its container; the dot grid stays 3 CSS px at any width and the dome keeps its shape on narrow screens by never getting narrower than the height.",
  touchFallback: "No pointer glow on touch; the print keeps drifting on its own.",
  isNew: true,
  variants: [
    { id: "copper", label: "Copper", prompt: "Palette [#0a0a0b ground, #8a4420 rim, #e8894c core]: copper dots on black, like a warm analytics hero." },
    { id: "cobalt", label: "Cobalt", prompt: "Palette [#06080d ground, #1d3a8a rim, #6f9bff core]: cool blue dots on blue-black." },
    { id: "jade", label: "Jade", prompt: "Palette [#050a08 ground, #14583f rim, #4fe0a5 core]: green dots on green-black." },
    { id: "rose", label: "Rose", prompt: "Palette [#0b0709 ground, #7a2347 rim, #ff86b3 core]: pink dots on plum-black." },
  ],
  preview: { bg: "#0a0a0b", mode: "fill", height: 600 },
};
