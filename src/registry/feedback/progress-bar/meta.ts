import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "progress-bar",
  name: "Progress Bar",
  category: "feedback",
  description: "How far along something is, shown five ways: a bar with its label and value (with an optional buffer), equal steps, a bar for work of unknown length, a colourful bar that reveals its gradient as it grows, and a ring.",
  tags: ["progress", "progress bar", "loader", "loading", "steps", "ring", "circular", "gradient", "indeterminate", "upload"],
  traits: ["ambient"],
  source: "original",
  files: ["ProgressBar.tsx", "progress-bar.css", "progress.ts"],
  dependencies: [],
  prompt:
    "Build a progress indicator in the single look selected below, with a label and a value (0–100), at three sizes (4, 8 and 12px tall), Inter 500 at 14px.\n\nAbove the bar: the label on the left and the value on the right in muted tabular figures (the rounded percentage, or a detail such as '7.2 GB of 10 GB' or 'Step 3 of 5'). Tracks are fully rounded. Value changes ease over 0.45s. At 100 the fill turns green (#15803d / #3fb950).\n\nPalette (light / dark): ink and fill #18181b / #ececef, muted #6b6b73 / #a1a1aa, track #ececef / #232327, buffer #c9c9cf / #4a4a52.\n\nSemantics: role=progressbar on the track, labelled by the label, with aria-valuemin/max/now and aria-valuetext set to the detail when there is one.\n\nShow three examples, the first climbing unevenly to 100, resting, and starting over, on a white panel and a #0b0b0c panel side by side.",
  interaction: "None; it reports progress. Pair it with a cancel control if the work can be stopped.",
  animation: "Fills ease to each new value over 0.45s. Reduced motion jumps straight to the value, slows the sliding bar and stops the stripes.",
  a11y: "role=progressbar with a label, min, max, now and a human value text; work of unknown length leaves out the value and sets aria-busy.",
  responsive: "Bars fill their container; rings wrap in a row; the panels stack on narrow screens.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "linear", label: "Linear", prompt: "Linear: a single fill that scales from the left. Optionally a lighter buffer fill behind it (for media, 'Buffered ahead'). Examples: 'Uploading assets' climbing, 'Storage' at 72% reading '7.2 GB of 10 GB' (large), and a small media bar with a buffer." },
    { id: "segmented", label: "Segmented", prompt: "Segmented: the track is split into equal segments with 4px gaps and 3px corners; whole segments fill solid and the current one fills partly from its left. Examples: 'Setting up your workspace' in 5 steps reading 'Step n of 5', 'Password strength' in 4 at 75% reading 'Strong' (small), and a 12-part course bar (large)." },
    { id: "indeterminate", label: "Indeterminate", prompt: "Indeterminate: no value. A bar 40% of the track slides from beyond the left edge to beyond the right every 1.5s (ease in-out), stretching to 1.2× mid-way; or, as an alternative, the whole track carries -45° stripes (6px) that drift right. The value slot shows a hint ('Usually under a minute') or nothing. Examples: 'Connecting to the database', 'Indexing files' (striped, large), 'Syncing' (small)." },
    { id: "gradient", label: "Gradient", prompt: "Gradient: the fill is a cyan #06b6d4 → blue #3b82f6 → violet #a855f7 → pink #ec4899 gradient spanning the whole track, revealed by clip-path as the value grows (so the colours arrive in order), with an 18px blurred violet glow leading its end (fading in from zero). Examples: 'Generating your video' climbing (large), 'Monthly goal' at 68% reading '6,800 of 10,000 visits', 'Training run' (small)." },
    { id: "ring", label: "Ring", prompt: "Ring: a 72px circle (48 and 96px at the other sizes) drawn as two 6px SVG strokes, the track and a round-capped arc from 12 o'clock driven by stroke-dashoffset, with the percentage in the middle (600, tabular) and the label and a muted detail beside it. Examples: 'Download' climbing with '1.6 GB of 2.4 GB' (large), 'Profile' at 80% with '4 of 5 done', 'CPU' at 42% (small)." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1100, 520] },
  isNew: true,
};
