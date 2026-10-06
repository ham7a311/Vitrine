import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ask-bar",
  name: "Ask Bar",
  category: "ai",
  description: "A quiet place to start a conversation: a greeting over a deep blue glow and one rounded bar to ask in. It grows as you write, swaps the microphone for send, attaches files from its plus menu and switches model from its own; once you ask, the answer streams in above it.",
  tags: ["ai", "chat", "composer", "prompt", "assistant", "input", "voice", "model"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["AskBar.tsx", "ask-bar.css", "stream.ts"],
  dependencies: [],
  prompt:
    "Build the opening screen of a chat assistant (a fictional 'Qalam').\n\nScene: a near-black page (#0e0f14) with a deep navy glow (a wide radial #1b2b6e, centred a little below the middle, with a darker pool top left) that breathes over 14s. The greeting and the bar sit together a little above the centre. The greeting, 'What shall we look into today?', is centred on one line in a 400-weight grotesk at about 44px, #e8eaed; its words fade up out of a slight blur one after another.\n\nThe bar: 47rem wide at most, 64px tall, #1f1f1f, fully rounded, a hairline ring and a soft shadow. Left, a 44px round '+' button; then the textarea with the placeholder 'Ask Qalam' (17px, #9aa0a6); right, a model button showing the model name ('Swift ⌄', 500 weight) and a microphone button. Hovered and open buttons get a #2a2a2a circle.\n\nBehaviour: the textarea grows line by line up to eight lines; past one line (or with attachments) the bar rounds to 28px, the text takes the full width and the controls drop to a row beneath. With text in the field the microphone becomes a round light 'send' button (it pops in); Enter sends, Shift+Enter breaks the line. The '+' menu (Upload files, Add photos, Start from a template) opens upward; files appear as chips above the text with a remove button. The model menu lists three models with a one-line note each and ticks the current one. The microphone uses the Web Speech API when there is one (four live level bars and an accent ring while listening) and says so plainly when there isn't.\n\nSending: the greeting steps aside and a conversation appears above the bar: your message in a #2b2c30 bubble on the right, then a reply that streams in word by word next to a small four-point spark that turns while it writes, with the model's name under it. The send button becomes stop while it streams.",
  interaction:
    "Type and press Enter (Shift+Enter for a new line). '+' and the model button open menus: ↑/↓, Home and End move, Enter picks, Escape or Tab closes and returns focus. The microphone dictates into the field. Stop ends a streaming reply.",
  animation: "The glow breathes; the greeting's words fade up once; menus rise 6px; send pops in; replies stream word by word with a turning spark. Reduced motion keeps all of it still.",
  a11y: "A real form with a labelled textarea; menu buttons carry aria-haspopup and aria-expanded; the model menu uses menuitemradio with aria-checked; the conversation is a polite live log; voice errors are announced.",
  responsive: "The bar fills the width on phones and keeps its controls; the model button tightens below 520px.",
  touchFallback: "Every control is a 44px tap target.",
  variants: [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
  ],
  preview: { bg: "#0e0f14", mode: "fill", frame: [1440, 860] },
  isNew: true,
};
