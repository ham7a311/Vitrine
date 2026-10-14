import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "light-sash",
  name: "Light Sash",
  category: "backgrounds",
  description: "One wide blade of light crosses the frame on a diagonal, like a long-exposure sweep: a coloured body streaked along its length, a pale hot edge and a haze beyond it. The pointer turns the blade. A background only, with no text of its own.",
  tags: ["background", "light", "diagonal", "streak", "glow", "gradient", "soft", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["LightSash.tsx", "light-sash.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): one wide blade of light crossing the frame on a diagonal.\n\nChoose a direction about 34\u00b0 above horizontal (the pointer turns it a little). For each pixel take along (the distance along the blade) and s (the signed distance across it, from a line passing right of centre), and wobble s with a slow sine along the blade and soft fBm. Layer the colours across s: a dim upper band (Gaussian at s \u2248 0.5), the coloured body (Gaussian at s \u2248 0.16, width 0.17), a slight darker channel just below it, a pale hot edge rising as s goes negative and a near-white haze beyond (smoothstep(\u22120.2, \u22120.62, s)). Streak the bands with fBm stretched along the blade and moving along it, like a long exposure. Darken the top-left slightly.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer to turn the blade.",
  animation: "The streaks flow along the blade and its edge wavers slowly. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The upper-left is dark and suits white text; the lower-right is near white and suits dark text.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the streaks keep flowing.",
  variants: [
    { id: "lagoon", label: "Lagoon", prompt: "A teal blade with a mint edge and white-mint haze: bg #031a17, body #2a877e, edge #9ee6d6, haze #eefcf7." },
    { id: "lilac", label: "Lilac", prompt: "A lavender blade with a pale violet edge: bg #0d0a1c, body #6a5ab8, edge #cfc3ff, haze #f7f3ff." },
    { id: "sand", label: "Sand", prompt: "A bronze blade with a cream edge: bg #19110a, body #977146, edge #ebd1a5, haze #fff8eb." },
  ],
  preview: { bg: "#031a17", mode: "fill", height: 600 },
};
