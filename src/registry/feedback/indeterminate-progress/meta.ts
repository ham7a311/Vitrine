import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "indeterminate-progress",
  name: "Indeterminate Progress",
  category: "feedback",
  description: "For work of unknown length: a bar that slides and stretches across the track, or a track of moving stripes. There is no value, only 'still going'.",
  tags: ["progress", "indeterminate", "loading", "loader", "spinner", "busy", "stripes", "unknown duration"],
  traits: ["ambient"],
  source: "original",
  files: ["IndeterminateProgress.tsx", "indeterminate-progress.css"],
  dependencies: [],
  prompt:
    "Build an indeterminate progress indicator (no value) with a label. Inter 500 at 14px.\n\nAbove the bar: the label on the left and an optional hint on the right in muted type ('Usually under a minute'). Bars come in three sizes (4, 8 and 12px tall) with fully rounded tracks. The default: a bar 40% of the track slides from beyond the left edge to beyond the right every 1.5s (ease in-out), stretching to 1.2× mid-way. The alternative: the whole track carries -45° stripes (6px) that drift right.\n\nSemantics: role=progressbar labelled by the label, with aria-busy and no value attributes, since there's no value to report.\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327.. Show three examples on a white / #0b0b0c page. Examples: 'Connecting to the database' with a hint, 'Indexing files' (striped, large), 'Syncing' (small).",
  interaction: "None; it reports that work is happening.",
  animation: "A 1.5s slide-and-stretch loop, or 0.6s stripes. Reduced motion slows the slide and stops the stripes.",
  a11y: "role=progressbar with a label and aria-busy; no value is announced because none exists.",
  responsive: "Bars fill their container.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --ipbr-done #15803d; --ipbr-fill #18181b; --ipbr-ink #18181b; --ipbr-soft #6b6b73; --ipbr-track #ececef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --ipbr-done #3fb950; --ipbr-fill #ececef; --ipbr-ink #ececef; --ipbr-soft #a1a1aa; --ipbr-track #232327. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1000, 460] },
  isNew: true,
};
