import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "komorebi",
  name: "Komorebi",
  category: "backgrounds",
  description: "Sunlight through leaves, on a wall. Soft discs of light sway together as the branches move and wink out as leaves cross them. Warm and low in contrast, so text sits on it without a scrim.",
  tags: ["background", "hero", "light", "shadow", "leaves", "sunlight", "organic", "calm", "canvas"],
  traits: ["canvas", "ambient"],
  source: "original",
  isNew: true,
  files: ["Komorebi.tsx", "komorebi.css"],
  dependencies: [],
  prompt: `Build a background of dappled sunlight on a wall: the light that falls through a tree's leaves. It should be calm enough to put text on directly.

Rendering. A 2D canvas drawn at one fifth of the section's size and stretched back up with a 5px CSS blur, overhanging the section by 4% on every side so the blur has no visible border. Each frame: fill with the wall-in-shade colour, then draw the light, then the leaf shadows. Over everything, a fine fractal-noise grain at 10% in multiply, for the texture of a painted wall.

The light. 110 discs. Each belongs to one of 7 branches (a branch is a random point in the section with its own phase and speed) and sits at a fixed random offset within 46% of the section's size of it. A disc is an ellipse 1.25 times taller than wide, tilted −0.5 radians, with radius 1.8% to 6.8% of the longer side, filled with a radial gradient of the wall-in-sun colour that is solid to 40% of the radius and fades to the same colour at zero opacity at the edge (not to plain transparent, which would ring each disc in grey), drawn at up to 62% opacity so overlaps build to full sun. Each disc opens and closes by itself: opacity × clamp(sin(t × 0.21 × its rate + its phase) × 0.8 + 0.55, 0, 1).

The shadows. 54 smaller discs (60% of the radius) in the leaf-shadow colour at 22% opacity, laid out the same way, so the light is broken up.

Motion. A branch sways: sin(t × 0.32 × speed + phase) × 2.2% of the width plus sin(t × 0.83 × speed + 2 × phase) × 0.9%, with 40% of that vertically; each disc adds a tremble of 0.4% at 1.9 radians per second. Every disc on a branch therefore moves together. A wind option from 0 to 2 scales all of it. Draw every other frame.

Calm side. Multiply each disc's opacity by clamp((x − 0.18) × 2.4, 0.12, 1), where x runs 0 at the calm edge to 1 at the far edge, so the side holding content stays mostly in shade. Options: left, right, none.

Production behaviour: a children slot above the canvas; pause off screen and in hidden tabs; under reduced motion, or with motion set to "still", draw one frame and stop.`,
  interaction: "None: it is ambient.",
  animation: "Branches sway over about 20 seconds; single patches of light open and close over 30 to 120 seconds.",
  a11y: "Decorative canvas, hidden from assistive technology. The calm side keeps text contrast steady. Reduced motion shows one still frame.",
  responsive: "Fills its container; the picture is resolution-independent because it is drawn small and blurred.",
  touchFallback: "Nothing to touch.",
  variants: [
    { id: "plaster", label: "Plaster", prompt: "Colours: wall in shade #e4dccd, wall in sun #fffaf0, leaf shadow #cfc5b2, text #2b2620: morning light on pale plaster. Select it with the palette option set to \"plaster\"." },
    { id: "clay", label: "Clay", prompt: "Colours: wall in shade #cf9c7f, wall in sun #f9d9b6, leaf shadow #b98267, text #2a160d: late sun on a terracotta wall. Select it with the palette option set to \"clay\"." },
    { id: "moon", label: "Moon", prompt: "Colours: wall in shade #141b24, moonlit wall #3d5066, leaf shadow #0d131b, text #e6edf5; blend the grain with overlay at 18% instead of multiply: moonlight through the same tree. Select it with the palette option set to \"moon\"." },
  ],
  preview: { bg: "#e4dccd", mode: "fill", height: 560 },
};
