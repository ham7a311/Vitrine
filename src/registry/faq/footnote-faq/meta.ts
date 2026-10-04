import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "footnote-faq",
  name: "Footnote FAQ",
  category: "faq",
  description: "An FAQ written as two honest paragraphs: the phrases a reader would want to check carry footnote numbers, and opening one sets its answer as a note right under the line.",
  tags: ["faq", "questions", "footnotes", "editorial", "prose", "accordion"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["FootnoteFaq.tsx", "footnote-faq.css"],
  dependencies: [],
  prompt:
    "Replace a stack of FAQ accordions with prose. Write what the product does in a couple of paragraphs set in a serif at reading size; the claims a reader would want to check ('its own preview address', 'per seat, monthly or yearly', 'you can leave whenever you like') are inline role=button spans (so they can wrap across lines, which <button> can't) with a dotted accent underline and a small mono superscript number, numbered in reading order.\n\nPressing one inserts its note under that paragraph: a panel with a 2px accent rule on its left, the number, the question in bold and the answer, opening with a grid-template-rows reveal (520ms expo-out) while the answer fades and drops into place. Several notes can be open at once; the phrase stays washed in the accent while its note is open, and each note has a close button that returns focus to its phrase.\n\nBelow the prose, an 'All questions' index lists every question with its number, for people who scan; choosing one opens the note and moves focus to its phrase. Each note has a deep link (#faq-3) that opens it on load. Phrases are role=button spans (Enter and Space work) with aria-expanded and aria-controls, and their accessible name includes the question; closed notes are inert.",
  interaction: "Press an underlined phrase (or a question in the index) to open its note under the paragraph; press it again or the × to close.",
  animation: "Notes open with a grid-rows reveal (520ms) and the answer fades in 120ms later; underline and wash fade 200ms.",
  a11y: "Phrases are role=button spans (Enter and Space work) with aria-expanded/aria-controls whose names include the question, so a screen reader hears 'per seat, monthly or yearly, note 4: What counts as a seat?'. Notes are labelled regions and inert while closed. The index is a nav of real links with hash deep links. Reduced motion opens notes instantly.",
  responsive: "Prose reflows like any paragraph; notes take the full measure. Works from 320px up.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#fbfaf6", mode: "fill", height: 640 },
};
