import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pairwise-ranker",
  name: "Pairwise Ranker",
  category: "decisions",
  description: "Rank a long list by answering one easy question at a time, 'this or that?'. Binary insertion keeps the questions few, the ranking builds beside the cards, undo replays your answers, and the finished order is yours to adjust.",
  tags: ["ranking", "prioritise", "comparison", "survey", "backlog", "keyboard", "sorting"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["PairwiseRanker.tsx", "pairwise-ranker.css", "rank.ts"],
  dependencies: [],
  prompt:
    "Build a ranking tool that replaces 'drag these ten things into order' with a series of easy questions: two index cards side by side and the question 'Which should Masar build first?'. Underneath it is binary insertion: each new item is compared against the middle of the range of positions it could still take, so ten items need at most about 25 answers and usually fewer.\n\nLayout: a 16px-radius panel on a warm desk colour. From 50rem the panel splits into the question column and a 17rem 'Ranking so far' column on the right; below, they stack. The question is set large in Instrument Serif with a muted line 'Question 4 · up to 12 more' and a 4px progress bar under it.\n\nThe cards are real index cards: an off-white face, a thin red line 40px from the top and pale blue rules every 26px below it, a 6px radius, a soft drop shadow, a small key cap in the corner (← on the left card, → on the right), the item title in 19px semibold Hanken Grotesk and a muted one-line detail sitting on the rules. A small italic 'or' disc sits in the gap between the cards. Below: quiet outline buttons 'About the same', 'Undo' and 'Start over', and a faint key legend.\n\nThe ranking column is a white card with an uppercase label and an ordered list: rank numbers in Instrument Serif in the ink-blue accent, hairlines between rows, and '6 still to place' under it. When the last item is placed the question becomes 'Your ranking', the cards give way to 'Move anything that feels wrong, then confirm' with an accent 'Use this ranking' button, and each row gains small up/down buttons.",
  interaction:
    "Click a card, or press ← / 1 and → / 2; T means about the same (the item goes just after the one it was compared to); Z or Backspace undoes the last answer by replaying the others from the start. Card sides alternate each question so neither side is favoured. In the finished list, Alt+↑/↓ moves the focused row and the arrow buttons do the same by pointer. onComplete(ids) receives the order, best first, when it is confirmed.",
  animation:
    "The chosen card lifts 10px with a slight tilt and an accent ring while the other dims to 45%, for 220ms, then the next pair deals in (the faces fade up 6px). Rows slide to their new positions with a FLIP over 260ms, and a newly placed row carries a highlighter wash that fades over 1.4s. Reduced motion or motion={false} applies each answer at once with no movement.",
  a11y:
    "The cards are buttons with their key shortcuts declared; focus stays on the same card position between questions and moves to the confirm button at the end. The progress bar is a labelled progressbar. Each placement is announced ('Phone app placed 3rd of 6 so far'), as are undo, moves and confirmation. Finished rows are focusable with their rank in the name.",
  responsive: "Two columns from 50rem; below that the ranking sits under the question. Below 34rem the cards stack vertically with the 'or' between them and the key legend is hidden.",
  touchFallback: "Tap a card to choose it; Undo and the up/down buttons in the finished list are always visible on touch screens.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --prank-accent #1f3a8a; --prank-accent-ink #ffffff; --prank-bg #f1ece2; --prank-card #fffdf7; --prank-ink #1f1d1a; --prank-line rgb(31 29 26 / 0.14); --prank-margin #e2a198; --prank-mark #fbe7a1; --prank-muted #67625a; --prank-rule #d3deef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --prank-accent #a9bcff; --prank-accent-ink #10131c; --prank-bg #141412; --prank-card #1f1e1a; --prank-ink #eee8db; --prank-line rgb(255 255 255 / 0.1); --prank-margin #9c4c45; --prank-mark #4b4321; --prank-muted #a7a194; --prank-rule rgb(140 170 220 / 0.16). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e4ded2", mode: "center", frame: [1100, 720] },
};
