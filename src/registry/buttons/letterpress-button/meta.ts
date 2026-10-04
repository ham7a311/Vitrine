import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "letterpress-button",
  name: "Letterpress",
  category: "buttons",
  description: "A cotton-paper plate where each letter bites deeper as the cursor passes — a travelling dent — and a press stamps the line.",
  tags: ["button", "typography", "paper", "hover", "tactile", "serif"],
  traits: ["cursor", "hover", "click"],
  source: "original",
  files: ["LetterpressButton.tsx", "letterpress-button.css"],
  dependencies: [],
  prompt: `Design a button that feels printed on heavy cotton paper. On the paper tone the plate is a warm off-white (#ece4d6) with faint paper fibres (a tiny feTurbulence noise data-URI at 9% alpha), a soft highlight from the top-left, an inset light lip along its top edge and a small grounded shadow. The label is set in a serif in all small caps with generous tracking (0.16em), in deep plum ink.

Split the label into individual letters (sorts). On pointer move, compute each letter's horizontal distance to the cursor and give it a smoothstepped bite depth (0–1 within ~46px). Depth pushes the letter down 1.6px, squeezes it 3%, deepens the ink, and swaps its shadow for a letterpress bite — a dark edge above and a paper lip catching light below — so a dent travels through the word as the cursor moves. Transitions are short (140ms) so the dent flows rather than jumps; updates are batched into one rAF.

Pressing stamps the whole line: every letter bites fully in a 420ms press-and-release, staggered 12ms per letter like a platen rolling across, while the plate compresses to 98.5% with an inner shadow. Keyboard focus shows a light, even impression. The button's accessible name is the plain string.`,
  interaction: "Cursor proximity presses nearby letters into the paper; press/Enter stamps the whole word.",
  animation: "Per-letter depth transitions 140ms; stamp 420ms with 12ms stagger; plate compress 180ms.",
  a11y: "A real <button> with aria-label set to the full text; the split letters are aria-hidden so screen readers hear one word, not letters. Reduced motion removes the stamp and transitions.",
  responsive: "Intrinsic width; works with any short label.",
  touchFallback: "The travelling dent needs a mouse; taps still stamp the word.",
  promptAllow: ["paper", "ink"],
  variants: [
    { id: "paper", label: "Paper", prompt: "tone=\"paper\": warm off-white plate with deep plum ink letters, on a #1a1319 page." },
    { id: "ink", label: "Ink", prompt: "tone=\"ink\": dark stock plate with cream letters — the bite and lip shadows inverted to suit — on a #0b080d page." },
  ],
  preview: { bg: "#1a1319", mode: "fill" },
};
