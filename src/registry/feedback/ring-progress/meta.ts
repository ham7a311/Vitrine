import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ring-progress",
  name: "Ring Progress",
  category: "feedback",
  description: "A circle that fills clockwise from 12 o'clock with the percentage in the middle, and the label and a muted detail beside it. For downloads, profile completeness and usage.",
  tags: ["progress", "ring", "circular", "donut", "percentage", "download", "completeness", "meter"],
  traits: ["ambient"],
  source: "original",
  files: ["RingProgress.tsx", "ring-progress.css", "progress.ts"],
  dependencies: [],
  prompt:
    "Build a circular progress indicator with a label and a value (0–100). Inter 500.\n\nA 72px circle (48 and 96px at the other sizes) drawn as two 6px SVG strokes: the track and a round-capped arc from 12 o'clock driven by stroke-dashoffset (easing over 0.5s), with the percentage in the middle (600, tabular) and the label and a muted detail beside it. At 100 the arc turns green.\n\nSemantics: role=progressbar on the track, labelled by the label, with aria-valuemin/max/now and aria-valuetext set to the detail when there is one. Put the role on the whole ring.\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327. At 100 the fill turns green (#15803d / #3fb950). Show three examples on a white / #0b0b0c page. Examples: 'Download' climbing with '1.6 GB of 2.4 GB' (large), 'Profile' at 80% with '4 of 5 done', 'CPU' at 42% (small).",
  interaction: "None; it reports progress.",
  animation: "The arc eases over 0.5s. Reduced motion jumps straight to the value.",
  a11y: "role=progressbar on the ring with a label, min, max, now and a human value text.",
  responsive: "Rings keep their size and sit in a column in the demo.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --rprg-done #15803d; --rprg-fill #18181b; --rprg-ink #18181b; --rprg-soft #6b6b73; --rprg-track #ececef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --rprg-done #3fb950; --rprg-fill #ececef; --rprg-ink #ececef; --rprg-soft #a1a1aa; --rprg-track #232327. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1000, 460] },
  isNew: true,
};
