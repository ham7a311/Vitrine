import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "margin-note",
  name: "Margin Note",
  category: "highlights",
  description: "Comments that live beside the words they're about: each highlighted phrase is tied to its card in the margin by a soft curve, and cards line up with their phrase without overlapping. Point at or tab to either side and the pair lights up together; on narrow screens the cards drop below the text, numbered to match.",
  tags: ["highlight", "comments", "annotations", "margin", "review", "editor", "connector"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["MarginNote.tsx", "layout.ts", "margin-note.css"],
  dependencies: [],
  prompt: `Build review comments in the margin of an article draft: a Newsreader headline and two paragraphs with three highlighted phrases (one wrapping over two lines), each tied to a comment card from a colleague in a margin column on the right.

Phrases: a <mark> per comment, focusable, with aria-describedby pointing at its card. At rest it carries a soft band of tint over the lower 55% of the letters (linear-gradient, box-decoration-break: clone so it wraps cleanly); when its pair is active the band fills the whole line with a 2px accent underline. A small superscript number in the accent colour follows each phrase.

Margin (container 700px or wider): a 15.5rem column, 56px from the text. Each card wants its top 10px above its phrase's first line; cards are stacked in that order so none overlap (14px apart), moving to new places with a 300ms ease. A connector SVG (behind the text) draws, for each pair, a dot at the end of the phrase's last line and a curve from there to the card's left edge 22px below its top — level at both ends, curving between — dashed and faint at rest. Positions are measured from the live layout (getClientRects, ResizeObserver, fonts.ready).

Cards: 12px radius, hairline border, author with a numbered accent badge, a timestamp and the comment; focusable, with an accessible name ("Comment 2 by Tomás").

Linking: pointing at or focusing either a phrase or its card makes the pair active — the phrase's band fills, its connector turns solid accent and thicker, the card takes an accent border, nudges 4px toward the text and lifts with a shadow — while the other connectors fade to 35% and other cards to 60%.

Narrow (under 700px): connectors are hidden and the cards follow the text as a list; the matching numbers on phrases and cards keep the pairs together, and hovering or focusing still highlights both.`,
  interaction: "Point at or tab to a phrase or a comment to light up the pair.",
  animation: "Cards settle into place (300ms); the active pair's connector, band and card change over 200ms, the card nudging toward the text with a spring.",
  a11y: "Every phrase is focusable and described by its comment card; cards are focusable with an accessible name; pairs are also tied by visible numbers, so nothing depends on the connectors alone. Focus rings are visible on both.",
  responsive: "Below a 700px container the margin becomes a list after the text and the connectors disappear; above it, positions follow every rewrap.",
  touchFallback: "Tapping a phrase focuses it and highlights its comment.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --accent #e8a10b; --card #ffffff; --focus #2457d6; --ink #1c1b1f; --line rgb(28 27 31 / 0.12); --muted rgb(28 27 31 / 0.55); --tint rgb(255 196 61 / 0.32); --wire rgb(28 27 31 / 0.2). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --accent #ffc23d; --card #1c1c20; --focus #8fb2ff; --ink #ecebe6; --line rgb(236 235 230 / 0.1); --muted rgb(236 235 230 / 0.55); --tint rgb(255 196 61 / 0.2); --wire rgb(236 235 230 / 0.22). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f1ea", mode: "fill" },
  isNew: true,
};
