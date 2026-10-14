import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "corona-arcs",
  name: "Corona Arcs",
  category: "backgrounds",
  description: "Soft concentric bands of light rise from a corner and slowly breathe outward, from a dark edge to a hot core, as if the page sat at the rim of a sun. The pointer nudges the centre. A background only, with no text of its own.",
  tags: ["background", "arcs", "rings", "glow", "gradient", "warm", "soft", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["CoronaArcs.tsx", "corona-arcs.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): soft concentric bands of light rising from the bottom-left corner.\n\nPlace a centre well below and left of the frame (about \u22120.25, \u22121.2 in screen heights) and take the distance r to it, scaled for wide screens and roughened slightly by slow noise. An envelope smoothstep(edge + 0.35, edge \u2212 0.6, r) \u2014 the edge at about 2 screen heights, breathing \u00b10.04 \u2014 confines the light to the corner. Inside, banding 0.5 + 0.5\u00b7cos(\u03c0(4.4r \u2212 0.1t)), raised to 1.4, moves the bands slowly outward; intensity = envelope \u00d7 (0.3 + 0.68 \u00d7 bands) plus a steady inner glow near the centre. Map intensity through four tones \u2014 ground, deep, main, a pale hot core \u2014 with smoothsteps, so the bands are soft and blurred, never lines. The pointer moves the centre a little.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer and the arcs' centre drifts with it.",
  animation: "The bands breathe slowly outward. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The top-right is dark and suits white text; keep text off the bright lower-left.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the bands keep breathing.",
  variants: [
    { id: "crimson", label: "Crimson", prompt: "Crimson arcs with a peach core: bg #0e0204, deep #5a0b1b, mid #d6324b, hot #ffb4a2." },
    { id: "amber", label: "Amber", prompt: "Orange arcs with a cream core: bg #0d0602, deep #5a2407, mid #e6812b, hot #ffe1b2." },
    { id: "iris", label: "Iris", prompt: "Indigo arcs with a pale lavender core: bg #05030f, deep #261062, mid #6b4ef0, hot #d8ceff." },
  ],
  preview: { bg: "#0e0204", mode: "fill", height: 600 },
};
