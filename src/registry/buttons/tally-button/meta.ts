import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tally-button",
  name: "Tally Button",
  category: "buttons",
  description: "A save or like button whose count turns like an odometer: only the digits that change roll, one after another from the left, while a ring leaves the icon as it fills.",
  tags: ["button", "toggle", "counter", "odometer", "like", "save", "social"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["TallyButton.tsx", "tally-button.css"],
  dependencies: [],
  prompt:
    "Build a pill toggle for saving or liking: an outline icon (bookmark or heart), the verb, a hairline divider and the count. Render the count as odometer reels: one 1em-tall window per digit holding a 0–9 strip translated to −digit em, keyed by place from the right, so places keep their identity when the number grows.\n\nWhen the count changes, compare each place with the previous value. Only changed digits transition (560ms expo-out), and each changed digit waits 70ms more than the changed digit to its left, so 1,299 → 1,300 rolls the three wheels in a small cascade while the thousands stay still. A new leading place (99 → 100) grows in from zero width. Separators never move.\n\nPressing fills the icon in amber with a springy 1.12 scale and sends a thin ring out from it (scale 0.6 → 1.5, fading), tints the face and count, and changes 'Save' to 'Saved'. It's a toggle with aria-pressed and an accessible name like 'Save, 1,300 saves'.",
  interaction: "Click to save or like; click again to undo. The changed digits roll in order.",
  animation: "Digit roll 560ms expo-out, +70ms per changed place; icon spring 420ms; ring 620ms.",
  a11y: "A real toggle with aria-pressed and a full accessible name including the current count; the reels, icon and visible text are aria-hidden so the name isn't read twice. Reduced motion swaps digits instantly.",
  responsive: "Intrinsic width; tabular numerals keep the count from jittering.",
  touchFallback: "Same on touch.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
