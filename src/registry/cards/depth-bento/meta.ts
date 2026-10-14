import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "depth-bento",
  name: "Depth Bento",
  category: "cards",
  description: "A bento of soft colour tiles, each holding a small illustration built from flat planes — a stack of messages, a phone with notifications, a lit route through a graph, a week with events, design layers, two synced screens. Point at a tile and its planes part in depth while it leans towards you, with a thin rim of light where the pointer is.",
  tags: ["bento", "grid", "features", "3d", "parallax", "layers", "illustration", "tilt", "depth"],
  traits: ["hover", "cursor"],
  source: "original",
  isNew: true,
  files: ["DepthBento.tsx", "depth-bento.css", "layout.ts", "depth.ts"],
  dependencies: [],
  prompt:
    "Build a feature bento whose tiles are layered illustrations. Props: tiles [{id, title, body, tone (one of six colour names), scene, span {lg, md, sm} as [columns, rows], href}], eyebrow, title, lede, theme, rowHeight (236) and onNavigate. Export a Layer component: <Layer z={n}> is one absolutely placed plane of a scene, and z says how far it rises.\n\nGrid: 4 columns at 900px and over, 2 from 560px, 1 below (ResizeObserver on the grid), 14px gaps, dense flow. Tiles have 24px corners and a two-stop diagonal gradient per tone (deep and saturated at night, pale pastels on paper), a soft white sheen at the top right, the scene filling the top and the title and body at the bottom. A tile with a link stretches it over the tile.\n\nDepth: each tile's scene sits in a stage with perspective 900px and transform-style preserve-3d. Every layer is translateZ(z × lift), where lift is 4px at rest and 20px while the tile is pointed at, eased over 520ms with a slight overshoot, so the planes part when you arrive and settle when you leave. On pointermove the scene leans towards the pointer — rotateX/rotateY up to 8°, worked out from the pointer's position in the tile (0–1 each way, centred) — eased over 420ms, and resets on leave. A 1px rim of light, a radial gradient masked to the tile's border at the pointer, fades in on hover.\n\nScene parts: frosted panes (translucent white with a hairline and a soft drop shadow, slight backdrop blur), rounded text lines, dots, and solid pills. Demo scenes: a stack of three message cards with a 'Reply in 2m' pill above; a phone body, its screen lines, and two notifications on higher planes; a node graph with one lit node and a latency pill; a week grid with two event pills rising off it; three frames pulled apart; a laptop and a phone with a dashed sync arc and a 'Synced' pill.\n\nReduced motion: no tilt and no lift. Touch: no tilt; the tiles stay flat and still.",
  interaction: "Point at a tile: its planes lift apart and it leans towards the pointer, with a rim of light at the edge nearest it.",
  animation: "Layers rise over 520ms with a slight overshoot; the lean eases over 420ms; the rim fades in over 300ms. Reduced motion keeps everything flat.",
  a11y: "A labelled section of articles with real headings. The scenes are decorative and hidden from assistive tech. Links stretch over their tile with a visible focus ring.",
  responsive: "Four, two or one columns from the grid's own width; spans clamp to fit; the scenes are laid out in percentages so they scale with their tile.",
  touchFallback: "No tilt or lift on touch; tiles are static illustrations.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --db-ground #07070b; --db-ink #f5f4fa; --db-mark rgba(255, 255, 255, 0.55); --db-muted rgba(245, 244, 250, 0.72); --db-pane rgba(255, 255, 255, 0.13); --db-pane-line rgba(255, 255, 255, 0.22); --db-shadow 0 18px 30px -16px rgba(0, 0, 0, 0.55); --db-solid rgba(255, 255, 255, 0.92). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --db-ground #f6f4ef; --db-ink #17161c; --db-mark rgba(23, 22, 28, 0.32); --db-muted rgba(23, 22, 28, 0.7); --db-pane rgba(255, 255, 255, 0.62); --db-pane-line rgba(255, 255, 255, 0.95); --db-shadow 0 16px 28px -16px rgba(40, 30, 60, 0.35); --db-solid #17161c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#07070b", mode: "fill", frame: [1440, 1100] },
};
