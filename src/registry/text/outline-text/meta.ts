import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "outline-text",
  name: "Hover Outline Text",
  category: "text",
  description: "Big hairline lettering that fills with ink word by word as you point at it. The first time it scrolls into view, the words fill and clear once in order, so you know it responds.",
  tags: ["outline", "stroke", "text", "typography", "headline", "hover", "poster", "fill"],
  traits: ["hover", "ambient"],
  source: "original",
  files: ["OutlineText.tsx", "outline-text.css"],
  dependencies: [],
  prompt:
    "Build big poster lettering drawn as hairlines (transparent text with a 1.5px -webkit-text-stroke in the ink colour). Inter 800, uppercase, -0.035em, 0.95 leading, sized from the container width. A two-line headline ('Quiet tools / for loud ideas'), each word a span carrying its text in data-text. A filled copy in ::after is clipped to inset(0 100% 0 0) and wipes open to the right on hover over 0.5s (every third word fills in the accent). The first time it scrolls into view, the words fill and clear once in sequence, 110ms apart (1.6s each: wipe in, hold, wipe out to the right).\n\nPalette (light / dark): ink #111214 / #f1f0ec, page #f4f3ef / #0b0b0c, accent signal orange #ff4d1c / acid lime #d4ff3a. In forced-colours mode drop the stroke and show plain text.\n\nShow it under a small uppercase hint ('Point at a word') on the page colour.",
  interaction: "Point at a word to fill it. The text is always real and readable.",
  animation: "Clip-path wipes of 0.5s, and a one-off staggered intro. Reduced motion removes the intro and makes the fill instant.",
  a11y: "One real heading; the filled copies are CSS-generated duplicates of visible text, so a screen reader reads it once.",
  responsive: "Type scales with the container (cqi) and wraps at word boundaries.",
  touchFallback: "The words fill once on view; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --otxt-accent #ff4d1c; --otxt-ink #111214; --otxt-page #f4f3ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --otxt-accent #d4ff3a; --otxt-ink #f1f0ec; --otxt-page #0b0b0c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f3ef", mode: "fill", frame: [1100, 560] },
  isNew: true,
};
