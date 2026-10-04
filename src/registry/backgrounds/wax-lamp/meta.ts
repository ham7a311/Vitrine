import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "wax-lamp",
  name: "Wax Lamp",
  category: "backgrounds",
  description: "A lava lamp, properly: wax warms in the pool, rises, cools at the top and sinks, merging and pinching apart on the way — drawn as one smooth glossy surface with a bright rim and a warm glow where it's thick. Hold the pointer near a blob to warm it.",
  tags: ["background", "webgl", "shader", "lava lamp", "metaballs", "retro", "glow", "physics", "ambient"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["WaxLamp.tsx"],
  dependencies: [],
  prompt: `Build a WebGL lava-lamp background: CPU physics for the wax, one full-screen fragment shader for the look.

Physics (9 blobs in a space x ∈ 0…aspect, y ∈ 0…1 upward): each blob has a radius (0.045–0.095) and a temperature. It heats in the pool (y < 0.2: +3.2·(0.2 − y)/s), cools near the top (y > 0.68: −2.4·(y − 0.68)/s) and drifts back toward 0.45. Buoyancy is (T − 0.5)·0.32 upward; drag e^(−1.4t); a slow sideways sway and a pull toward the middle; soft walls; overlapping blobs push apart gently so they pinch off instead of fusing. The pointer warms blobs within a Gaussian (σ 0.12) so they lift. Simulate ~30s before the first frame so it opens mid-flow.

Shader: a metaball field with compact support, f = Σ (1 − d²/R²)³ with R = 2r (so blobs only join when they actually meet, and pinch apart cleanly), over the moving blobs plus five fixed ones (a pool of three along the bottom and a cap at the top). The surface is f = 0.3, anti-aliased by the field's analytic gradient; the normal tilts by −∇f near the edge and faces the viewer inside. Wax colour runs from its base to its lighter tone with thickness (f from 0.3 to 1.3) with a faint hot core; lit with diffuse, a sharp specular highlight (power 28) and a fresnel rim. The liquid is a vertical gradient, darker toward the sides as if seen through a glass cylinder (sin(πx)), warmed by the heater at the bottom and by light leaking from nearby wax; a faint vertical highlight on the glass and fine grain finish it.

Render at 75% resolution (50% on touch, ~33fps), one loop paused offscreen and in hidden tabs; a CSS gradient stands in without WebGL; reduced motion draws one settled frame.`,
  interaction: "Hold the pointer near a blob to warm it so it rises.",
  animation: "Continuous while visible: blobs take ~20–40s per round trip.",
  a11y: "The canvas is aria-hidden and decorative; overlay content sits above it. Reduced motion shows one still frame.",
  responsive: "The simulation keeps blob positions proportional on resize; resolution scales with the canvas.",
  touchFallback: "Touch-drag warms the wax; lower resolution and ~33fps.",
  variants: [
    { id: "sunset", label: "Sunset", prompt: "theme=\"sunset\": orange wax in plum liquid." },
    { id: "lagoon", label: "Lagoon", prompt: "theme=\"lagoon\": teal wax in deep blue-green liquid." },
    { id: "mono", label: "Mono", prompt: "theme=\"mono\": milky white wax in graphite liquid." },
  ],
  preview: { bg: "#12061f", mode: "fill" },
};
