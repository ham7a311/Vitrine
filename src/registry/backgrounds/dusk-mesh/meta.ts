import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dusk-mesh",
  name: "Dusk Mesh",
  category: "backgrounds",
  description: "The soft mesh gradient done properly: five colour points drifting and blended by distance, folded so the blend bends like silk, with crisp film grain and no banding. The colour nearest your pointer leans toward it on a spring.",
  tags: ["background", "webgl", "gradient", "mesh gradient", "grain", "ambient", "sunset"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["DuskMesh.tsx"],
  dependencies: [],
  prompt: `Write a WebGL1 mesh-gradient background that holds up at full screen.

Five colour points (uniform vec2 and vec3 arrays) drift on slow, unrelated sine paths computed in JS. In the shader, fold the space with two small sine warps of different frequencies so the boundaries between colours bend like cloth, then blend by inverse-distance weighting: each point's weight is 1 / (d² + 0.02)^1.6, plus a small constant weight for a base colour so the gaps never go muddy. Dither by one 8-bit step to remove banding.

The colour point nearest the pointer leans toward it — 55% of the way — on a spring (stiffness 26, damping 7) per point, and lets go when the pointer leaves, so the light seems to follow you.

Render the smooth field at half resolution, but put the grain in a separate CSS layer above the canvas (a tileable SVG feTurbulence data URL, overlay blend), so it stays crisp at any scale. ~40fps on desktop, ~25 on touch; stop requesting frames offscreen or in hidden tabs; draw one frame under reduced motion; fall back to layered CSS radial gradients without WebGL. Colours are a prop [base, five points].`,
  interaction: "The nearest colour leans toward the pointer on a spring, and settles back when it leaves.",
  animation: "Points drift on 35–60s cycles; the fold drifts more slowly; the lean is a damped spring.",
  a11y: "The canvas and grain are aria-hidden and decorative; content sits above them. Reduced motion draws one still frame.",
  responsive: "Fills its container; the field renders at half resolution and the grain at native resolution.",
  touchFallback: "No lean on touch; the colours still drift.",
  variants: [
    { id: "dusk", label: "Muscat dusk", prompt: "Colours [#1a1226 base, #e8774f, #f2b880, #7b5ea7, #2e3a87, #f04f6b]: a Muscat sunset — coral, apricot, violet, indigo and pink over plum; grain 0.5; text white." },
    { id: "palm", label: "Date palm", prompt: "Colours [#1c140d base, #c8873a, #e9c48a, #6b8f4e, #3c5a3a, #9a4a2a]: date-palm golds, olive greens and rust over dark brown; grain 0.5; text white." },
    { id: "lagoon", label: "Lagoon", prompt: "Colours [#03161c base, #14b8a6, #7dd3fc, #2563eb, #a7f3d0, #0e7490]: teal, sky, cobalt and mint over deep sea green; grain 0.5; text white." },
    { id: "morning", label: "Morning", prompt: "Colours [#f6efe4 base, #f3c9a8, #cfe0f0, #e8d7f1, #f7e3b5, #fbd5cf]: a light pastel morning — peach, powder blue, lilac, butter and blush on cream; lighter grain 0.35; text dark (#1b1a17)." },
  ],
  preview: { bg: "#1a1226", mode: "fill" },
};
