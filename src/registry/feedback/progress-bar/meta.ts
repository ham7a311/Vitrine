import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "progress-bar",
  name: "Linear Progress",
  category: "feedback",
  description: "A bar with its label and value above it: one fill that scales from the left, an optional lighter buffer behind it for media, and a green finish at 100.",
  tags: ["progress", "progress bar", "linear", "loader", "upload", "buffer", "storage", "meter"],
  traits: ["ambient"],
  source: "original",
  files: ["ProgressBar.tsx", "progress-bar.css", "progress.ts"],
  dependencies: [],
  prompt:
    "Build a linear progress indicator with a label and a value (0–100). Inter 500 at 14px.\n\nAbove the bar: the label on the left and the value on the right in muted tabular figures (the rounded percentage, or a detail such as '7.2 GB of 10 GB'). Bars come in three sizes (4, 8 and 12px tall) with fully rounded tracks; value changes ease over 0.45s. A single fill scales from the left; optionally a lighter buffer fill sits behind it (for media, 'Buffered ahead'). At 100 the fill turns green.\n\nSemantics: role=progressbar on the track, labelled by the label, with aria-valuemin/max/now and aria-valuetext set to the detail when there is one.\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327. At 100 the fill turns green (#15803d / #3fb950). Show three examples on a white / #0b0b0c page. Examples: 'Uploading assets' climbing unevenly to 100, resting, and starting over; 'Storage' at 72% reading '7.2 GB of 10 GB' (large); and a small media bar with a buffer.",
  interaction: "None; it reports progress. Pair it with a cancel control if the work can be stopped.",
  animation: "Fills ease to each new value over 0.45s. Reduced motion jumps straight to the value.",
  a11y: "role=progressbar with a label, min, max, now and a human value text.",
  responsive: "Bars fill their container.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --prgb-buffer #c9c9cf; --prgb-done #15803d; --prgb-fill #18181b; --prgb-ink #18181b; --prgb-soft #6b6b73; --prgb-track #ececef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --prgb-buffer #4a4a52; --prgb-done #3fb950; --prgb-fill #ececef; --prgb-ink #ececef; --prgb-soft #a1a1aa; --prgb-track #232327. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1000, 460] },
};
