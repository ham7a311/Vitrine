import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "velvet-grain",
  name: "Velvet Grain",
  category: "backgrounds",
  description: "A slow whorl of colour on near-black under a heavy, living film grain \u2014 the look of dark velvet photographed on fast film. The pointer shifts the whorl's centre. A background only, with no text of its own.",
  tags: ["background", "grain", "noise", "swirl", "film", "dark", "moody", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["VelvetGrain.tsx", "velvet-grain.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): a slow whorl of colour on near-black under heavy film grain.\n\nCentre polar coordinates a little left of the middle (the pointer nudges the centre). Bands wind around it: sin(7.5r \u2212 \u03b8 + w \u2212 0.1t), where w is soft fBm (\u00b1 1.6) so the whorl is never a perfect spiral, plus a gentler diagonal sine; band = smoothstep(0.05, 1, 0.75\u00b7a + 0.3\u00b7b), faded out right at the centre and slightly towards the far edges. Mix the ground towards the dye colour by the band, and vignette the corners. Then the grain: per-pixel hash noise re-seeded every frame, added as luminance (amount \u00d7 (0.35 + band)) and as colour in the dye's hue inside the bands, so the colour itself looks grainy. Render at full resolution so the grain stays sharp.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer to shift the whorl.",
  animation: "The whorl turns slowly and the grain crawls every frame. Reduced motion draws one still, grainy frame.",
  a11y: "Decorative and hidden from assistive tech. Very dark overall, so white text reads well anywhere.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the whorl keeps turning.",
  variants: [
    { id: "oxblood", label: "Oxblood", prompt: "Dark red on near-black: bg #070405, dye #7a1515, grain 0.14." },
    { id: "moss", label: "Moss", prompt: "Olive green on near-black: bg #050604, dye #4c5c1d, grain 0.14." },
    { id: "indigo", label: "Indigo", prompt: "Deep blue on near-black: bg #04050a, dye #232c6c, grain 0.14." },
  ],
  preview: { bg: "#070405", mode: "fill", height: 600 },
};
