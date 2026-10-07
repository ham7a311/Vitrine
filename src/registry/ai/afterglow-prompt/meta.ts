import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "afterglow-prompt",
  name: "Afterglow Prompt",
  category: "ai",
  description: "A dark glass prompt box whose rim burns cool down one side and warm round the other, like light from a low sun, with a starter-prompt library, an attachable link, a mic switch and send.",
  tags: ["ai", "chat", "prompt", "composer", "input", "glow", "switch", "menu", "dark"],
  traits: ["ambient", "keyboard", "click"],
  source: "original",
  files: ["AfterglowPrompt.tsx", "afterglow.ts", "afterglow-prompt.css"],
  dependencies: [],
  prompt: `Build an AI prompt box (React + CSS, no libraries) with a glowing two-tone rim: cool light down the left and along the bottom, warm light round the bottom-right corner, and only a faint pale line along the top-right.

Sizes in em from 16px; the box is min(100%, 29em). Box: radius 1.7em, padding 1.05em 0.7em 0.7em, a 0.13em transparent border showing a conic gradient (border-box) over a dark interior gradient (#15131f → #0c0b12, padding-box). Conic stops, starting at −20° plus a registered angle: pale white at 14% from the top round to 80°, warm from 105° peaking at 128° (the bottom-right corner), a pink blend at 160°, a lilac blend at 200°, the cool colour from 240° to 310°, fading back to pale white by 360°. The angle sways ±14° over 9s (CSS @property) so the light slides a little round the rim. Coloured box-shadows throw cool light off the left and warm light off the bottom right, and soft inset cool haze sits inside the left and bottom edges; behind it all, a blurred bloom (three radials: cool at the left, cool under the bottom, warm at the bottom right) that brightens on focus-within.

Content: an auto-growing textarea (two to seven lines, 1.2em, line-height 1.28, #d9d7e3, bright caret); Enter sends, Shift+Enter breaks a line, IME composition is respected. Bottom row: a "Prompts" pill (#1b1925, weight 600, a circle-and-triangle icon) that opens a menu of four starter prompts above it (arrow keys wrap, Home/End, Escape returns focus, Tab or a click outside closes); choosing one fills the box and puts the caret at the end. On the right: a cool-tinted chain button that opens an inline link field (validated as http/https, a bare domain gets https://; Enter attaches, Escape cancels; an attached link shows as a removable host chip), a "Mic" capsule (hairline border, mic icon, label and a real role="switch" toggle whose knob slides with a little overshoot, the mic glowing while on) and a circular outline send button with a filled triangle, whose ring brightens and glows once there is text (and fills on hover). onSubmit receives { text, link, mic }. Under 420px the font drops to 14px and the Mic word hides. Reduced motion stops the sway and the pulses. Props: placeholder, defaultValue, prompts, glow [cool, warm], onSubmit.`,
  interaction: "Type and press Enter to send (Shift+Enter for a new line). Prompts opens a list of starters that fill the box; the chain attaches a link; the Mic switch toggles listening. Everything works from the keyboard.",
  animation: "Rim light sways ±14° over a 9s loop; the bloom brightens on focus over 0.4s; the switch knob slides with a 0.28s overshoot; the mic glows on a 1.1s pulse while on; menus pop in over 0.16s.",
  a11y: "Labelled textarea and link field; Prompts exposes aria-haspopup and aria-expanded and opens a role menu with roving focus; Mic is a role switch with aria-checked; send is disabled until there is text; invalid links are marked aria-invalid. The bloom is aria-hidden. Reduced motion stops all loops.",
  responsive: "min(100%, 29em) wide; under 420px the type steps down and the Mic capsule keeps only its icon and switch. The prompt menu caps at 80vw.",
  touchFallback: "All controls are tap targets; the menu closes on a tap outside and the rim keeps its slow sway.",
  isNew: true,
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Cool #7a66ff (violet) and warm #f6a33f (amber), on a deep violet-black page." },
    { id: "lagoon", label: "Lagoon", prompt: "Cool #2fb8ff (sky blue) and warm #3fe0a8 (sea green), on a deep blue-black page." },
    { id: "ember", label: "Ember", prompt: "Cool #ff4f7a (rose) and warm #ffb84a (gold), on a deep red-black page." },
  ],
  preview: { bg: "#070612", mode: "fill", height: 420 },
};
