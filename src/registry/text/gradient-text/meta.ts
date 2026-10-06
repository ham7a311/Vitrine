import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gradient-text",
  name: "Gradient Text",
  category: "text",
  description: "Real, selectable text filled with colour: an aurora that flows slowly through the letters, brushed metal with a narrow band of light passing over it, or muted letters with a pool of colour that follows the pointer.",
  tags: ["gradient", "text", "headline", "typography", "aurora", "shine", "metal", "spotlight", "background-clip"],
  traits: ["ambient", "cursor"],
  source: "original",
  files: ["GradientText.tsx", "gradient-text.css"],
  dependencies: [],
  prompt:
    "Build a component that fills text with colour, in the single effect selected below, that works inline (one word in a sentence) or as a whole headline. Use background-clip: text on transparent text, with box-decoration-break: clone so the fill carries across line breaks; keep it real text (selectable, with a readable selection colour). In forced-colours mode drop the fill and use CanvasText.\n\nPalette (light / dark): teal #0e9f8f / #2dd4bf, blue #2563eb / #60a5fa, violet #7c3aed / #a78bfa, pink #db2777 / #f472b6, orange #ea580c / #fb923c. Light stops are deep enough for large text on a near-white page; dark stops are brighter.\n\nShow it in a two-line headline (Inter about 84px, 650, -0.04em, 1.02 leading) under a small uppercase eyebrow and in one inline phrase of a paragraph, on a #fbfbfa panel above a #08090b panel.",
  interaction: "Text stays selectable and copyable; nothing else responds unless the effect follows the pointer.",
  animation: "Pure CSS where it can be; reduced motion or motion={false} leaves a still, legible gradient.",
  a11y: "It's ordinary text, so screen readers read it normally. Colours keep large-text contrast on their page; forced-colours mode falls back to the system text colour.",
  responsive: "Sizes come from the container width; the fill follows the text across line breaks.",
  touchFallback: "Touch shows the slow drift (or the still fill); nothing depends on a pointer.",
  variants: [
    { id: "aurora", label: "Aurora", prompt: "Aurora: a 100° gradient through teal, blue, violet, pink, orange and back to teal, sized 300% wide and drifting its position from 0% to 100% and back over 14s (ease-in-out, alternate). Copy: 'Make the thing everyone remembers.' with the second half in colour." },
    { id: "shine", label: "Shine", prompt: "Shine: brushed metal: a vertical gradient (near-black #1d1f24 → slate #5b616c with a hard horizon at 52% → #2a2d33 → back; on dark #f4f6f9 → #8a919c → #d9dde3 → back), with a second layer on top: a 115° band of light (#c9d3e0, white on dark) only about 2% wide with soft 7% edges, sized 260% wide and sliding from right to left over 55% of a 4.2s cycle, then resting. Copy: 'Machined from a single block.'" },
    { id: "spotlight", label: "Spotlight", prompt: "Spotlight: the letters sit in a muted grey that still passes 3:1 for large text (#85888f / #5f636b) and a radial pool of colour (pink at the centre, then violet, blue and teal, fading out by 38%) sits at --x/--y. The pointer sets them as percentages of the text box; when it leaves (or on touch), the pool drifts on its own along a slow Lissajous path (sin 0.45 and 0.7 rad/s), paused offscreen. The whole headline carries the effect: 'Colour where you are looking.'" },
  ],
  preview: { bg: "#fbfbfa", mode: "fill", frame: [1200, 760] },
  isNew: true,
};
