import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "splice",
  name: "Splice",
  category: "ai",
  description: "Treat several AI drafts as material instead of rival answers. Each draft is cut into sentences; pick the best sentence from any of them and it flies into the final text on the right, keeping its draft's colour, ready to reorder or drop.",
  tags: ["ai", "writing", "drafts", "editor", "compose", "llm", "selection"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["Splice.tsx", "splice.css", "segment.ts"],
  dependencies: [],
  prompt:
    "Build a composer for assembling one text from several generated drafts (Short, Warm, Detailed), sentence by sentence, so the person keeps the best of each instead of choosing one draft wholesale.\n\nPanel: a 14px-radius warm off-white panel in Inter. From 56rem it holds the drafts on the left as equal columns and a 19rem Final column on the right; below 48rem the drafts become tabs above a single column. Each draft column is a white card with a 3px top rule in its colour (blue, rust, green, violet), a header with a coloured letter tile (A, B, C), its name and a key hint (1, 2, 3), and its text split into sentences with Intl.Segmenter (joining wrongly split abbreviations), each sentence a full-width button in 13.5px with 1.5 line height. Hover tints a sentence in its draft's colour. A picked sentence is greyed with a small round badge showing its position in the final text.\n\nFinal: a white card headed 'Final' with a live word count; until something is picked, a dashed note explains what to do. Picked sentences stack as rows with a 3px left rule and a faint wash in their draft's colour, with up, down and remove buttons that appear on hover or focus. A footer counts how many came from each draft (A 2 · B 1 · C 2) beside a dark 'Use this text' button.\n\nWhen a sentence is picked it flies from its place in the draft to its new row (FLIP from the button's rectangle); reordering slides the rows. Clicking a picked sentence again, or removing its row, returns it.",
  interaction:
    "Click a sentence to add or remove it. Keys: 1–4 jump to a draft, ↑/↓ move within it, Enter or Space picks; in the final list, Alt+↑/↓ reorders the focused row and Delete removes it. onUse({ text, picks }) receives the joined text and where every sentence came from.",
  animation: "A picked sentence travels from the draft to the final list over 380ms with cubic-bezier(.2,.8,.2,1); reordered rows slide over 220ms; tints fade over 140ms. Reduced motion or motion={false} moves things instantly.",
  a11y:
    "Sentences are toggle buttons with aria-pressed; each draft column is a labelled region with one tab stop and arrow-key movement. Final rows are focusable with their position, source draft and text in their name. Every add, removal and move is announced in a polite live region. On narrow screens the drafts are a proper tablist.",
  responsive: "Side by side from 56rem, final under the drafts between 48 and 56rem, and drafts as tabs below 48rem.",
  touchFallback: "Tap sentences to pick them; row tools are always visible on touch screens.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --splc-bg #f7f6f2; --splc-c1 #2c62c9; --splc-c2 #b0491f; --splc-c3 #1f7a55; --splc-c4 #7a4bb0; --splc-card #ffffff; --splc-ink #1d1c19; --splc-line rgb(29 28 25 / 0.12); --splc-muted #6b675f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --splc-bg #121314; --splc-c1 #7fa6ff; --splc-c2 #f0956c; --splc-c3 #6fd1a2; --splc-c4 #c49bff; --splc-card #1a1b1d; --splc-ink #ebe9e4; --splc-line rgb(255 255 255 / 0.1); --splc-muted #a19d95. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e9e7e1", mode: "fill", frame: [1300, 760] },
  isNew: true,
};
