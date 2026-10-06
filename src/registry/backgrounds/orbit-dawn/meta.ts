import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "orbit-dawn",
  name: "Orbit Dawn",
  category: "backgrounds",
  description: "A ringed light rising over a dark horizon, with a white-hot core, thin pink striations and a wide halo, under faint orbit lines with drifting nodes and twinkling stars. A background only, with no text.",
  tags: ["background", "glow", "sunrise", "orbit", "rings", "stars", "arc", "webgl", "shader", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["OrbitDawn.tsx", "dawn.ts", "orbit-dawn.css"],
  dependencies: [],
  prompt: `Build a full-bleed dark background with no text: a ringed light rising over a horizon near the bottom, under a faint star chart. Draw it in one WebGL1 full-screen triangle (no libraries) and leave an optional slot for content on top.

Units: measure everything in u = min(height, 0.75 × width), so phones keep the arch inside the frame. The centre sits at x 50%, y 90% of the height (+0.02u), just under a horizon at 88%.

Dawn ring, from the inside out, with r the distance from the centre in u: a dome of the glow colour inside r 0.125; a thin white-hot ring (Gaussian at r 0.112, width 0.011); a lilac gap ring at 0.14; a broad bright band at 0.19 (width 0.036); six thin fringe-colour striations from r 0.226, every 0.0115, each fainter; a soft fringe ring at 0.25; then the glow colour falling off exponentially (0.11 near, 0.42 far) into a wide halo. Sum the layers and tone-map with 1 − exp(−1.15x) so the core whitens but the halo stays saturated. Two noise layers sampled along the angle and radius drift with time and modulate the striations and band, so thin bright streaks shimmer round the arch; the whole ring breathes ±4%.

Orbits: five 1px hairlines centred on the same point at r 0.287, 0.42, 0.56, 0.71 and 0.87, white at 8.5% (fainter outward). Each carries three small hollow circles (radius 0.0084u, 1px stroke, 20%) near 43°, 89° and 136°, drifting round slowly, alternate rings in opposite directions.

Stars: a jittered grid (cells 0.028u); the chance of a star rises from 3.5% far away to 25% near the glow; each is a 0.6–1.4px dot twinkling at its own rate. A faint lift of the glow colour sits at the top centre.

Horizon: below 88% everything is dimmed to 62% (as if seen through frosted glass) with a soft haze, a band of light lies along the horizon (Gaussian 0.018u, fading sideways) and a faint 1px line marks it.

Motion: about 30fps, paused offscreen and in hidden tabs; reduced motion draws one still frame. A fine pointer leans the centre up to 1.5% toward it, eased. Without WebGL a radial gradient from the same palette stands in. Props: palette [night, glow, fringe, core], lift (ring size), speed, motion, children.`,
  interaction: "A fine pointer leans the whole sky a little toward it; there is nothing to click. Content placed inside works as normal.",
  animation: "Ring breath ±4% on a ~12s cycle, striation streaks drift at 0.35–0.5 per second, nodes orbit at 0.012–0.024 rad/s, stars twinkle at 0.6–2.2 rad/s; pointer lean eased at 0.04; about 30fps.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Text placed over the upper half sits on near-black; keep it off the white band.",
  responsive: "Fills its container. Sizes follow min(height, 0.75 × width), so on phones the arch narrows to stay inside the frame; DPR capped at 2.",
  touchFallback: "No pointer lean on touch; the light keeps breathing and the stars keep twinkling.",
  isNew: true,
  variants: [
    { id: "violet", label: "Violet", prompt: "Palette [#05031a night, #7239ea glow, #ee9cf6 fringe, #fbf6ff core]: a violet dawn with pink striations on indigo-black." },
    { id: "cyan", label: "Cyan", prompt: "Palette [#020a16 night, #1677e8 glow, #7fe3f5 fringe, #f3fdff core]: a cold blue dawn with ice-cyan striations." },
    { id: "amber", label: "Amber", prompt: "Palette [#120804 night, #e2561c glow, #ffc27a fringe, #fffaf0 core]: a burnt-orange sunrise with gold striations." },
    { id: "emerald", label: "Emerald", prompt: "Palette [#020f0b night, #0f9a6e glow, #8cf0c4 fringe, #f2fff9 core]: a green aurora dawn with mint striations." },
  ],
  preview: { bg: "#05031a", mode: "fill", height: 600 },
};
