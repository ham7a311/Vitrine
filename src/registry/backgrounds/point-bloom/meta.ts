import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "point-bloom",
  name: "Point Bloom",
  category: "backgrounds",
  description: "Four nested shells of fine points, each warped by slow noise into a lumpy, petal-like form and turning at its own pace, so the layers slide past each other like folded membranes with bright rims and a dark, dusted core. A background only, with no text.",
  tags: ["background", "particles", "points", "point cloud", "3d", "webgl", "organic", "monochrome", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["PointBloom.tsx", "bloom.ts", "point-bloom.css"],
  dependencies: [],
  prompt: `Build a full-bleed black background with an organic point cloud in the middle (WebGL1, one gl.POINTS draw, no libraries), plus an optional slot for content on top.

Points: four shells at radii 0.6, 0.72, 0.85 and 0.98, each a Fibonacci lattice of about 20,000 unit directions with a little jitter (60% of that on touch devices), plus 1,400 loose "dust" points inside radius 0.55. Each point carries its shell index (−1 for dust) and a seed.

Vertex shader: each shell is rotated on its own (tilted 0.4 × index, turning at 0.06 + 0.035 × index rad/s, alternate shells the other way) and pushed in and out along its direction by its own slow wave, a sum of four sines of the direction and time (±26% of the radius), so it reads as a lumpy petal or brain-like form, and the layers slide past each other. Dust turns slowly with the whole. A light perspective (1 / (1 + 0.22 z)) and a scale of 44% of the smaller side. Membrane alpha = 0.01 + 0.9 × (1 − |n·z|)^2.4, so where a shell curves away from you the points stack into bright rims while the faces you look through stay faint; dust twinkles at its own rate. Sizes 2px (membrane) and 2.4px (dust) × DPR.

Fragment shader: a soft round sprite, colour mixed from membrane grey to rim white by alpha, additive blending.

Pointer: a fine pointer pushes the points near it outward (Gaussian, up to 0.16 radius), easing in and out. rAF, paused offscreen and in hidden tabs; reduced motion draws one frame; without WebGL a radial gradient ring stands in. Props: palette [rim, membrane, dust], density, radius, speed, motion, children.`,
  interaction: "A fine pointer pushes the cloud open around it; nothing to click.",
  animation: "Shells turn at 0.06–0.2 rad/s in alternating directions while their surfaces morph slowly; dust twinkles; the pointer push eases at 6% per frame.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Text placed on top reads best over the dark core.",
  responsive: "Fills its container and is sized from the smaller side, so it stays whole on phones; touch devices draw 60% of the points. DPR capped at 2.",
  touchFallback: "No pointer push on touch; the cloud keeps morphing.",
  isNew: true,
  variants: [
    { id: "mono", label: "Mono", prompt: "Rim #ffffff, membrane #9a9a9a, dust #ffffff: a white and grey cloud on black." },
    { id: "aqua", label: "Aqua", prompt: "Rim #d9fffb, membrane #2fb8b0, dust #9ff5ee: a sea-glass cloud." },
    { id: "rose", label: "Rose", prompt: "Rim #ffe3ee, membrane #c2507d, dust #ffb3cf: a pink-rimmed cloud." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 600 },
};
