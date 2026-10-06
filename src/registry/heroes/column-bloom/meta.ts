import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "column-bloom",
  name: "Column Bloom",
  category: "heroes",
  description: "A stepped skyline of glowing orange columns, hottest in the middle and softening outward into the page, with a product name at its heart and the things it does scattered around it: white where a word crosses the glow, orange where it sits on paper.",
  tags: ["hero", "glow", "gradient", "columns", "keywords", "launch", "orange", "brand"],
  traits: ["hover", "cursor", "ambient"],
  source: "original",
  files: ["ColumnBloom.tsx", "column-bloom.css", "cloud.ts"],
  dependencies: [],
  prompt:
    "Build a launch hero on near-white paper (a fictional writing app, 'qalam').\n\nGlow: nine columns side by side across the middle 84% of the width, symmetric: a wide centre column (about 2.2 units), then pairs of 1, 1, 1 and 0.55 units. The centre and its neighbours run the full height; the next pair starts 16% down, the next 40% down (ending 6% short of the bottom) and the outermost 45% down (ending 18% short). Each column is a vertical ramp: deep red-orange at the base, through hot and warm orange, to a pale peach top that fades out, with a faint darker edge at each side so the columns read as separate pillars; the centre has two darker inner seams. Columns soften the further out they stand (0, 0, 7, 14, 21px blur) and their tops and the outer bottoms are feathered with masks. Each breathes very slowly (scaleY 1 to 1.035 from the base, out of phase), and a soft band of light rises through the middle.\n\nCentre: the wordmark in white, Archivo 800 slightly expanded, about 150px, tight tracking; under it three partner marks with names, separated by ×.\n\nKeywords: twenty uppercase words in a 600-weight grotesk, letter-spaced, placed by hand around the glow. A word is white if its centre falls on a column (below that column's softened top) and orange on paper. Words twinkle between full and 55% opacity on staggered phases and drift against the pointer by their own depth (up to 16px). Hovering a word lifts it 3px and brightens the column under it.",
  interaction: "The pointer drifts the words with parallax. Hovering a keyword lifts it and brightens the column beneath it. Nothing is required to read the hero.",
  animation: "Columns breathe and a band of light rises through the middle; words twinkle and drift. All of it stops with reduced motion or motion={false}.",
  a11y: "The section is labelled; the wordmark is a heading; partners and keywords are real lists, so a screen reader hears the name, what it works with and what it does. The glow is aria-hidden.",
  responsive: "Everything is placed in percentages and scales with the container; below 40rem every third keyword hides and the rest step down in size.",
  touchFallback: "Without a pointer the words rest in place; the glow and twinkle still run.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#fefdfc", mode: "fill", frame: [1466, 742] },
  isNew: true,
};
