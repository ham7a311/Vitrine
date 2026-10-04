import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tessera",
  name: "Tessera",
  category: "backgrounds",
  description: "A frosted-glass mosaic of tilted panes that catch a slowly sweeping light — and warm in colour near your cursor.",
  tags: ["background", "webgl", "voronoi", "glass", "light", "cursor"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["Tessera.tsx"],
  dependencies: [],
  prompt: `Write a WebGL1 background that looks like a wall of leaded, frosted glass. Tile the surface with a Voronoi diagram (about seven panes across the shorter side) whose feature points breathe very slowly, and treat every cell as a separate pane of glass.

Give each pane its own tilt from a hash of its cell id, turn that into a surface normal, and light it with a directional light that sweeps slowly across the wall over ~50 seconds: Lambert diffuse for the body of the pane plus a tight specular glint, so panes flare and dim one by one as the light passes. Add fine per-pixel frost noise inside each pane, vary each pane's thickness a little, and draw dark leading along the edges (F2 − F1 below ~0.05) with a faint bevel highlight just inside each edge. Finish with a gentle vignette.

The cursor warms the glass: compute each pane's centre and blend panes within ~0.3 of the pointer toward the palette's warm tint, so whole tiles change colour rather than a round spotlight — the mosaic stays a mosaic. Ease pointer position and strength. Render at 0.8× (0.6× and ~30fps on touch), pause offscreen, and draw one still frame under reduced motion. Palette: [grout, glass, highlight, warm].`,
  interaction: "Panes near the cursor warm toward the accent colour, tile by tile, and cool again when it leaves.",
  animation: "Light sweeps continuously (~50s cycle); feature points breathe; pointer warmth eases at 5–10% per frame.",
  a11y: "Canvas is aria-hidden; reduced motion renders a single still frame.",
  responsive: "Tile count scales with the container's shorter side; density is a prop.",
  touchFallback: "No warming on touch; the light sweep carries it.",
  promptAllow: ["frost"],
  variants: [
    { id: "frost", label: "Frost", prompt: "Frost glass: palette [#07050a grout, #7f93b8 glass, #eef3fb highlight, #c8a0e0 warm] — cool blue-grey panes that warm to lilac under the cursor." },
    { id: "amber", label: "Amber", prompt: "Amber glass: palette [#080604, #b88a4c, #fff1d6, #ff8a5c] — honey-amber panes with cream glints that warm to coral under the cursor." },
    { id: "sea", label: "Sea glass", prompt: "Sea glass: palette [#03080a, #4f8f9a, #e6fbff, #9ff0de] — teal panes with icy glints that warm to mint under the cursor." },
  ],
  preview: { bg: "#07050a", mode: "fill" },
};
