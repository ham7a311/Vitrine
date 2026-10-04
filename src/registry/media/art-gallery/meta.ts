import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "art-gallery",
  name: "Art Gallery",
  category: "media",
  description: "An endless wall of framed studies seen through a lens: drag to travel, and the wall pulls back while you move.",
  tags: ["gallery", "grid", "webgl", "shader", "drag", "infinite", "portfolio", "images"],
  traits: ["webgl", "touch", "keyboard", "cursor"],
  source: "original",
  files: ["ArtGallery.tsx", "studies.ts", "art-gallery.css"],
  dependencies: [],
  prompt: `Build an infinite, draggable image wall in raw WebGL1 (no libraries): one full-screen triangle and one fragment shader that draws everything.

World: screen UV → (vUv − 0.5)·2, barrel-distorted by (1 − 0.08·r²), aspect-corrected, multiplied by a zoom and offset by a pan vector; divided by a cell size (0.75 world units) it gives a cell id (floor) and a cell UV (fract), so the grid repeats forever. Each cell shows image (cellId.x + cellId.y·atlasColumns) mod count, so repeats sit about five cells apart, from a square texture atlas, inset to 60% of the cell with a soft 0.01 edge, a caption strip below it (title left, year right, monospace capitals, grey) sampled from a second atlas, and a 0.005 hairline frame. The cell under the pointer (found by running the pointer through the same distortion) gets a faint tint. Past radius 1.2 the wall fades into the background colour by 1.8.

Images: either your own URLs (square-cropped into the atlas) or 25 generative "studies" painted on canvas from a seed — flow-field strokes, concentric rings, soft colour fields, warped stripes, Swiss dot grids, horizons and shards across twelve palettes, with film grain — so the default needs no files.

Motion: pointer drag pans (2 px per world unit of height), the target is chased with a 0.075 lerp; once a drag moves more than 2px the zoom eases to 1.25 (the wall pulls back) and returns to 1 on release, with a little flick momentum (×0.92 per frame). Wheel and arrow keys pan too (Shift for three cells). The loop runs only while something is still moving, and pauses offscreen and in hidden tabs. While atlases build, three gooey dots (an SVG blur + alpha-threshold filter) show a loading state; a mono "Drag to explore" hint fades after the first move.`,
  interaction: "Drag, flick, scroll or use the arrow keys to travel across the wall; the frame under the pointer lights faintly.",
  animation: "Pan lerp 0.075, drag zoom 1 → 1.25 → 1, flick momentum ×0.92 per frame; the canvas fades in over 700ms when the atlases are ready.",
  a11y: "The region is focusable with a label explaining drag, scroll and arrow keys. Every title and year is in a visually hidden list. Reduced motion pans directly, with no lerp, zoom or momentum. Without WebGL it falls back to a plain list of works.",
  responsive: "Fills its container and re-measures with a ResizeObserver; the lens keeps the same feel at any aspect. DPR capped at 2.",
  touchFallback: "Touch drags pan the wall the same way; there's no hover tint on touch.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#000000", mode: "fill", height: 600 },
};
