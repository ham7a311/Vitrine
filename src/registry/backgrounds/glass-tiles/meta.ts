import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-tiles",
  name: "Glass Tiles",
  category: "backgrounds",
  description: "A wall of thick rounded glass tiles with light moving behind it; each bevel catches the passing beams as bright lines hugging the tile's edge.",
  tags: ["background", "glass", "tiles", "webgl", "shader", "neon", "grid", "refraction"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["GlassTiles.tsx", "glass-tiles.css"],
  dependencies: [],
  prompt: `Write a WebGL1 full-screen fragment shader background (one triangle, no libraries): a wall of thick, rounded-square glass tiles (8 across, about 4–5 on phones) with light moving behind it.

Behind the glass: three slow beams — Gaussian lines (σ ≈ 2% of the height) whose height is a sum of two sines across x, drifting at different speeds — plus three soft pools wandering on slow Lissajous paths, and a small lamp that follows the pointer (eased, fading in and out on enter and leave).

Each tile is a squircle, (|x|⁹ + |y|⁹)^(1/9) < 0.955 in tile space, leaving a thin dark grout; its normal is the squircle gradient, which has no creases on the diagonals; across the outer 55% of the tile (the bevel) the bend rises as edge^2.2. Through the face the light is sampled almost straight and dimmed (a frosted 22%); through the bevel it is sampled from well inside the tile, pulled against the normal, so when a beam passes behind a tile it appears as a bright line running along that tile's inner edge, curving round the corners, exactly as light does in thick glass. Add a faint fresnel at the very edge, a slight top-to-bottom gradient so each tile reads as a block, and push the brightest rim values toward white.

Render at 0.85× resolution (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to a CSS gradient and grid without WebGL. Children sit above the canvas.`,
  interaction: "The pointer carries a small lamp behind the wall; its light catches in the bevels of the nearest tiles.",
  animation: "Beams and pools drift continuously on slow sines; the lamp follows with a 0.12 lerp and fades in and out at 0.06.",
  a11y: "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; rim highlights can be bright.",
  responsive: "Tile count drops to about half on screens under 640px so tiles stay chunky; DPR capped at 2.",
  touchFallback: "No lamp on touch; the beams keep moving.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Palette { glow #c25cff, deep #3a1a8a, ground #07040e }: neon violet light in near-black violet glass, as in a night club wall." },
    { id: "ice", label: "Ice", prompt: "Palette { glow #7fd8ff, deep #12406b, ground #03070d }: icy cyan light in deep blue glass." },
    { id: "ember", label: "Ember", prompt: "Palette { glow #ff8a3d, deep #6b2410, ground #0c0503 }: ember-orange light in smoked amber glass." },
  ],
  preview: { bg: "#07040e", mode: "fill", height: 600 },
};
