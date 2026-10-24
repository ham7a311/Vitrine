import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pill-swap",
  name: "Pill Swap",
  category: "highlights",
  description: "A word held in a soft pill with a status dot, inside a headline. Every few seconds it changes: the old word lifts out of the top, the next rises in from below letter by letter, and the pill takes on the new word's tint, dot and ink while it springs to the new width.",
  tags: ["highlight", "pill", "rotating word", "status dot", "headline", "text animation", "hero"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["PillSwap.tsx", "pill-swap.css"],
  dependencies: [],
  prompt: `Build an inline pill highlight for a bold headline: "Where teams and agents [Jam] together." The pill holds one word from a list (Jam, Ship, Plan, Review); each word brings its own tint, dot colour and ink.

Pill: an inline-block with line-height 1.16 and height 1.16em, so its own line box carries the text baseline and the word sits exactly on the headline's baseline in any font; margin-block −.08em keeps the headline's line spacing even. Padding 0 .42em 0 .3em, fully rounded; everything is in em so it scales with the type. A .3em dot on the left (inline-block, raised .12em, .2em before the word) breathes (scale .8 at mid-cycle, 2.4s). Background, ink and dot colour transition over 520ms when the word changes; the dot sends out one ring (scale 1 → 2.8, fading, 760ms).

Word track: an inline-block inside the pill, overflow hidden with a vertical mask that fades the top and bottom 9%, so words appear to rise out of and sink into the pill. Its width is the measured width of the current word (every word is laid out once in an invisible copy at the same size and re-measured on resize and fonts.ready) and springs between widths (640ms, cubic-bezier(.34,1.32,.5,1)), so the sentence never jumps. Letters are inline-blocks: incoming ones rise from translateY(.9em) with a slight blur and fade (600ms, 28ms stagger), outgoing ones lift to −.85em and fade (380ms, 16ms stagger), overlapping in the same track.

Clock: a word stays 2.4s. It holds while the pointer is over the pill and while the pill is offscreen (IntersectionObserver); a paused prop lets a page stop it if it needs to. Reduced motion swaps the word with a short fade on a slower clock, without movement.

Accessibility: the pill is aria-hidden; a visually hidden span reads the options as part of the sentence ("Jam, Ship, Plan or Review").`,
  interaction: "Hover the pill to hold the word.",
  animation: "Letters in 600ms (28ms stagger), out 380ms (16ms stagger); width spring 640ms; colours 520ms; dot ring 760ms; 2.4s per word.",
  a11y: "Screen readers hear the sentence with every option once; the moving pill is aria-hidden. Hover holds the word, and a paused prop is there for pages that need a stop control. Ink is chosen per word at 4.5:1 or better against its tint.",
  responsive: "Sized in em, so it follows the headline from mobile to desktop; the pill never wraps, and the headline wraps around it.",
  touchFallback: "The words keep turning; there is no hover hold on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --edge transparent; --lift 0 0.04em 0.12em rgb(60 30 90 / 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --edge rgb(255 255 255 / 0.09); --lift 0 0.05em 0.3em rgb(0 0 0 / 0.35). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fbfaf8", mode: "fill" },
  isNew: true,
};
