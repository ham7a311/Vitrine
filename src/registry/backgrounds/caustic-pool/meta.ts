import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "caustic-pool",
  name: "Caustic Pool",
  category: "backgrounds",
  description: "Light refracted through moving water onto the floor of a dark pool — a web of filaments, split faintly into colour.",
  tags: ["background", "webgl", "shader", "water", "light", "ambient"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["CausticPool.tsx"],
  dependencies: [],
  prompt: `Write a WebGL1 fragment-shader background that looks like the bottom of a pool at night: a deep, nearly black blue floor crossed by the shifting web of caustic light that moving water throws down.

Build the caustics from cellular noise rather than sine soup: compute F2 − F1 (distance to the nearest cell edge) of a Worley field whose feature points drift in small circles over time. Turn each edge into a thin bright filament (1 − smoothstep(0, ~0.18), cubed). Use two such layers at different scales moving in opposite directions, add them, and add their product boosted — where the webs cross, the light pools into bright knots, just like real caustics. Bend the whole floor with a slow low-frequency swell. Sample the pattern three times with a tiny horizontal offset per channel for a faint chromatic split at the edges of every filament.

Grade it like water: brighter in the shallows (top), darker and bluer toward the bottom, with a soft vignette and fine dither. The cursor is a hand in the water: a gentle Gaussian lens around the pointer that magnifies and brightens the light beneath it, easing in and out. Render at 0.65× resolution (0.45× and ~30fps on touch), pause offscreen, and draw a single frame under reduced motion.`,
  interaction: "A soft magnifying lens of brighter light follows the pointer inside the pool and fades when it leaves.",
  animation: "Continuous shader time; feature points orbit; swell warps the floor; pointer lens eases at 6–8% per frame.",
  a11y: "Canvas is aria-hidden; reduced motion renders one still frame.",
  responsive: "Fills its container at reduced internal resolution for performance.",
  touchFallback: "No lens on touch; the light still moves.",
  promptAllow: ["night"],
  variants: [
    { id: "night", label: "Night pool", prompt: "Night pool: cool white-blue caustic light (tint #b9d4f0) over a near-black blue floor (depth #050a12)." },
    { id: "lagoon", label: "Lagoon", prompt: "Lagoon: aqua-mint caustics (tint #9ff0de) over a dark green-black floor (depth #03100f), like a shallow tropical lagoon at night." },
    { id: "lilac", label: "Lilac", prompt: "Lilac: pale violet caustics (tint #d8c8ff) over a violet-black floor (depth #0a0612)." },
  ],
  preview: { bg: "#050a12", mode: "fill" },
};
