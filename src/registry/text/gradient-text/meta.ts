import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gradient-text",
  name: "Aurora Text",
  category: "text",
  description: "Real, selectable text filled with an aurora: a wide gradient of teal, blue, violet, pink and orange that drifts slowly through the letters, in a headline or a single word of a sentence.",
  tags: ["gradient", "text", "headline", "typography", "aurora", "background-clip", "colour", "animated"],
  traits: ["ambient"],
  source: "original",
  files: ["GradientText.tsx", "gradient-text.css"],
  dependencies: [],
  prompt:
    "Build a component that fills text with colour, in one effect, that works inline (one word in a sentence) or as a whole headline. Use background-clip: text on transparent text, with box-decoration-break: clone so the fill carries across line breaks; keep it real text (selectable, with a readable selection colour). In forced-colours mode drop the fill and use CanvasText.\n\nPalette (light / dark): teal #0e9f8f / #2dd4bf, blue #2563eb / #60a5fa, violet #7c3aed / #a78bfa, pink #db2777 / #f472b6, orange #ea580c / #fb923c. Light stops are deep enough for large text on a near-white page; dark stops are brighter.\n\nThe effect: a 100° gradient through teal, blue, violet, pink, orange and back to teal, sized 300% wide and drifting its position from 0% to 100% and back over 14s (ease-in-out, alternate). Copy: 'Make the thing everyone remembers.' with the second half in colour.\n\nShow it in a two-line headline (Inter about 84px, 650, -0.04em, 1.02 leading) under a small uppercase eyebrow and in one inline phrase of a paragraph, on a #fbfbfa / #08090b page.",
  interaction: "Text stays selectable and copyable; nothing responds to input.",
  animation: "A 14s slow drift, pure CSS. Reduced motion or motion={false} leaves a still, legible gradient.",
  a11y: "It's ordinary text, so screen readers read it normally. Colours keep large-text contrast on their page; forced-colours mode falls back to the system text colour.",
  responsive: "Sizes come from the container width; the fill follows the text across line breaks.",
  touchFallback: "The drift runs without a pointer.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --grdt-a #0e9f8f; --grdt-b #2563eb; --grdt-c #7c3aed; --grdt-d #db2777; --grdt-e #ea580c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --grdt-a #2dd4bf; --grdt-b #60a5fa; --grdt-c #a78bfa; --grdt-d #f472b6; --grdt-e #fb923c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fbfbfa", mode: "fill", frame: [1200, 560] },
  isNew: true,
};
