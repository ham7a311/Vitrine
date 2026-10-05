import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "message-actions",
  name: "Message Actions",
  category: "ai",
  description:
    "The quiet row under an AI reply, where every action has its own honest micro-state: copy becomes a check, retry turns once and adds a version switcher, and a thumbs-down asks one short question.",
  tags: ["ai", "chat", "actions", "feedback", "toolbar", "copy"],
  traits: ["click", "keyboard", "hover", "touch"],
  source: "original",
  files: ["MessageActions.tsx", "message-actions.css"],
  dependencies: [],
  prompt: `Build the action row that sits under an AI reply. At rest it's 55% opacity; hovering or focusing the message brings it to full. Each icon button (18px line icons, 32px targets, ink tooltips from data-tip) answers in its own way:
- Copy writes the message text to the clipboard; the two-sheet glyph shrinks away and a check draws in its place for 1.4s, with a 'Copied' tooltip held open.
- Retry turns once (620ms, expo-out) and adds a version switcher '‹ 2 / 3 ›' in tabular mono; switching versions fades the message body in.
- Thumbs up fills lightly and pops (overshoot).
- Thumbs down fills, then folds open (grid rows 0fr → 1fr) a single line: 'What went wrong?' with reason pills staggered 40ms; choosing one replaces the line with 'Thanks — that helps the next answer.' for a couple of seconds.
- Share shows 'Link copied'.
Everything is announced through a polite live region. Paper and night themes, next to a small assistant mark.`,
  interaction: "Hover the reply to reveal the row; copy, retry (then flip between versions), vote, give a reason, share.",
  animation: "Copy morph 320ms; retry spin 620ms; vote pop 420ms overshoot; reason row fold 420ms; body cross-fade 460ms; tooltips 260ms.",
  a11y: "role=toolbar with labelled buttons, aria-pressed on votes, version count announced, live region for copied/shared/feedback. Reduced motion removes spins, pops and folds.",
  responsive: "Fluid up to 38rem; reason pills wrap.",
  touchFallback: "On touch the row is always at full opacity; tooltips appear only as confirmations.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ma-accent #c4673f; --ma-faint #a39b8f; --ma-ink #1f1b16; --ma-line rgb(31 27 22 / 0.1); --ma-muted #6b645a; --ma-surface #fffdf8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ma-accent #b9cce4; --ma-faint #6f6a74; --ma-ink #efe8dc; --ma-line rgb(239 232 220 / 0.1); --ma-muted #a7a1ab; --ma-surface #1b191e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f5f1e8", mode: "fill" },
};
