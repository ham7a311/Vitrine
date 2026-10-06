import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "echo-outline-text",
  name: "Echo Outline Text",
  category: "text",
  description: "One huge solid word with five hairline copies stacked behind it. With a mouse the copies lean away from the pointer; otherwise they sway slowly on their own.",
  tags: ["outline", "stroke", "text", "typography", "echo", "shadow", "cursor", "poster"],
  traits: ["cursor", "ambient"],
  source: "original",
  files: ["EchoOutlineText.tsx", "echo-outline-text.css"],
  dependencies: [],
  prompt:
    "Build big poster lettering drawn as hairlines (transparent text with a 1.5px -webkit-text-stroke in the ink colour). Inter 800, uppercase, -0.035em, 0.95 leading, sized from the container width. One huge word ('SIGNAL', 900 weight, up to 260px) in solid ink with five hairline copies stacked behind it, each offset by k × (dx, dy) and fading by 14% per step; the furthest copy's stroke is the accent. dx/dy rest at 6px and sway slowly (±3px, sin 0.8 and cos 0.6 rad/s) on their own; with a mouse they point away from the pointer (up to ±13px per step), easing over 0.55s. Pause the sway offscreen.\n\nPalette (light / dark): ink #111214 / #f1f0ec, page #f4f3ef / #0b0b0c, accent signal orange #ff4d1c / acid lime #d4ff3a. In forced-colours mode drop the stroke and show plain text.",
  interaction: "Move the mouse across the word and the echoes lean away.",
  animation: "A 0.55s eased lean and a slow idle sway. Reduced motion holds the echoes still and drops the easing.",
  a11y: "The section is labelled with the word once; all copies are aria-hidden.",
  responsive: "Type scales with the container and never wraps.",
  touchFallback: "On touch the echoes sway on their own; nothing depends on a pointer.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --eotx-accent #ff4d1c; --eotx-ink #111214; --eotx-page #f4f3ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --eotx-accent #d4ff3a; --eotx-ink #f1f0ec; --eotx-page #0b0b0c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f3ef", mode: "fill", frame: [1100, 560] },
  isNew: true,
};
