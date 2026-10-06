import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gradient-progress",
  name: "Gradient Progress",
  category: "feedback",
  description: "A colourful bar whose full gradient spans the track, revealed as the bar grows so the colours arrive in order, with a soft glow leading its end.",
  tags: ["progress", "gradient", "colourful", "generating", "goal", "glow", "loading", "bar"],
  traits: ["ambient"],
  source: "original",
  files: ["GradientProgress.tsx", "gradient-progress.css", "progress.ts"],
  dependencies: [],
  prompt:
    "Build a gradient progress indicator with a label and a value (0–100). Inter 500 at 14px.\n\nAbove the bar: the label on the left and the value on the right in muted tabular figures (the rounded percentage, or a detail such as '7.2 GB of 10 GB'). Bars come in three sizes (4, 8 and 12px tall) with fully rounded tracks; value changes ease over 0.45s. The fill is a cyan #06b6d4 → blue #3b82f6 → violet #a855f7 → pink #ec4899 gradient spanning the whole track, revealed by clip-path as the value grows (so the colours arrive in order), with an 18px blurred violet glow leading its end (fading in from zero). In forced-colours mode use Highlight.\n\nSemantics: role=progressbar on the track, labelled by the label, with aria-valuemin/max/now and aria-valuetext set to the detail when there is one.\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327.. Show three examples on a white / #0b0b0c page. Examples: 'Generating your video' climbing (large), 'Monthly goal' at 68% reading '6,800 of 10,000 visits', 'Training run' (small).",
  interaction: "None; it reports progress.",
  animation: "The reveal and the glow ease over 0.45s. Reduced motion jumps straight to the value.",
  a11y: "role=progressbar with a label, min, max, now and a human value text.",
  responsive: "Bars fill their container.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --gpbr-done #15803d; --gpbr-fill #18181b; --gpbr-ink #18181b; --gpbr-soft #6b6b73; --gpbr-track #ececef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --gpbr-done #3fb950; --gpbr-fill #ececef; --gpbr-ink #ececef; --gpbr-soft #a1a1aa; --gpbr-track #232327. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1000, 460] },
  isNew: true,
};
