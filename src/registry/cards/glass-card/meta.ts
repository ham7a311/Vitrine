import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-card",
  name: "Glass Card",
  category: "cards",
  description: "A card set into a small wall of glass tiles with light moving behind it, its content on a clear pane at the bottom.",
  tags: ["card", "glass", "tiles", "webgl", "pricing", "neon", "feature", "dark"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  files: ["GlassCard.tsx", "glass-card.css", "../../backgrounds/glass-tiles/GlassTiles.tsx", "../../backgrounds/glass-tiles/glass-tiles.css"],
  dependencies: [],
  prompt: `Build a premium card (22.5rem wide, 4:5.4, 24px radius, a faint white ring and a violet drop glow) whose surface is the Glass Tiles shader at card scale: four squircle glass tiles across with light beams and pools drifting behind them and a lamp under the pointer, each tile's bevel catching the light as bright curved lines. The content sits on a clear pane at the bottom — a gradient from nearly opaque dark violet up to transparent, so the tiles stay visible above — with a mono eyebrow, a 1.5rem title, a muted price line, a short feature list with small glowing dots, and an action (here the Glass Slab button). The shader pauses offscreen and renders a still frame under reduced motion; without WebGL the tiles fall back to a CSS gradient grid.`,
  interaction: "The pointer carries a light behind the tiles; the action inside works as normal.",
  animation: "The tile light drifts continuously at a slow pace; the lamp follows the pointer.",
  a11y: "The card is an article with a real heading and list; the tile canvas is decorative and aria-hidden; contrast comes from the opaque lower pane, not the tiles. Reduced motion shows a still frame.",
  responsive: "Fills narrower screens up to 22.5rem and keeps its proportions.",
  touchFallback: "No pointer lamp on touch; the light keeps moving on its own.",
  preview: { bg: "#05030a", mode: "fill", height: 640 },
};
