import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tile-breaker",
  name: "Tile Breaker",
  category: "sections",
  description: "A section that opens under a bold band of repeating tiles, which flip into place in a diagonal wave as it scrolls into view. A centred headline, two buttons and a strip of check points follow, and the section ends in a mirrored band of the same tiles dissolving under a progressive blur.",
  tags: ["section", "section breaker", "divider", "pattern", "tiles", "hero", "cta", "progressive blur", "features"],
  traits: ["scroll", "hover", "keyboard"],
  source: "original",
  isNew: true,
  files: ["TileBreaker.tsx", "tile-breaker.css", "motifs.ts"],
  dependencies: [],
  prompt:
    "Build a page section that opens under a band of repeating tiles. Props: eyebrow, title, lead, primary and secondary {label, href}, points (strings), motif (one of three tile shapes), palette {ground, tile, onTile, ink, muted, line}, blur (on by default) and onNavigate.\n\nThe band: two rows of identical tiles in the tile colour on the section ground, each tile clamp(46px, 6.4vw, 96px) wide and 0.78 of that tall, centred and clipped at the sides (render 30 columns so any width is covered). Each tile is one SVG path on a 100 × 100 grid stretched to the tile: a leaning leaf with two rounded corners (side by side, the gaps read as waves), a round-headed arch with a doorway, or three steps climbing to the right. When the section first scrolls into view (IntersectionObserver, 15%), every tile flips into place from −90° and 35% scale with a slight overshoot (620ms), delayed by (column + 2 × row) × 26ms so the band fills as a diagonal wave from the top-left. Under reduced motion the tiles are simply there.\n\nThe body is centred, at most 62rem wide: a pill eyebrow with a hairline border and a small rotated square in the tile colour; the title (up to 4.6rem, weight 600, −0.045em, balanced, 17ch); a muted lead (54ch); two buttons side by side — a solid one in the tile colour with onTile text and a soft coloured shadow that lifts 1px on hover, and a hairline ghost one whose arrow nudges right on hover; then the points as one horizontal strip under a hairline, each with a small tinted check, divided by vertical hairlines.\n\nThe foot: a mirrored copy of the band (flipped vertically) along the bottom edge, under a soft glow of the tile colour and a fade from the ground colour, then six stacked layers with backdrop-filter blur 1, 2, 4, 8, 16 and 32px, each masked by a linear gradient to its own overlapping slice, so the tiles grow steadily blurrier towards the bottom and the section ends in a soft blur.\n\nUse a container query: below 640px the buttons stack full width and the points stack as rows divided by horizontal hairlines.",
  interaction: "Scroll the section into view and the tiles flip in. The buttons lift and nudge on hover; focus is a 2px ring in the tile colour.",
  animation: "Tiles flip in once with a staggered diagonal wave over about 1.6s; buttons ease over 160ms. Reduced motion shows the band without animation.",
  a11y: "A section labelled by its heading. The bands and the blur are decorative and hidden. Buttons are real links; the check marks are decorative and the points are a list. Every palette keeps text at 4.5:1 or better, including the button label on the tile colour.",
  responsive: "Tiles scale with the viewport and stay centred; a container query stacks the buttons and the points below 640px.",
  touchFallback: "Nothing depends on hover; the flip-in runs on scroll.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Leaf tiles. Ground #efe9df, tile #b0441f, onTile #fbf7f0, ink #1d1712, muted #5e554c, line rgba(29, 23, 18, 0.14): warm bone with terracotta." },
    { id: "night", label: "Night", prompt: "Arch tiles. Ground #0f1012, tile #c6f432, onTile #10130a, ink #f3f3ee, muted #a3a49c, line rgba(243, 243, 238, 0.12): near-black with electric lime." },
    { id: "sea", label: "Sea", prompt: "Step tiles. Ground #e3ebe9, tile #0f5c5a, onTile #f1f7f6, ink #0d1f1e, muted #4a5c5a, line rgba(13, 31, 30, 0.14): mist with deep teal." },
  ],
  preview: { bg: "#efe9df", mode: "fill", frame: [1440, 900] },
};
