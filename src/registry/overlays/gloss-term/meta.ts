import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gloss-term",
  name: "Gloss Term",
  category: "overlays",
  description: "Inline definitions for running text: a dotted word opens a small card on hover, focus or tap. The card knows where the edges are, flipping above when there's no room below and sliding aside while its notch keeps pointing at the word.",
  tags: ["tooltip", "popover", "definition", "glossary", "term", "inline", "hover card", "annotation"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["GlossTerm.tsx", "gloss-term.css"],
  dependencies: [],
  prompt: `Build an inline glossary term: a word inside a paragraph that explains itself without leaving the page.

The term is a real button that inherits the surrounding type, with a 1.5px dotted underline at 0.28em offset in currentColor at 45% opacity and a help cursor. When its card is open (or on hover) the underline turns solid.

The card is a fixed-position 20rem (max viewport width minus 24px) sheet: 10px radius, a 1px ring and a soft long shadow, 14px padding. Inside: the term's name in a 19px serif, the definition in 14px sans at 82% ink with pretty wrapping, an optional mono caps "Also:" line for other names, and an optional underlined link. It is a role=dialog (non-modal) labelled with the term, placed immediately after the button in the DOM so Tab reaches its link naturally.

Opening: hover (mouse only) after 140ms, keyboard focus (focus-visible only), or click and tap toggling it. Leaving the term or the card closes it after 140ms, and moving from the term onto the card cancels the close so the card can be entered. Escape closes it and returns focus to the term; a pointerdown outside closes it; only one glossary card is open at a time (a window event tells the others to close).

Placement is measured, not guessed: with the term's rect and the card's size, put it below with a 10px gap unless it would leave the viewport and there is room above, then flip. Centre it on the term and clamp its left edge between 12px and viewport width minus its width minus 12px. A 10px rotated-square notch sits on the edge facing the word; its left offset is the term's centre minus the card's left, clamped 16px inside the card, so it keeps pointing at the word after the card is pushed aside. Re-place on scroll (capture) and resize via requestAnimationFrame. The card fades and moves 4px in from the side it came from over 160ms, cubic-bezier(.2,.8,.2,1). Paper and Night themes.`,
  interaction: "Point at, tab to or tap a dotted word. Near the edge of the window the card slides over; scroll to see it flip above.",
  animation: "Card fades and moves 4px over 160ms; the underline turns solid in 160ms.",
  a11y: "The term is a button with aria-expanded and aria-controls; the card is a labelled non-modal dialog that sits next to it in tab order so any link inside is reachable. Hover never is the only way: focus-visible and click also open it. Escape closes it and restores focus. Reduced motion removes the fade.",
  responsive: "The card's width is capped to the viewport minus 24px and positioned by measurement, so it never leaves the screen at any width.",
  touchFallback: "Tapping the term toggles the card and tapping anywhere else closes it; mouse hover logic is ignored for touch pointers.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --gt-accent #2f6bff; --gt-bg #ffffff; --gt-ink #1b1a17; --gt-line rgb(27 26 23 / 0.14); --gt-muted #6b6861. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --gt-accent #7aa2ff; --gt-bg #1d1e22; --gt-ink #ececea; --gt-line rgb(255 255 255 / 0.16); --gt-muted #9a9ca2. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 560, frame: [760, 475] },
  isNew: true,
};
