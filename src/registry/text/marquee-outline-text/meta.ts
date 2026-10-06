import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "marquee-outline-text",
  name: "Marquee Outline Text",
  category: "text",
  description: "Two rows of big words sliding past each other in opposite directions, alternating hairline and solid, with a small accent star between the words. Hovering a row pauses it.",
  tags: ["outline", "stroke", "text", "typography", "marquee", "ticker", "scroll", "poster"],
  traits: ["hover", "ambient"],
  source: "original",
  files: ["MarqueeOutlineText.tsx", "marquee-outline-text.css"],
  dependencies: [],
  prompt:
    "Build big poster lettering drawn as hairlines (transparent text with a 1.5px -webkit-text-stroke in the ink colour). Inter 800, uppercase, -0.035em, 0.95 leading, sized from the container width. Two rows of words (Design, Build, Ship, Listen / Measure, Repeat, Prototype, Iterate), up to 128px, alternating hairline and solid words with a small accent ✦ between them. Each row is its content twice in a track sliding by -50% (38s left, 44s right for the second row) so it loops seamlessly. Hovering a row pauses it.\n\nPalette (light / dark): ink #111214 / #f1f0ec, page #f4f3ef / #0b0b0c, accent signal orange #ff4d1c / acid lime #d4ff3a. In forced-colours mode drop the stroke and show plain text.",
  interaction: "Hover a row to pause it.",
  animation: "A linear 38s and 44s slide in opposite directions. Reduced motion stops it.",
  a11y: "The section is labelled with the words once; the moving copies are aria-hidden.",
  responsive: "Type scales with the container; the rows never cause horizontal page scroll.",
  touchFallback: "The rows keep sliding; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --motx-accent #ff4d1c; --motx-ink #111214; --motx-page #f4f3ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --motx-accent #d4ff3a; --motx-ink #f1f0ec; --motx-page #0b0b0c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f3ef", mode: "fill", frame: [1100, 560] },
  isNew: true,
};
