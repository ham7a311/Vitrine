import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "segmented-progress",
  name: "Segmented Progress",
  category: "feedback",
  description: "The track is split into equal steps: whole segments fill solid and the current one fills partly, so progress reads as 'step 3 of 5'. Good for onboarding, password strength and courses.",
  tags: ["progress", "segmented", "steps", "stepper", "onboarding", "password strength", "course", "wizard"],
  traits: ["ambient"],
  source: "original",
  files: ["SegmentedProgress.tsx", "segmented-progress.css", "progress.ts"],
  dependencies: [],
  prompt:
    "Build a segmented progress indicator with a label and a value (0–100). Inter 500 at 14px.\n\nAbove the bar: the label on the left and the value on the right in muted tabular figures (the rounded percentage, or a detail such as '7.2 GB of 10 GB'). Bars come in three sizes (4, 8 and 12px tall) with fully rounded tracks; value changes ease over 0.45s. The track is split into equal segments with 4px gaps and 3px corners; whole segments fill solid and the current one fills partly from its left (a scaleX per segment). At 100 every segment turns green.\n\nSemantics: role=progressbar on the track, labelled by the label, with aria-valuemin/max/now and aria-valuetext set to the detail when there is one.\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327. At 100 the fill turns green (#15803d / #3fb950). Show three examples on a white / #0b0b0c page. Examples: 'Setting up your workspace' in 5 steps reading 'Step n of 5'; 'Password strength' in 4 at 75% reading 'Strong' (small); a 12-part course bar (large).",
  interaction: "None; it reports progress.",
  animation: "Each segment's fill eases over 0.4s. Reduced motion jumps straight to the value.",
  a11y: "role=progressbar with a label, min, max, now and a human value text such as 'Step 3 of 5'.",
  responsive: "The segments share the container width equally.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --sgpb-done #15803d; --sgpb-fill #18181b; --sgpb-ink #18181b; --sgpb-soft #6b6b73; --sgpb-track #ececef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --sgpb-done #3fb950; --sgpb-fill #ececef; --sgpb-ink #ececef; --sgpb-soft #a1a1aa; --sgpb-track #232327. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1000, 460] },
  isNew: true,
};
