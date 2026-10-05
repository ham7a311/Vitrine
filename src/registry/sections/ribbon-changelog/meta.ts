import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ribbon-changelog",
  name: "Ribbon Changelog",
  category: "sections",
  description: "Release notes on a ruled margin with a bookmark ribbon laid where you stopped reading, so what is new since your last visit is simply what lies above it. Filtering folds what doesn't match instead of removing it.",
  tags: ["changelog", "release notes", "updates", "versions", "filter", "what's new", "bookmark", "section"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["RibbonChangelog.tsx", "ribbon-changelog.css"],
  dependencies: [],
  prompt: `Build a changelog page section that answers "what is new for me?" without badges or a modal.

Data: releases with a version, an ISO date, a title and a list of changes, each tagged new, improved or fixed. Sort newest first.

Bar: a row of text filters (All, New, Improved, Fixed), each with a mono count, as buttons with aria-pressed; the chosen one has a 1px underline drawn under it (background-size 0 to 100%, 280ms). On the right, in mono capitals, a role=status line: "3 releases since your last visit", or "You are up to date".

Each release is a ruled row: on wide containers (container query at 40rem) the date sits in an 8.5rem margin column in mono capitals and the content beside it; narrow, it stacks. The content has the heading as a serif sentence (26px) with the version in small mono before it, and a list of changes: a mono kind label (New in green, Fixed in amber, Improved in muted ink) and the sentence at 15px. Dates of releases newer than the last visit are accent coloured.

The bookmark ribbon: between the newest release the visitor has already seen and the first they have not, draw a 1px accent rule across the width with a small 14 by 22px notched ribbon (path M0 0h14v22l-7-5-7 5z) hanging from it and the words "You were here 12 days ago" in mono capitals. The ribbon hangs in with a scaleY from the top over 520ms the first time. The last visit comes from a prop, or from localStorage (read the previous value, write today's, inside try/catch because storage can be unavailable).

Filtering never removes rows. Every change and every release is wrapped in a fold (grid-template-rows 0fr to 1fr, 280ms, with opacity) so non-matching ones close to nothing in place and the ribbon keeps its position in the sequence. Paper and Night themes.`,
  interaction: "Choose a filter and everything that doesn't match folds shut; the ribbon stays between what you saw and what you didn't.",
  animation: "Folds 280ms with opacity 200ms; filter underline draws 280ms; ribbon hangs in 520ms once.",
  a11y: "Filters are buttons with aria-pressed in a labelled group; the count line is a status region. Releases are articles with their version as the heading and real <time> elements. Folded content stays out of the way visually; reduced motion makes folds instant.",
  responsive: "Container query at 40rem moves dates into a margin column; below 26rem change labels sit above their text.",
  touchFallback: "Everything is a plain button; nothing relies on hover.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 640 },
  isNew: true,
};
