import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glow-strands",
  name: "Glow Strands",
  category: "backgrounds",
  description: "Six strands of light drift across the dark, each a crisp core in a soft glow. Where they cross, the light adds up and flares towards white, and the pointer bows them apart. A background only, with no text of its own.",
  tags: ["background", "neon", "lines", "waves", "glow", "strands", "dark", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["GlowStrands.tsx", "glow-strands.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): six strands of light drifting across a black field.\n\nEach strand is a curve y(x) = base + a\u00b7sin(f\u00b7x + s\u00b7t + \u03c6) + 0.35a\u00b7sin(2.3f\u00b7x \u2212 0.7s\u00b7t + 1.7\u03c6), with bases spread from top to bottom, amplitudes 0.18\u20130.3, frequencies about 1\u20131.6 and speeds alternating in direction, so the strands weave and cross. Measure the true distance to each curve by dividing |y \u2212 y(x)| by \u221a(1 + y\u2032\u00b2), with y\u2032 from a finite difference. Each strand adds its own colour as a crisp Gaussian core (\u03c3 \u2248 0.004) \u00d7 1.6, a glow exp(\u2212d/0.03) \u00d7 0.55 and a faint halo; the first and last strands are dimmer, for depth. Add white where the cores overlap (smoothstep(0.9, 1.8, summed cores)) so crossings flare, then tone-map with 1 \u2212 exp(\u22121.35 \u00d7 light). The pointer bows the strands apart: near its x, push each curve away from the pointer's y.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer to bow the strands apart around it.",
  animation: "The strands weave slowly; crossings flare as they pass. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The ground is black, so white text reads well; keep small text off a strand.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the strands keep weaving.",
  variants: [
    { id: "aurora", label: "Aurora", prompt: "Violet, blue, ice and cream strands: bg #000000, c0 #3a137a, c1 #7a2ef5, c2 #2b8df2, c3 #a6e4ff, c4 #f4e2b0, c5 #4f35c8." },
    { id: "sunset", label: "Sunset", prompt: "Magenta, orange, gold and cream strands: bg #000000, c0 #5a1040, c1 #e0337a, c2 #ff6a3a, c3 #ffc46a, c4 #ffe9c2, c5 #a02a6a." },
    { id: "silver", label: "Silver", prompt: "Greys and white, like steel wire under light: bg #000000, c0 #2a2d38, c1 #8a90a8, c2 #c8cee0, c3 #ffffff, c4 #e6e2d8, c5 #5a6070." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 600 },
};
