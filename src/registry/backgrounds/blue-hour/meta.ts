import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "blue-hour",
  name: "Blue Hour",
  category: "backgrounds",
  description: "The last light over a horizon: an ink sky, a saturated band of colour standing in soft vertical shafts that sway and gather towards the pointer, and a pale haze along the floor. A background only, with no text of its own.",
  tags: ["background", "horizon", "glow", "gradient", "shafts", "atmosphere", "soft", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["BlueHour.tsx", "blue-hour.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): the last light over a horizon.\n\nBuild a shaft value along x from two layers of one-dimensional value noise drifting sideways in opposite directions, through smoothstep(0.15, 0.85). The horizon height is 0.3 of the screen plus 0.11 \u00d7 the shaft value, so brighter shafts stand taller. From the top down: the sky colour; a saturated band rising to smoothstep(h + 0.42, h \u2212 0.04, y), its strength 0.3 + 0.7 \u00d7 the shaft value so the shafts read as soft pillars with darker gaps; a brighter glow just under the horizon; and a pale floor haze, pow(smoothstep(0.33, 0.04, y), 1.7), so the white rises softly. A faint noise on y keeps the band edges soft. The pointer gathers the shafts towards its x (a local squeeze of the x coordinate) and brightens the band there.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer and the shafts gather towards it.",
  animation: "The shafts sway sideways slowly. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. White text reads on the dark upper half; the floor is near white, so use dark text or a dark pill there.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the shafts keep swaying.",
  variants: [
    { id: "cobalt", label: "Cobalt", prompt: "Ink sky, ultramarine shafts, white-blue floor: sky #02040f, band #0b2399, glow #2f5bff, floor #eef2ff." },
    { id: "ultraviolet", label: "Ultraviolet", prompt: "Ink sky, purple shafts, lavender-white floor: sky #06020f, band #3a0f99, glow #8a4dff, floor #f5efff." },
    { id: "sunrise", label: "Sunrise", prompt: "Near-black sky, rust shafts, cream floor: sky #0f0503, band #8a2a0c, glow #f0703a, floor #fff3e4." },
  ],
  preview: { bg: "#02040f", mode: "fill", height: 600 },
};
