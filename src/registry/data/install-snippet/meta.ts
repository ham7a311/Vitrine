import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "install-snippet",
  name: "Install Snippet",
  category: "data",
  description: "The install-and-connect block of a developer page: client tabs, numbered steps, hard-edged dark code blocks, and a copy button that only says Copied when the clipboard really took it.",
  tags: ["code", "install", "tabs", "developer", "copy", "docs"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["InstallSnippet.tsx", "install-snippet.css"],
  dependencies: [],
  prompt:
    "Build a developer quickstart block in a playful-technical, diagrammatic style: warm off-white page #f4efea, ink #383838, 2px ink borders, 2px corners, flat hard shadows, DM Mono uppercase for tabs, numbers and buttons, Inter light for prose.\n\nA row of joined folder-style tabs (Python, Node, CLI) sits on top of a white panel with a 4px 4px 0 hard shadow; the selected tab merges into the panel and carries a 6px yellow #ffde00 strip along its top edge, the others sit in the page colour with muted text. Inside, numbered steps: a 32×24 bordered number chip (sky #6fc2ff, then teal #16aa98 with white text, then coral #ff9538) beside a plain step title, then a dark #383838 code block with cream DM Mono 14px/1.65 text and a 2px border, horizontally scrollable without wrapping. Shell lines show a yellow '$ ' prompt that isn't selectable or copied; strings are pale amber and comments faint italic. A small outlined 'COPY' button sits in each block's top right: it fills teal and reads 'COPIED' only after navigator.clipboard.writeText resolves; if copying fails it fills coral, reads 'SELECTED', and selects the code so the reader can copy it themselves. Below 28rem the copy button sits above the code and the tabs share the width.",
  interaction:
    "Tabs follow the tablist pattern: ←/→/Home/End move and select, one tab stop. With storageKey the chosen tab is remembered (wrapped in try/catch). Copy strips shell prompts. Copied and fallback states clear after 2.2 seconds.",
  animation: "Only the copy button's fill changes, over 120ms. Reduced motion removes the transition.",
  a11y:
    "role=tablist/tab/tabpanel with aria-selected and aria-controls; code blocks are focusable so keyboard users can scroll them; copy buttons are named after their step; a hidden status line announces success or the fallback.",
  responsive: "Code scrolls sideways instead of wrapping; under 28rem the copy button moves above the code and tabs stretch evenly.",
  touchFallback: "Tabs and copy buttons are tap targets; long lines scroll with a swipe.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #f4efea, panel #ffffff, ink, borders and hard shadow #383838, muted #6f6a64, code blocks #383838 with #f4efea text and #a39e97 comments, yellow #ffde00, sky #6fc2ff, teal #16aa98, coral #ff9538." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #1f1f1f, panel #2a2927, ink and borders #f4efea with a #000000 hard shadow, muted #b9b2a9, code blocks #151515 with #f4efea text and #7d776f comments; accent chips keep their colours." },
  ],
  preview: { bg: "#f4efea", mode: "fill", frame: [860, 640] },
};
