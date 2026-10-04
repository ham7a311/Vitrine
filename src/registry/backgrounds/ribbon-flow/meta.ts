import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ribbon-flow",
  name: "Ribbon Flow",
  category: "backgrounds",
  description: "Translucent ribbons drift across the field and add light where they cross — silk, or aurora seen edge-on.",
  tags: ["background", "canvas", "ribbons", "gradient", "generative", "cursor"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["RibbonFlow.tsx"],
  dependencies: [],
  prompt: `Create a background of translucent ribbons. Each ribbon is a filled band between two edges; each edge is the ribbon's centre line plus a thickness offset. The centre line is a sum of two travelling sines (different frequencies and speeds per ribbon) and the thickness itself breathes along the ribbon, so it twists between thick and thin like a piece of silk turning in air.

Fill each band with a horizontal linear gradient that is transparent at both ends and ~33% opacity in the middle so ribbons fade in and out at the edges; add a hairline 25% stroke. Composite with globalCompositeOperation "screen" over a near-black background so overlaps add light and crossings glow. One ribbon per colour in the colours prop.

The pointer bends ribbons: edge points near the cursor are pushed away along y with a Gaussian falloff (radius ≈ 130px, up to 46px), easing in and out. Draw at ~30fps, pause offscreen or in hidden tabs, cap DPR at 2, and draw a single still frame under reduced motion.`,
  interaction: "The cursor pushes the ribbons aside as it passes over them.",
  animation: "Continuous sine travel per ribbon; ~30fps canvas; cursor influence eases at 6% per frame.",
  a11y: "Canvas is aria-hidden; reduced motion draws a still frame and disables the cursor effect.",
  responsive: "Fills its container; segment count scales with width.",
  touchFallback: "No cursor bend on touch; the ribbons still drift.",
  variants: [
    { id: "aurora", label: "Aurora", prompt: "Four ribbons in cool aurora tones — #8fa8d8, #a898e0, #7fc4c8, #d8a8c8 — on #08060c." },
    { id: "ember", label: "Ember", prompt: "Four ribbons in fire tones — #e8a24a, #d8704a, #f0c890, #a85a6a — on warm black #0b0706." },
    { id: "mono", label: "Mono", prompt: "Three ribbons, near-monochrome — cream #efe8dc, grey #a7a1ab and a pale blue #b9cce4 — on #08070a." },
  ],
  preview: { bg: "#08060c", mode: "fill" },
};
