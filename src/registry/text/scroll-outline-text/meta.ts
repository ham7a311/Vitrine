import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "scroll-outline-text",
  name: "Scroll Outline Text",
  category: "text",
  description: "Big hairline lettering on a sticky stage that fills with ink line by line as you scroll through the section, the last line landing in the accent colour.",
  tags: ["outline", "stroke", "text", "typography", "headline", "scroll", "poster", "fill", "reveal"],
  traits: ["scroll"],
  source: "original",
  files: ["ScrollOutlineText.tsx", "scroll-outline-text.css", "fill.ts", "../../media/helix-showcase/helix.ts"],
  dependencies: [],
  prompt:
    "Build big poster lettering drawn as hairlines (transparent text with a 1.5px -webkit-text-stroke in the ink colour). Inter 800, uppercase, -0.035em, 0.95 leading, sized from the container width. A section 2.2 viewports tall with a sticky full-height stage on the page colour, holding three lines ('Every pixel / earns its / place.') at up to 176px. Each line has a filled copy over its outline, clipped to its own fill (inset from the right by (1 − f) × 100%). Progress through the section fills the lines one after another with a 15% overlap, so the wipe flows from the end of one line into the next; the last line fills in the accent. Measure progress against the real scrolling element (the nearest scrolling ancestor, else the page).\n\nPalette (light / dark): ink #111214 / #f1f0ec, page #f4f3ef / #0b0b0c, accent signal orange #ff4d1c / acid lime #d4ff3a. In forced-colours mode drop the stroke and show plain text.",
  interaction: "Scroll through the section to fill the lines; scroll back to empty them.",
  animation: "Scroll-linked, with no easing of its own. It still follows the scroll under reduced motion.",
  a11y: "One real heading with the outlined text; the filled copies are aria-hidden duplicates.",
  responsive: "Type scales with the container; lines never wrap.",
  touchFallback: "Touch scrolling drives it the same way.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --sotx-accent #ff4d1c; --sotx-ink #111214; --sotx-page #f4f3ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --sotx-accent #d4ff3a; --sotx-ink #f1f0ec; --sotx-page #0b0b0c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f3ef", mode: "scroll", frame: [1100, 700] },
  isNew: true,
};
