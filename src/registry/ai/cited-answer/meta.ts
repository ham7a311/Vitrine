import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cited-answer",
  name: "Cited Answer",
  category: "ai",
  description: "An AI answer whose citations work both ways: point at a number and its source lifts out of the row above; point at a source and every sentence it supports is underlined.",
  tags: ["ai", "search", "citations", "sources", "answer", "research"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["CitedAnswer.tsx", "cited-answer.css"],
  dependencies: [],
  prompt: `Design an answer-engine result: a serif question, a 'Sources 4' label with a row of four small source cards (two-line title, favicon initial, domain, index number), then an 'Answer' label and the answer text as sentences, each ending in small pill citations.

Make the link between claim and evidence physical and bidirectional. Hovering or focusing a citation pill fills it with the accent, lifts its source card 4px (with an accent ring and shadow) and dims the other cards to 55%. Hovering or focusing a source card does the reverse: every sentence it supports gets a thick highlighter underline that draws in from the left (background-size 0% → 100% on a 0.35em band, 460ms expo-out). Cards and sentences enter with gentle staggers. The palette is a calm off-white with a deep teal ink and accent, plus a night version. Four source columns become two below 34rem (container query).`,
  interaction: "Hover or focus a citation to find its source; hover or focus a source to see what it supports.",
  animation: "Card lift 420ms; highlighter underline 460ms; entrance staggers of 60ms (cards) and 90ms (sentences).",
  a11y: "Citations are buttons labelled with their source title; sources are links; both respond to focus exactly as to hover. Reduced motion removes motion but keeps the highlighting.",
  responsive: "Container query drops the sources to two columns below 34rem.",
  touchFallback: "Tapping a citation focuses it, which lifts its source.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ca-accent #20808d; --ca-bg #fcfcf9; --ca-card #f3f3ee; --ca-ink #13343b; --ca-line rgb(19 52 59 / 0.1); --ca-muted #5f7479. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ca-accent #3ec5d3; --ca-bg #191a1a; --ca-card #202222; --ca-ink #e8e8e6; --ca-line rgb(255 255 255 / 0.08); --ca-muted #8d9191. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fcfcf9", mode: "fill" },
};
