import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "neon-veins",
  name: "Neon Veins",
  category: "backgrounds",
  description: "Thin glowing veins wander through the dark \u2014 the contour lines of slowly warping noise \u2014 burning bright in some stretches and fading in others, under a fine dust of stars and a few soft, out-of-focus lights. A background only, with no text of its own.",
  tags: ["background", "neon", "veins", "contour", "glow", "stars", "dark", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["NeonVeins.tsx", "neon-veins.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): thin glowing veins wandering through a near-black field, with stars.\n\nBuild a smooth field n from three-octave value noise (few octaves, so the lines bend smoothly instead of fraying), domain-warped once by two broader lookups, at a scale of about 3.4 per screen height, drifting slowly. The veins are its contour at 0.5: e = |n \u2212 0.5|; a crisp core smoothstep(0.012, 0, e) plus a glow exp(\u221234e) \u00d7 0.55 and a faint wide halo exp(\u22129e) \u00d7 0.12. Width varies naturally where the field is flat, giving bright pools along the lines. Add fainter secondary contours at 0.32 and 0.68. Modulate brightness along the veins with another slow noise so some stretches burn and others almost vanish, and brighten them near the pointer with a Gaussian.\n\nOver the top: a sparse dust of tiny stars (one random point in about one cell in five of a 26-per-height grid, each twinkling at its own rate) and six soft out-of-focus lights drifting very slowly. Tone-map with 1 \u2212 exp(\u22121.25 \u00d7 colour) so the cores saturate gracefully.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer to brighten the veins near it.",
  animation: "The veins drift and reshape slowly; stars twinkle; the soft lights wander. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The field is very dark, so white text reads well; avoid placing small text right over a bright vein.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the veins keep drifting.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Deep purple veins with lilac cores: bg #040308, vein #5b1ef2, core #9e70ff, star #e8e6f2." },
    { id: "cyan", label: "Cyan", prompt: "Electric blue veins with ice-white cores: bg #02060a, vein #138fd6, core #a2ebff, star #e6f0f4." },
    { id: "rose", label: "Rose", prompt: "Hot pink veins with blush cores: bg #080306, vein #e0336f, core #ffb4cc, star #f4e6ec." },
  ],
  preview: { bg: "#040308", mode: "fill", height: 600 },
};
