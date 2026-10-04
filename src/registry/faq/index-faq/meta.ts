import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "index-faq",
  name: "Index FAQ",
  category: "faq",
  description: "An accordion set like a book index: numbered entries, serif questions, a plus that becomes a dash and a rule that draws under the open one.",
  tags: ["faq", "accordion", "disclosure", "section", "editorial", "keyboard"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["IndexFaq.tsx", "index-faq.css"],
  dependencies: [],
  prompt: `Design an FAQ as the index of a book. A hairline-ruled ordered list; each entry is a full-width button in a three-column grid: a mono index number (01, 02…), a serif question (clamp 1.2–1.6rem, balanced wrapping), and a plus icon built from two 1.5px bars. Hovering nudges the question 4px right.

Opening an entry (one at a time): the vertical bar of the plus rotates to horizontal over 400ms so the plus becomes a dash, and both the plus and the index turn frost blue; the answer opens with a grid-template-rows 0fr → 1fr transition (450ms, cubic-bezier(0.16,1,0.3,1)) so its height animates without measurement, while the answer text fades in and settles down from −6px after a 120ms delay; and a frost rule draws left to right along the bottom of the entry (650ms). Use real headings containing buttons with aria-expanded and aria-controls, answers as labelled regions, and arrow-key/Home/End navigation between questions.`,
  interaction: "Click/Enter/Space toggles an entry; ↑/↓/Home/End move between questions.",
  animation: "Height 450ms via grid rows; icon 400ms; rule draw 650ms; text settle 450ms after 120ms.",
  a11y: "Disclosure pattern: <h3><button aria-expanded aria-controls>, regions labelled by their questions, keyboard navigation between headers. Reduced motion shortens transitions.",
  responsive: "Fluid width; question size scales with container; answer indent collapses gracefully.",
  preview: { bg: "#0b080d", mode: "fill" },
};
