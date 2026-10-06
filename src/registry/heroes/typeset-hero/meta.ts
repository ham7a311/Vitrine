import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "typeset-hero",
  name: "Typeset Hero",
  category: "heroes",
  description: "A hero set like a typeset page: eyebrow, serif headline with one italic phrase, lede, one solid and one quiet action, and a ruled row of facts you can check. It owns no background; any backdrop sits behind a tint that covers only the text column.",
  tags: ["hero", "landing", "headline", "typography", "facts", "backdrop", "marketing", "product"],
  traits: ["ambient", "keyboard"],
  source: "original",
  files: ["TypesetHero.tsx", "typeset-hero.css"],
  dependencies: [],
  prompt: `Build a composable hero section for a product page: pure typography over whatever backdrop the page chooses. It must work over a flat colour, an SVG, an image or a WebGL canvas without knowing which.

Structure: section, relative, isolated, min-height 100%, container-type inline-size. A backdrop slot fills it behind everything (z -2). Content is bottom-aligned in a column at most 80rem wide with a clamp()ed gutter: a copy block (max 44rem) then, with a large gap, a facts row.

Copy block: mono eyebrow (11px, 0.16em, capitals, muted); an h1 in a display serif, clamp(2.6rem, 9.5cqi, 6.25rem), line-height 0.96, tracking -0.03em, balanced, with one phrase in italic via <em>; a muted lede at about 17px and 44ch; then actions: one solid pill (48px high, ink on the page colour) and one quiet text link underlined with a hairline that darkens on hover.

Facts: a <dl> of two to four term/value pairs in equal columns under a 1px rule: the term in mono capitals, the value in the serif at about 24px with tabular numerals. Below 34rem it becomes stacked rows with the value on the right.

Legibility without a panel: a flat tint of the page colour (opacity set by a scrim prop, default 0.7) sits behind the text column only, from the left edge to 52rem, with its right edge faded by a mask-image so it reads as light falling away. The rest of the backdrop is untouched.

Motion happens once. The eyebrow, headline and lede each rise out of their own overflow-hidden mask (translateY 105% to 0, 900ms cubic-bezier(.16,1,.3,1), 90ms apart); actions and facts fade in after. Paper and Night themes.`,
  interaction: "Nothing to operate except the two links; the page sets itself once on arrival.",
  animation: "Eyebrow, headline and lede rise from masks over 900ms, 90ms apart; actions and facts fade in at 320ms and 440ms.",
  a11y: "A real section with one h1; the backdrop and the tint are aria-hidden. Facts are a description list. Reduced motion shows everything immediately.",
  responsive: "Everything is sized from the section's own width (cqi), the facts stack at 34rem, and the tint covers the full width on a phone.",
  touchFallback: "No hover behaviour.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --th-bg #0c0b0e; --th-btn #efe8dc; --th-ink #efe8dc; --th-line rgb(239 232 220 / 0.18); --th-muted #a7a1ab; --th-on-btn #0c0b0e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --th-bg #f6f5f1; --th-btn #1b1a17; --th-ink #1b1a17; --th-line rgb(27 26 23 / 0.2); --th-muted #5f5c55; --th-on-btn #f6f5f1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0c0b0e", mode: "fill", height: 640, frame: [1280, 800] },
  isNew: true,
};
