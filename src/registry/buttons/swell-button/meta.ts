import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "swell-button",
  name: "Swell Button",
  category: "buttons",
  description: "A pill whose label moves like water: the letter under your cursor lifts first and its neighbours follow, so a swell runs outward both ways along the word; click sends a bigger wave from where you pressed.",
  tags: ["button", "typography", "letters", "wave", "stagger", "hover"],
  traits: ["hover", "cursor", "click", "keyboard"],
  source: "original",
  files: ["SwellButton.tsx", "swell-button.css"],
  dependencies: [],
  prompt:
    "Build a pill button whose label is split into inline-block letters. On pointerenter, find the letter whose centre is nearest the pointer and give every letter an animation delay of |i − that index| × 38ms, then restart a short keyframe (remove the attribute, force a reflow, set it again): lift 4px and tint to the crest colour at 35%, dip 1px at 70%, settle. Because the delay grows with distance, a swell runs outward from the letter you're on in both directions.\n\nOn click, do the same from the pressed letter with a bigger wave (lift 7px, scale 1.08, 760ms) as confirmation. Keyboard focus and Enter start from the middle letter. The ring takes the crest colour on hover with a soft 4px halo. The button keeps its whole label as aria-label; the letters are aria-hidden.",
  interaction: "Hover to start a swell from the letter under your cursor; click to send a bigger wave from where you pressed.",
  animation: "Swell 560ms per letter, 38ms per letter of distance; click wave 760ms.",
  a11y: "A real button named by its full label; the split letters are aria-hidden so it's read as one word. Focus starts a swell from the middle and shows an outline. Reduced motion turns the waves off.",
  responsive: "Intrinsic width from its label.",
  touchFallback: "A tap sends the big wave from where you tapped.",
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": a near-black face #141217 with cream letters #efe8dc and a frost-blue crest #b9cce4, on #0b0a0d." },
    { id: "paper", label: "Harbour", prompt: "theme=\"paper\" (harbour): a deep sea-blue face #1f4f6b with ivory letters #f3efe4 and a warm crest #ffd9a0 (halo rgb(255 217 160 / .22)), on #f3f1ec." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
