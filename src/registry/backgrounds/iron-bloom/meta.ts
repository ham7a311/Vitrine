import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "iron-bloom",
  name: "Iron Bloom",
  category: "backgrounds",
  description: "A pool of glossy black magnetic fluid. Its surface flows slowly, catching thin white reflections, and a magnet — wandering on its own, or under your pointer — pulls a crown of sharp spikes up out of it in a hexagonal pattern.",
  tags: ["background", "ferrofluid", "magnetic", "liquid", "black", "glossy", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["IronBloom.tsx", "iron-bloom.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): a pool of black ferrofluid seen from a low camera looking down at about 23°, raymarched as a height field (up to 110 steps, each step a third of the height gap, at least 0.004). The surface is gentle crossing sine swells plus a little value noise, drifting slowly, so it reads as slow liquid. Around a magnet it rises into a soft mound topped by a crown of spikes: three cosines 120° apart (the hexagonal lattice ferrofluid forms in a field), raised to the fifth power so they come to points and scaled by a Gaussian of the distance to the magnet so the centre spikes are tallest; the lattice turns very slowly, and the swells calm near the crown.\n\nThe magnet wanders on its own in a slow loop across the pool, so the crown is always visible; when the pointer is over the background, intersect the pointer's ray with the pool and ease the magnet there (0.05 lerp), then let it wander again when the pointer leaves.\n\nShade it as glossy black: a normal from finite differences, the reflected ray looked up in a dark studio of three soft horizontal softboxes and a hot key light to the upper left, weighted by Schlick Fresnel, so all you see are thin bright reflections sliding over black. An iridescent option tints those reflections by the surface direction, like a petrol film. Fade into the ground colour with distance and vignette the corners.\n\nRender at 0.6× device pixels (lower and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion with the crown standing, and fall back to soft CSS gradients without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer over the fluid and the crown of spikes follows it; move away and the magnet wanders off on its own.",
  animation: "The surface flows and the magnet wanders continuously; the pointer pulls the magnet with a slow 0.05 lerp. Reduced motion draws one still frame with the crown standing.",
  a11y: "Decorative and hidden from assistive tech. Mostly black, so white text reads well away from the crown; use a scrim near it.",
  responsive: "Fills its container; device pixel ratio capped at 2; lighter render and frame rate on touch screens.",
  touchFallback: "No pointer on touch; the magnet keeps wandering on its own.",
  variants: [
    { id: "ink", label: "Ink", prompt: "Palette { base #050506, light #f2f2f4, tint #30303a }: black fluid with white highlights." },
    { id: "oil", label: "Oil", prompt: "Palette { base #040405, light #e8e8f0, tint #2a2440 } with iridescent highlights: the reflections shift through cyan, violet and gold by surface angle." },
    { id: "copper", label: "Copper", prompt: "Palette { base #070403, light #ffc79a, tint #4a2412 }: black fluid under warm copper light." },
  ],
  preview: { bg: "#050506", mode: "fill", height: 600 },
};
