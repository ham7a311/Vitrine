import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "peek-words",
  name: "Peek Words",
  category: "cards",
  description: "Words in running text that open a picture card. Point at a dotted-underlined name and a card rises out of it with a picture, a title and a line; move to the next word and the same card glides over and swaps its contents instead of popping again.",
  tags: ["hover card", "preview", "popover", "tooltip", "inline", "link preview", "text", "glossary"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["PeekWords.tsx", "peek-words.css", "peek.ts"],
  dependencies: [],
  prompt:
    "Build inline preview cards for words in running text. Two parts: PeekText wraps a block of text (props: theme, width — default 300px) and owns one shared card; Peek marks a word or phrase (props: title, caption, picture element or src and alt).\n\nA marked word keeps the surrounding font but turns to the ink colour at weight 600 with a 2px dotted underline offset 0.28em, which goes solid while its card is open. Each word is a real button.\n\nThe card is a 300px panel with 7px padding and a 20px radius, a 1px hairline and a deep soft shadow: a 3:2 picture with 14px corners and an inner hairline, then the title (1.02rem, 600) and a muted caption. Place it against the viewport: centred over the word with a 12px gap, flipped below when there isn't room above, and slid sideways so it never leaves the screen; then convert to the text block's coordinates. It grows out of the word — the transform origin sits at the word's position along the card's bottom (or top when flipped) — rising 8px and scaling from 0.94 over 280ms while it fades in over 180ms.\n\nOne card serves every word. Opening the first waits 70ms of hover intent; moving to another word opens it at once, and the card glides to its new place (left and top, 300ms) while its contents cross-fade — it never closes and re-opens between neighbouring words. Leaving closes it after 140ms. Keyboard focus opens it, blur closes it, Escape and a press outside close it. On touch, a tap toggles it. Re-place it on scroll and resize while open.\n\nThe card is a tooltip referenced by the open word's aria-describedby, so its title and caption are read with the word. Reduced motion keeps only the fade.",
  interaction: "Point at, focus or tap a dotted word to open its card; move between words and the card glides across. Escape or a press elsewhere closes it.",
  animation: "Opens by rising 8px and scaling from 0.94 over 280ms out of the word, fading in over 180ms; glides between words over 300ms with a 220ms cross-fade of its contents. Reduced motion: a plain 120ms fade.",
  a11y: "Each word is a button with aria-expanded; the card is a role=tooltip that the open word references with aria-describedby. Focus opens it, Escape closes it, and it never steals focus.",
  responsive: "The card flips below a word near the top of the screen and slides sideways to stay inside it; text wraps freely.",
  touchFallback: "Tap a word to open its card and tap again, or anywhere else, to close it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --peekw-card #141416; --peekw-edge rgba(255, 255, 255, 0.09); --peekw-ink #f4f4f1; --peekw-line rgba(255, 255, 255, 0.4); --peekw-muted #a3a39e; --peekw-shadow 0 30px 60px -20px rgba(0, 0, 0, 0.8), 0 8px 20px -10px rgba(0, 0, 0, 0.6). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --peekw-card #ffffff; --peekw-edge rgba(20, 20, 18, 0.08); --peekw-ink #151513; --peekw-line rgba(20, 20, 18, 0.45); --peekw-muted #5c5a54; --peekw-shadow 0 30px 60px -24px rgba(40, 30, 10, 0.35), 0 8px 20px -12px rgba(40, 30, 10, 0.25). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#050505", mode: "fill", frame: [1200, 800] },
};
