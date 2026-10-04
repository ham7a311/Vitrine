import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "wave-mesh",
  name: "Wave Mesh",
  category: "backgrounds",
  description: "A perspective field of dots rolling to the horizon like a slow sea. The pointer lifts a soft hill wherever it points on the ground, and a click sends a ring travelling out across the field.",
  tags: ["background", "canvas", "dots", "terrain", "perspective", "wave", "3d"],
  traits: ["canvas", "cursor", "click", "ambient"],
  source: "original",
  files: ["WaveMesh.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D background of a dot terrain in perspective, with no 3D library.

Lay out a grid of world points: x across, z (depth) from 0.35 to 3.4 spaced geometrically (so rows sit roughly evenly on screen), with the ground's half-width chosen from the far edge so the field always fills the frame. Project each with a pinhole camera 0.62 above the ground: sx = W/2 + x/z·f, sy = horizon + (camera − y)/z·f, horizon at 30% of the height. Height is three summed sines in x, z and time, a Gaussian hill under the pointer, and click rings.

The pointer maps back to the ground by inverting the projection for y = 0 (z = camera·f / (sy − horizon)), eased at 10% per frame; the hill grows in and fades as it enters and leaves. A click adds a ring at that ground point: a Gaussian band at distance age × 1.15 that decays with age and is dropped after 5s.

Draw rows far to near; each row shares a dot size (2.3/z, 0.8–3.2px) and a fog alpha, so a row is one fillStyle and many fillRects. Optionally draw the highest crests in an accent colour in a second pass. Stop requesting frames offscreen or in hidden tabs; draw one frame under reduced motion. Colours are a prop [background, dots, accent].`,
  interaction: "A hill follows the pointer across the ground; click or tap to send a ring outward from that spot.",
  animation: "The surface rolls continuously; the pointer hill eases at 10% per frame; rings travel at 1.15 units/s and fade over ~4s.",
  a11y: "The canvas is aria-hidden and decorative. Reduced motion draws one still frame.",
  responsive: "Grid density follows the container (56–150 columns, 48–90 rows); the focal length adapts so the horizon stays put.",
  touchFallback: "No hill on touch; tap to send a ring. Runs at ~33fps.",
  variants: [
    { id: "night", label: "Night", prompt: "Colours [#06070a, #c9d6ea, #f0b37a], crests off: pale blue-white dots on black; overlay text white." },
    { id: "paper", label: "Paper", prompt: "Colours [#f3efe6, #1b1a17, #2f5fd0], crests off: dark ink dots on warm paper, fog fading toward the paper colour; overlay text dark." },
    { id: "signal", label: "Signal", prompt: "Colours [#07080c, #8f97a8, #ff8a4c], crests on: grey dots on black with the highest crests redrawn in orange, so peaks read like a signal." },
  ],
  preview: { bg: "#06070a", mode: "fill" },
};
