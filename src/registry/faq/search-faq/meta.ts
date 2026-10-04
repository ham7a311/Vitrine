import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "search-faq",
  "name": "Search FAQ",
  "category": "faq",
  "description": "An FAQ you can ask: typing filters and ranks the questions, highlights the words that matched in both question and answer, and the list re-sorts itself with a smooth FLIP.",
  "tags": [
    "faq",
    "search",
    "filter",
    "highlight",
    "flip",
    "accordion"
  ],
  "traits": [
    "keyboard",
    "click"
  ],
  "source": "original",
  "files": [
    "SearchFaq.tsx",
    "search-faq.css"
  ],
  "dependencies": [],
  "prompt": "Build a searchable FAQ. A large rounded search field (accent focus ring) sits above a tabular count ('3 of 6 questions', announced politely) and the list. Each row: a small mono category tag, the question, and a plus that becomes a minus; answers fold open with grid-template-rows 0fr \u2192 1fr.\n\nTyping scores every item by how many query words prefix-match words in it \u2014 question matches count 2, answer/tag matches count 1 \u2014 filters out zero scores, and sorts by score (stable by original order). Matching words are highlighted with a tinted <mark> in both the question and the open answer. The list re-sorts smoothly with FLIP: before each change, record every row's top; after render, animate each row from its old position (520ms expo-out), and new rows fade up 8px. When nothing matches, show a serif 'Nothing here matches \u201c\u2026\u201d' with a link to ask a person by email.",
  "interaction": "Type to filter and re-rank; click a question to open its answer; clear with \u00d7.",
  "animation": "FLIP re-sort 520ms; new rows fade up 420ms; answers fold 420ms; plus \u2192 minus 380ms.",
  "a11y": "Labelled search input, live result count, questions as buttons with aria-expanded, real <mark> highlights. Reduced motion removes FLIP and folding.",
  "responsive": "Fluid to 40rem; category tags hide below 34rem.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Everything is tap-sized; the keyboard opens with the field."
};
