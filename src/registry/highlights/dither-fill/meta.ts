import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-fill",
  name: "Dither Fill",
  category: "highlights",
  description: "A highlight printed in pixels: the fill arrives as a 4×4 ordered dither — a speckled front that sweeps across and darkens to solid behind it — and the far end stays dithered, fading out like an old screen print. Point at it to run the sweep again.",
  tags: ["highlight", "dither", "pixel", "bayer", "retro", "canvas", "headline"],
  traits: ["hover", "canvas", "scroll"],
  source: "original",
  files: ["DitherFill.tsx", "dither.ts", "dither-fill.css"],
  dependencies: [],
  prompt: `Build a pixel-dithered highlight for one word of a bold Geist headline — "Software that feels [handmade.]" — in phosphor green on a near-black page, with dark letters on the fill once it lands.

Construction: an inline-block, nowrap wrapper (.1em inline margin, padding 0 .6em 0 .14em — the extra room on the right holds the dithered tail past the last letter) with a canvas behind the word (z-index −1, inset .04em 0 .02em). The canvas is sized in device pixels (devicePixelRatio, capped at 3) from a ResizeObserver and drawn in whole device pixels per cell (3 CSS px by default), with image-rendering: pixelated, so every cell is crisp.

Dither: a 4×4 Bayer matrix gives each cell a threshold ((v + .5) / 16). At progress p (0–1) the cell in column i is inked when its threshold is below min(front, tail): front = clamp((1.35p − x) / .35) where x is the column's centre as a fraction of the width — a dithered front 35% of the width wide that sweeps left to right with solid fill behind it — and tail fades from 1 to .25 over the last 14% of the width, so the far end stays speckled when the sweep is done.

Motion: when the word is 80% in view, p runs 0 → 1 over 1100ms with ease-out cubic on requestAnimationFrame. The words are printed twice: in the page's colour, and on top an aria-hidden copy in the ink colour (dark on green, white on blue) clipped with inset(0 calc(100% − solid) 0 0), where solid = clamp(1.35p − .35) is updated every frame — so each letter turns to the ink colour exactly when the solid fill reaches it. Pointing at a finished highlight runs the sweep again. Reduced motion draws it finished.`,
  interaction: "Point at the word to print it again.",
  animation: "Sweep 1100ms ease-out; letters change colour exactly as the solid fill reaches them.",
  a11y: "The canvas is aria-hidden; the word is real text, read once (the ink copy is aria-hidden), with 4.5:1 or better everywhere: each letter switches to the ink colour (near-black on #7cff8a, white on #2448ff) the moment solid fill is under it.",
  responsive: "Cells stay a fixed pixel size while the canvas follows the word's size, so larger type gets more pixels rather than bigger ones.",
  touchFallback: "It prints once on view; tapping does not replay it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --dither #7cff8a; --on-dither #06120a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --dither #2448ff; --on-dither #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#070908", mode: "fill" },
  isNew: true,
};
