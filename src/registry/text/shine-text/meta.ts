import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "shine-text",
  name: "Shine Text",
  category: "text",
  description: "Real, selectable text in brushed metal with a hard horizon through each letter, and a narrow band of light that crosses it every few seconds.",
  tags: ["gradient", "text", "headline", "typography", "metal", "shine", "chrome", "glint", "background-clip"],
  traits: ["ambient"],
  source: "original",
  files: ["ShineText.tsx", "shine-text.css"],
  dependencies: [],
  prompt:
    "Build a component that fills text with colour, in one effect, that works inline (one word in a sentence) or as a whole headline. Use background-clip: text on transparent text, with box-decoration-break: clone so the fill carries across line breaks; keep it real text (selectable, with a readable selection colour). In forced-colours mode drop the fill and use CanvasText.\n\nPalette (light / dark): metal near-black #1d1f24 → slate #5b616c with a hard horizon at 52% → #2a2d33 → back / #f4f6f9 → #8a919c → #d9dde3 → back; the glint #c9d3e0 / white.\n\nThe effect: a vertical metal gradient, with a second layer on top: a 115° band of light only about 2% wide with soft 7% edges, sized 260% wide and sliding from right to left over 55% of a 4.2s cycle, then resting. Copy: 'Machined from a single block.' with the second half in metal.\n\nShow it in a two-line headline (Inter about 84px, 650, -0.04em, 1.02 leading) under a small uppercase eyebrow and in one inline phrase of a paragraph, on a #fbfbfa / #08090b page.",
  interaction: "Text stays selectable and copyable; nothing responds to input.",
  animation: "A 4.2s cycle: the glint crosses in the first 55% and rests for the rest. Reduced motion or motion={false} leaves still metal.",
  a11y: "It's ordinary text, so screen readers read it normally; the metal keeps large-text contrast on its page; forced-colours mode falls back to the system text colour.",
  responsive: "Sizes come from the container width; the fill follows the text across line breaks.",
  touchFallback: "The glint runs without a pointer.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --shnt-glint #c9d3e0; --shnt-metal-1 #1d1f24; --shnt-metal-2 #5b616c; --shnt-metal-3 #2a2d33. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --shnt-glint #ffffff; --shnt-metal-1 #f4f6f9; --shnt-metal-2 #8a919c; --shnt-metal-3 #d9dde3. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fbfbfa", mode: "fill", frame: [1200, 560] },
  isNew: true,
};
