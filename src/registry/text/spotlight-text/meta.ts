import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "spotlight-text",
  name: "Spotlight Text",
  category: "text",
  description: "Muted letters with a pool of colour that follows the pointer through them. When the pointer is away, the pool drifts on its own along a slow path.",
  tags: ["gradient", "text", "headline", "typography", "spotlight", "cursor", "hover", "background-clip"],
  traits: ["cursor", "ambient"],
  source: "original",
  files: ["SpotlightText.tsx", "spotlight-text.css"],
  dependencies: [],
  prompt:
    "Build a component that fills text with colour, in one effect, that works inline (one word in a sentence) or as a whole headline. Use background-clip: text on transparent text, with box-decoration-break: clone so the fill carries across line breaks; keep it real text (selectable, with a readable selection colour). In forced-colours mode drop the fill and use CanvasText.\n\nPalette (light / dark): teal #0e9f8f / #2dd4bf, blue #2563eb / #60a5fa, violet #7c3aed / #a78bfa, pink #db2777 / #f472b6, orange #ea580c / #fb923c. Light stops are deep enough for large text on a near-white page; dark stops are brighter. The letters rest in a muted grey that still passes 3:1 for large text (#85888f / #5f636b).\n\nThe effect: a radial pool of colour (pink at the centre, then violet, blue and teal, fading out by 38%) sits at --x/--y over the muted letters. The pointer sets them as percentages of the text box; when it leaves (or on touch), the pool drifts on its own along a slow Lissajous path (sin 0.45 and 0.7 rad/s), paused offscreen. The whole headline carries the effect: 'Colour where you are looking.'\n\nShow it in a two-line headline (Inter about 84px, 650, -0.04em, 1.02 leading) under a small uppercase eyebrow and in one inline phrase of a paragraph, on a #fbfbfa / #08090b page.",
  interaction: "Move the pointer across the text and the colour follows it; text stays selectable.",
  animation: "The pool follows the pointer instantly and drifts slowly when idle. Reduced motion or motion={false} leaves it still at the centre.",
  a11y: "It's ordinary text, so screen readers read it normally; the muted letters keep large-text contrast; forced-colours mode falls back to the system text colour.",
  responsive: "Sizes come from the container width; the fill follows the text across line breaks.",
  touchFallback: "Touch shows the slow drift; nothing depends on a pointer.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --sptx-a #0e9f8f; --sptx-b #2563eb; --sptx-c #7c3aed; --sptx-d #db2777; --sptx-muted #85888f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --sptx-a #2dd4bf; --sptx-b #60a5fa; --sptx-c #a78bfa; --sptx-d #f472b6; --sptx-muted #5f636b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fbfbfa", mode: "fill", frame: [1200, 560] },
  isNew: true,
};
