import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "memory-drawer",
  name: "Memory Drawer",
  category: "ai",
  description: "The things an assistant remembers about you, laid out where you can see and change them: grouped by topic, pinned ones first, new ones marked as added from this chat with a soft pulse. Edit a memory in place, pin it, or forget it — it goes through a shredder, with an Undo — and pause memory with one switch.",
  tags: ["ai", "memory", "personalisation", "privacy", "settings", "assistant", "list", "edit", "undo", "chat"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["MemoryDrawer.tsx", "memory-drawer.css", "memory.ts"],
  dependencies: [],
  prompt:
    "Build a panel for what an assistant remembers about the user. Props: initial [{id, topic, text, source, pinned, fresh}], topics [{id, label}], name (\"Your assistant\"), onChange(items, enabled), theme and className.\n\nState (a pure reducer): edit (trimmed; empty edits are ignored), pin toggle, forget (removing the memory and keeping it with its index for undo), undo (putting it back where it was), and toggle memory on or off. A list helper shows one topic (or all) with pinned memories first and the rest in their original order — nothing re-sorts while you're pointing at it.\n\nLayout: a 440px card — the title \"Memory\" and \"Your assistant remembers 7 things about you\", and a switch (role switch, aria-checked) reading On or Paused. When paused, a status banner explains that new chats won't use or add memories, every card fades to grey and pin and edit are disabled (forget still works). A radiogroup of topic chips with counts. Then the memories as cards in a scrolling list: the text, a muted source line (\"From a chat · 3 Oct\"), and three icon buttons that brighten on hover or focus — pin (aria-pressed, a filled pin and an accent rule down the card's left edge when pinned), edit and forget. New memories carry a green \"Added from this chat\" chip with a pulsing dot.\n\nEditing swaps the text for a textarea with Save and Cancel; Enter saves, Shift+Enter breaks a line, Escape cancels. Forgetting shreds the card: nine copies, each clipped to a vertical strip, drop and fall away with alternating twists, 18ms apart (620ms), then it's removed and a toast slides up — \"Forgotten. Undo\" — for 6 seconds. Reduced motion removes it at once with no shredding. Two themes, paper and night.",
  interaction: "Pick a topic; pin, edit (Enter saves, Escape cancels) or forget a memory, with Undo; switch memory off and on.",
  animation: "Forgetting shreds the card into nine falling strips over 620ms; the toast slides up in 240ms; the switch knob springs. Reduced motion removes without the shredder.",
  a11y: "Real buttons with labels and states (switch, radiogroup, aria-pressed pins); the paused banner and the undo toast are status regions; the edit field is labelled.",
  responsive: "Up to 440px wide and shrinks to its container; the list scrolls inside the card.",
  touchFallback: "The card tools are always visible at a lower opacity, so nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --md-accent #b8572f; --md-accent-ink #ffffff; --md-bg #fbf9f4; --md-card #ffffff; --md-danger #b3321f; --md-fresh #2f7a5a; --md-ink #1d1a16; --md-line rgba(29, 26, 22, 0.1); --md-muted #625b51; --md-toast #1d1a16; --md-toast-ink #fbf9f4; --md-toast-link #f3b591. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --md-accent #f0a37c; --md-accent-ink #1d130d; --md-bg #17161b; --md-card #201f25; --md-danger #ff8f7d; --md-fresh #7fd6ac; --md-ink #efebe4; --md-line rgba(239, 235, 228, 0.1); --md-muted #a8a2ad; --md-toast #efebe4; --md-toast-ink #17161b; --md-toast-link #a8411a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efece5", mode: "center", height: 640 },
};
