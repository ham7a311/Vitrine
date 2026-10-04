import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cascade-button",
  name: "Cascade",
  category: "buttons",
  description: "A pill whose label turns over letter by letter, left to right, while its arrow is swapped for a fresh one arriving from the left.",
  tags: ["button", "cta", "text-roll", "stagger", "arrow", "link"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["CascadeButton.tsx", "cascade-button.css"],
  dependencies: [],
  prompt: `Build a primary pill link (52px, inset top highlight, small negative-spread shadow) with a round 'well' on the right holding an arrow.

Split the label into letters; each letter is a 1em-tall reel containing the letter twice, stacked. On hover or focus every reel translates up 100% over 560ms with cubic-bezier(0.16,1,0.3,1), delayed 22ms per letter — the word turns over like a wave travelling left to right, and because both rows are identical it reads as motion, not as a change of text. At the same time the left padding opens by a quarter rem, so the pill seems to inhale.

The arrow well holds two arrows in one grid cell: the first leaves to the right (translateX 200%, 40ms delay) as the second arrives from the left (from −200%, 90ms delay), so the arrow is replaced rather than nudged. Press scales to 0.97. The tone prop sets face, text and well colours.`,
  interaction: "Hover or focus rolls the letters and swaps the arrow; press compresses the pill.",
  animation: "560ms expo-out per letter with a 22ms stagger; arrow exchange 560ms with 40/90ms offsets; padding 520ms.",
  a11y: "A real link whose accessible name is the full label (the per-letter reels are aria-hidden). Focus-visible plays the same motion plus an outline. Reduced motion makes it instant.",
  responsive: "Intrinsic width; labels never wrap.",
  touchFallback: "On touch the roll plays while pressed; nothing is hidden behind hover.",
  variants: [
    { id: "pair", label: "Bone + ink", prompt: "Bone + ink: two links side by side on #0b080d — the default bone tone (bone face, ink text, ink well) \"Start a project\", and tone=\"ink\" (ink face, bone text, hairline ring) \"See the work\"." },
    { id: "frost", label: "Frost", prompt: "tone=\"frost\": a single frost-blue pill \"Start building\" with dark text and well, on #0b0e13." },
  ],
  preview: { bg: "#0b080d", mode: "fill" },
};
