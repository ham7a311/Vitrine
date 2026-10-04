import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "scroll-ink-text",
  name: "Scroll Ink",
  category: "text",
  description: "A statement you read at the speed you scroll: words wait in faint ink and darken one after another, with a few words of soft edge ahead of the reading point. The phrases that matter take the accent and are underlined by hand the moment you reach them.",
  tags: ["scroll", "scrollytelling", "reveal", "word by word", "manifesto", "editorial", "serif", "underline", "text animation"],
  traits: ["scroll"],
  source: "original",
  files: ["ScrollInkText.tsx", "scroll-ink-text.css"],
  dependencies: [],
  prompt: `Build a scroll-driven statement. A section (min-height 520px) holds its own scroller (overflow-y auto, overscroll-behavior contain, focusable for keyboard scrolling) with a tall track (320%, min 1500px) and a sticky stage the scroller's height (container-type: size; height 100cqh) that centres a kicker, the statement and a sign-off.

Text: one span per word; {{…}} in the text marks accent phrases (inside a phrase the space travels inside the word span so the underline is continuous). The statement is set large in Newsreader (clamp(1.55rem, 4.1vw, 3.15rem), line-height 1.24, max 30ch, text-wrap: pretty).

Progress p = scrollTop / (90% of the scrollable distance). The reading point is head = p × (N + 5); each word's ink = clamp((head − i) / 5, 0, 1) and its opacity = 0.14 + 0.86 × ink, so a soft five-word edge leads the reading point. Accent words turn the accent colour once fully inked (380ms colour transition), and once a phrase's last word is inked its hand-drawn underline (an SVG wave used as a mask over an accent block, clip-path inset driven by --u) runs along it word by word over the next ~2 words of scroll. The sign-off fades up at the end. Work happens in one rAF per scroll event, never idle.

Chrome: a "Scroll" hint with a nudging chevron that fades once you start, and a hairline progress rail on the left in the accent. Themes: night (#0d0c0b, ivory, amber #f2b56b) and paper (#f4efe6, ink, rust #b4461c). Reduced motion: everything inked, no hint or rail.`,
  interaction: "Scroll inside it (wheel, trackpad, touch, or focus it and use the keyboard).",
  animation: "Scroll-linked: a five-word ink edge; accent colour 380ms; underline draws over ~2 words of scroll; sign-off 600ms.",
  a11y: "The full text is real text in reading order; the scroller is focusable and labelled. Opacity never drops below 14%, and reduced motion shows it fully inked.",
  responsive: "The statement size and padding are fluid; the sticky stage always fits the scroller's own height.",
  touchFallback: "Touch scrolling drives it the same way.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0d0c0b", mode: "fill" },
};
