import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "confidence-ink",
  name: "Confidence Ink",
  category: "ai",
  description: "Generated text printed with the model's own certainty. Words it was unsure of come out in lighter ink with a dotted underline; open one to see what else it nearly wrote, with the odds, and swap it in. A slider sets how unsure counts as unsure.",
  tags: ["ai", "llm", "uncertainty", "probability", "confidence", "editing", "text"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ConfidenceInk.tsx", "confidence-ink.css", "ink.ts"],
  dependencies: [],
  prompt:
    "Build a reader for model output that shows token confidence. Input is a list of tokens { text, p, alternatives?: { text, p }[] } that join into the answer (here: when the Muttrah souq in Muscat opens).\n\nLayout: a warm off-white 14px-radius panel. Header: a small uppercase label and a range slider 'Mark words below 60%' (20–95%). Body: the answer in Newsreader at 20px/1.65. Tokens under the threshold render as inline buttons: the ink fades with the probability (never below half strength, via color-mix), with a 2px dotted violet underline. Hovering or opening one tints it. Opening shows a 15rem menu under the word, clamped inside the panel: 'The model weighed', then every option (the current word ticked) with its percentage and a faint bar behind it as wide as its probability. Picking one swaps it in; the swapped word turns green on a green wash (a short flash as it lands) and the old word stays in the menu, marked 'original', so it can be undone. Footer: '6 words below 60% · 1 changed by you' and a key showing 'unsure' and 'changed'.",
  interaction:
    "Tab reaches only the marked words. Enter or click opens the menu; ↑/↓, Home and End move through options, Enter picks, Escape or Tab closes and returns focus to the word. A click outside closes. Dragging the slider remarks the text live.",
  animation: "The menu fades down 4px on open; a swapped word flashes green once. Both are removed with reduced motion.",
  a11y: "Marked words are buttons with aria-haspopup=menu and labels that speak the probability ('8:30, 34% likely, 3 other choices'). Options are menuitemradio with aria-checked. Swaps are announced politely. Lighter ink never drops below readable contrast; the dotted underline carries the meaning without colour.",
  responsive: "Text steps down to 18px and the panel padding tightens below 520px; the menu stays clamped inside the panel.",
  touchFallback: "Tap a word to open its choices and tap one to swap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --cink-bar rgb(107 91 210 / 0.14); --cink-bg #faf8f3; --cink-edit #1d7a5a; --cink-edit-bg rgb(29 122 90 / 0.1); --cink-focus #6b5bd2; --cink-ink #1f1d1a; --cink-line rgb(31 29 26 / 0.1); --cink-low #6b5bd2; --cink-menu #ffffff; --cink-muted #75706a; --cink-paper #fffdf8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --cink-bar rgb(169 156 255 / 0.18); --cink-bg #15141a; --cink-edit #5fd3a6; --cink-edit-bg rgb(95 211 166 / 0.12); --cink-focus #a99cff; --cink-ink #ecebf2; --cink-line rgb(255 255 255 / 0.09); --cink-low #a99cff; --cink-menu #222129; --cink-muted #9c99a8; --cink-paper #1b1a21. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece9e1", mode: "center", frame: [1000, 620] },
};
