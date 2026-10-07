import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ember-globe",
  name: "Ember Globe",
  category: "backgrounds",
  description: "A slowly turning sphere drawn in thousands of twinkling points: an ember-coloured upper half from a hot cap down to scattered sparks, a cool white lower half, and a near-empty equator between them. A background only, with no text.",
  tags: ["background", "particles", "points", "sphere", "globe", "webgl", "3d", "glow", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["EmberGlobe.tsx", "globe.ts", "ember-globe.css"],
  dependencies: [],
  prompt: `Build a full-bleed black background with a point-cloud sphere in the middle (WebGL1, one gl.POINTS draw, no libraries), plus an optional slot for content on top.

Points: 12,000 on a unit sphere shell with ±3.5% radial jitter, alternating hemispheres, with latitude y = ±(1 − u^1.7) so they crowd toward both poles and thin out around the equator; each has a random seed. Generate them once, deterministically.

Vertex shader: rotate round the vertical axis at 0.12 rad/s, tip the globe 0.32 rad toward the viewer (so the top cap reads as a bright arc) plus a pointer tilt, apply a light perspective (1 / (1 + 0.18 z)) and scale to 34% of the smaller side. Colour by the point's own latitude: in the upper half mix spark (near the equator) → ember (from y 0.05 to 0.4, jittered per point so sparks mix in) → hot (from 0.62 to 0.96); the lower half is the cool colour. Alpha = a per-point twinkle (0.55 ± 0.45, its own rate) × a latitude fade (30% at the equator to 100% by |y| 0.55) × a back-face dim (55% behind), 60% for the cool half, and the hottest cap eased down by a third so it stays coloured instead of blowing out to white. Point size 2.3 × DPR × (0.55–1.45 by seed) × perspective, scaled with the globe.

Fragment shader: a soft round sprite (smoothstep on the squared distance) with additive blending, so dense caps bloom on their own.

Motion: rAF, paused offscreen and in hidden tabs; reduced motion draws one frame; a fine pointer eases the tilt (up to ±0.35 and ±0.25 rad). Without WebGL, layered radial gradients from the same palette stand in. Props: palette [hot, ember, spark, cool], count, radius, speed, motion, children.`,
  interaction: "A fine pointer tips the globe toward it; nothing to click.",
  animation: "Rotation 0.12 rad/s; each point twinkles at its own 1.2–3.8 rad/s; pointer tilt eases at 5% per frame.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Any text placed on top should sit clear of the bright caps.",
  responsive: "Fills its container; the globe is sized from the smaller side so it stays round and whole on phones. DPR capped at 2.",
  touchFallback: "No pointer tilt on touch; the globe keeps turning.",
  promptAllow: ["ember"],
  isNew: true,
  variants: [
    { id: "ember", label: "Ember", prompt: "Hot #ffae8a, ember #ff7428, spark #f0bd3a, cool #e6e9ee: a peach-hot cap fading to orange and amber sparks over a white lower half." },
    { id: "glacier", label: "Glacier", prompt: "Hot #e9fbff, ember #57c7ff, spark #8fa8ff, cool #c7a6ff: an icy cap over sky-blue, with a lilac lower half." },
    { id: "mono", label: "Mono", prompt: "Hot #ffffff, ember #c9ccd3, spark #8d929c, cool #eceef2: greyscale points throughout." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 560 },
};
