import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pixel-seam",
  name: "Pixel Seam",
  category: "sections",
  description: "A section whose edges are made of squares: at the top it dithers in out of the section before it, at the bottom it breaks back up into the one after, the squares popping in row by row when it scrolls into view. Left-aligned copy with two actions, and a row of figures that count up once the seam has formed.",
  tags: ["section", "breaker", "pixel", "dither", "8-bit", "stats", "transition", "svg", "scroll", "reveal"],
  traits: ["scroll"],
  source: "original",
  isNew: true,
  files: ["PixelSeam.tsx", "pixel-seam.css", "seam.ts"],
  dependencies: [],
  prompt:
    "Build a section whose top and bottom edges are pixel seams. Props: eyebrow, title, lead, stats [{value, label, prefix, suffix, decimals}], primary and secondary links {label, href}, palette {above, below (the neighbouring sections' colours), ground, ink, muted, line, accent, onAccent}, cell (18px), rows (7), onNavigate and className.\n\nSeam (pure functions): row r of n is filled to a density of ((r + 0.5) / n)^1.2 — nearly empty at the outer edge, nearly solid next to the section; a square is filled where its 4 × 4 Bayer threshold, plus a little seeded jitter, is under that density, which gives the crafted ordered-dither look rather than noise. Each filled square gets a delay — rows nearest the section first (70ms per row) plus up to 260ms of seeded scatter. A count-up eases out cubically.\n\nRender each seam as an SVG as wide as the section (a ResizeObserver; squares 70% smaller below 640px): the top one on the colour above with squares in the section's colour; the bottom one on the section's colour with squares in the colour below — both thicken downwards, so the bottom seam dissolves into the next section. When the section scrolls into view (IntersectionObserver, once) the squares pop in from scale 0 with a little overshoot on their delays (the bottom seam 500ms later). Without scripting or with reduced motion they're simply there.\n\nBody (container queries): two columns — a monospace eyebrow with a square bullet, a heavy tight title, a muted lead and the actions (a square-cornered primary in the accent with a hard offset shadow that grows on hover, and an outlined secondary whose arrow nudges) on the left; on the right a definition list of figures in three columns divided by hairlines, each counting up over 1.4s after the seam forms, with the final value in visually hidden text for screen readers. One column below 820px.",
  interaction: "The links work as normal; the seams and figures animate once when the section scrolls into view.",
  animation: "Squares pop in over about 0.6s per seam with an overshoot; figures count up over 1.4s. Reduced motion shows everything finished.",
  a11y: "A labelled section with real links; the seams are decorative and hidden; figures are a definition list whose real values are in the text for screen readers while the visible ones count.",
  responsive: "Seams rebuild for any width with smaller squares on phones; the body stacks below 820px.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "mint", label: "Mint", prompt: "A deep green section #0d3b2e between cream #f3f1ea sections: ink #effaf4, muted #a9cdbd, a mint accent #8ef0c4 with dark green text." },
    { id: "ultraviolet", label: "Ultraviolet", prompt: "An electric violet section #3b2bd6 between near-black #0b0b12 sections: white ink, muted #d5d0ff, a yellow accent #ffe066 with dark text." },
    { id: "sand", label: "Sand", prompt: "A sand section #e9dcc4 between near-black #1a1916 sections: ink #1f1a12, muted #5e5442, a dark accent with cream text." },
  ],
  preview: { bg: "#f3f1ea", mode: "fill", frame: [1440, 900] },
};
