import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-flow",
  name: "Dither Flow",
  category: "backgrounds",
  description: "Slow folds of satin light printed in four tones with an ordered dither on a coarse pixel grid; the pointer stirs a swirl into the folds.",
  tags: ["background", "dither", "dithered", "pixel", "webgl", "shader", "animated", "flow"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["DitherFlow.tsx", "dither-flow.css"],
  dependencies: [],
  prompt: `Write a WebGL1 full-screen fragment shader background (one triangle, no libraries) that looks like flowing satin rendered on a one-bit-ish pixel screen.

Quantise first: floor(gl_FragCoord / cell) gives a pixel cell (2 CSS px × DPR); every value is evaluated at the cell centre, so the whole image is made of crisp square pixels. The field is three-octave value-noise fBm, domain-warped twice (q from p, r from p + 1.7q, h from p + 1.5r) and drifting slowly with time, treated as the height of folded cloth: take finite differences for a normal, light it from the upper left, and use pow(diffuse, 4.6) plus a pow-36 specular, so ridges catch thin bright lines and the far sides of folds fall into shadow; a smoothstep on the height drops whole regions to the ground colour. Brightness 0–1 is split into four tones (ground, body, light, crest); between two neighbouring tones each cell picks the lighter one when the fractional part beats its 4×4 Bayer threshold, giving the ordered-dither stipple along every gradient.

The pointer adds a slow swirl: points near it rotate around it by up to 1.4 rad with a Gaussian falloff, the strength and centre eased so the folds bend gently toward wherever you move. Render at about 30fps (the motion is slow), stop when offscreen or in a hidden tab, draw a single frame under reduced motion, skip the pointer on touch, and fall back to CSS radial gradients from the same palette without WebGL. Children sit above the canvas.`,
  interaction: "The pointer stirs a slow swirl into the folds; there is nothing to click.",
  animation: "Field time 0.035 per second with a 0.12 fold phase; pointer centre lerp 0.06 and swirl strength lerp 0.04; about 30fps.",
  a11y: "Decorative and aria-hidden; put text on it with your own contrast check — the crest tone is near white. Reduced motion renders one still frame.",
  responsive: "Fills its container; the pixel cell stays the same CSS size at any width, DPR capped at 2.",
  touchFallback: "No pointer swirl on touch; the folds keep drifting on their own.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Palette [#09090b ground, #4b2bff body, #a996ff light, #ffffff crest]: electric violet folds with white highlights on black, as in a late-night poster." },
    { id: "phosphor", label: "Phosphor", prompt: "Palette [#040805, #1f7a3c, #7ff29a, #effff1]: green phosphor folds on green-black, like a CRT." },
    { id: "mono", label: "Mono", prompt: "Palette [#0a0a0a, #4a4a4a, #a8a8a8, #ffffff]: greyscale folds, pure one-bit newspaper texture." },
  ],
  preview: { bg: "#09090b", mode: "fill", height: 600 },
};
