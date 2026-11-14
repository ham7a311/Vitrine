import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "weight-shift-button",
  name: "Weight Shift Button",
  category: "buttons",
  description: "A quiet button whose only signal is type. The letters under the pointer grow heavier, a swell that follows it along the word, and a press commits the whole label to bold for a moment. Made for dense interfaces.",
  tags: ["button", "typography", "font weight", "minimal", "quiet", "letters", "hover"],
  traits: ["hover", "cursor", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["WeightShiftButton.tsx", "weight-shift-button.css"],
  dependencies: [],
  prompt: `Build a quiet, outlined button whose feedback is carried by type alone: the letters under the pointer grow heavier, and a press makes the whole label bold for a moment. No fill change on hover, no glow, no movement of the box.

Box. A native button, 44px tall, 20px side padding, 10px radius, a 1px hairline border, transparent background, 15px regular text with 0.045em letter-spacing (the extra spacing leaves room for the letters to thicken). On hover the border takes the text colour over 160ms; while pressed the background takes a faint tint.

Letters. The label is plain text split into one inline-block span per letter (spaces become a fixed 0.3em gap). The button carries the full label as its accessible name and the letter spans are hidden from assistive technology. Weight is drawn as a text stroke in the letter's own colour with paint-order stroke then fill: stroke width = w × 0.062em, where w runs from 0 to 1 per letter. A stroke works with any font, and because it does not change a letter's advance width, nothing in the label shifts as weights change.

The swell. Measure each letter's horizontal centre once (and again on resize and when fonts load). While the pointer is over the button, a letter's target is exp(−(d / 30)²), where d is the distance in pixels from the pointer to its centre; 30px is an option. When the pointer leaves, every target is 0. Each frame a letter moves toward its target by 32% of the gap when gaining weight and 12% when losing it, so the swell leaves a short wake behind the pointer. Run the loop only while something is changing.

Commit. On click every letter's target is 1 for 520ms, then the swell resumes. This is the press feedback.

States. Focus-visible: a 2px outline in the text colour, 3px out, and every letter at a stroke of 0.045em. Disabled: 45% opacity, no response. Reduced motion: letters take their target weight at once, with no easing. Forced colours: no stroke.`,
  interaction: "Run the pointer along the label and the weight follows it; click and the whole word goes bold for half a second.",
  animation: "Letters gain weight in about 100ms and lose it over about 300ms; a click holds full weight for 520ms.",
  a11y: "The button's name is the full label; the per-letter spans are hidden. Focus shows a ring and a heavier label. Reduced motion removes the easing.",
  responsive: "Inline and content-sized; size is set by font size, height and padding.",
  touchFallback: "A tap gives the full-weight commit; the swell appears under the finger while it is down.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --wshift-ink #18181b; --wshift-line #d6d6db; --wshift-press #f1f1f3. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --wshift-ink #ececef; --wshift-line #34343a; --wshift-press #1c1c20. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "center", height: 380 },
};
