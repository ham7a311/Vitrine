import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bento-grid",
  name: "Bento Grid",
  category: "cards",
  description: "A product bento where every tile holds a small piece of working interface — a live traffic chart, a command palette typing itself, presence, real settings switches, an install snippet with package-manager tabs and a turning dotted globe — under one soft light that follows the pointer across the whole grid.",
  tags: ["bento", "grid", "features", "cards", "saas", "landing", "dashboard", "spotlight"],
  traits: ["hover", "cursor", "click", "keyboard", "touch", "ambient"],
  source: "original",
  isNew: true,
  files: ["BentoGrid.tsx", "bento-grid.css", "layout.ts", "tiles.tsx", "tiles.css"],
  dependencies: [],
  prompt:
    "Build a bento grid section. Props: tiles [{id, title, body, visual, span {lg, md, sm: [columns, rows]}, textFirst, href}], eyebrow, title, lede, theme, rowHeight (default 244px) and onNavigate.\n\nThe grid measures its own width: four columns from 900px, two from 560px, otherwise one; each tile's span is chosen for the current column count (falling back to the next size that's set) and clamped so it never overflows a row. 12px gaps, tiles 22px radius on a near-black ground, a 1px inner hairline, no shadows. Each tile stacks its visual and its text (title 1.04rem/600 and a muted line), visual first unless textFirst; a tile with href gets a small arrow link beside its title, so interactive visuals inside it stay usable.\n\nOne light for the whole grid: on pointer move, give every tile the pointer position in its own coordinates (throttled to animation frames) and draw two radial gradients from it — a faint wash inside the tile and a brighter ring on its border only (a 1px masked border), so the light catches the edges of every tile near the pointer, including neighbours. It fades in on enter and out on leave, and is off on touch.\n\nThe demo's tiles are small working pieces of interface: a requests-per-second area chart that ticks every 900ms with its value and change; a command palette that types queries and steps through results; overlapping teammate avatars with two drifting named cursors and '8 editing now'; three real switches; an install command with npm, pnpm and bun tabs and a copy button that only says Copied after the clipboard write succeeds; and a canvas globe of dots turning slowly with pulsing region pings. Every animation runs only on screen, stops in hidden tabs and is off under reduced motion.",
  interaction: "Move the pointer across the grid and one soft light follows it, catching tile edges. Inside the tiles: flip the switches, change package manager, copy the command, follow the arrow links.",
  animation: "The light follows the pointer every frame and fades in and out over 350ms. The chart ticks every 900ms, the palette types every 420ms, the globe turns continuously and the cursors drift. Everything pauses offscreen and stops under reduced motion.",
  a11y: "A labelled section of articles with real headings. The switches are role=switch with labels, the package managers are tabs, copy confirms only after it succeeds, and arrow links are named for their tile. The animated chart and palette are decorative and hidden from assistive tech.",
  responsive: "Four, two or one columns from the grid's own width, with spans per breakpoint; row height stays fixed so tiles keep their proportions.",
  touchFallback: "No light on touch; every control is a tap target and nothing needs hover.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bento-accent #6ea8ff; --bento-faint #858580; --bento-glow rgba(255, 255, 255, 0.045); --bento-good #4fd18b; --bento-ground #080808; --bento-ink #f3f3f1; --bento-light rgba(255, 255, 255, 0.5); --bento-line rgba(255, 255, 255, 0.075); --bento-muted #9c9c97; --bento-tile #111112; --bento-tile-2 #161617. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bento-accent #2f6fe0; --bento-faint #6a6862; --bento-glow rgba(20, 20, 18, 0.035); --bento-good #138a4d; --bento-ground #f2f1ed; --bento-ink #151513; --bento-light rgba(20, 20, 18, 0.35); --bento-line rgba(20, 20, 18, 0.09); --bento-muted #5d5b55; --bento-tile #ffffff; --bento-tile-2 #f6f5f1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#080808", mode: "fill", frame: [1440, 1000] },
};
