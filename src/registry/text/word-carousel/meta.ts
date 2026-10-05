import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "word-carousel",
  name: "Word Carousel",
  category: "text",
  description: "A headline with a rotating word, done with care: the outgoing word lifts away letter by letter into a blur, the next rises into focus, and the slot springs to its new width so the sentence never jumps. Each word brings its own colours and a soft light beneath it.",
  tags: ["rotating text", "word rotator", "headline", "hero", "blur", "stagger", "gradient", "text animation"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["WordCarousel.tsx", "word-carousel.css"],
  dependencies: [],
  prompt: `Build a hero headline "Plan trips for [word]" where the word cycles through a list (your family / the whole team / just two / a long weekend), each with its own two-colour gradient.

Slot: an inline-block that holds the word, its width set to the measured width of the current word (every word is measured once in an invisible copy at the same size, re-measured on resize and fonts.ready) with a springy transition (640ms, cubic-bezier(.32,1.32,.46,1)), so the sentence reflows smoothly instead of jumping. perspective 700px.

Letters: one inline-block span per character (spaces as nbsp), coloured by color-mix(in oklch, from, to t%) along the word. Incoming letters animate from translateY(.5em) rotateX(−72°) scale(.96) blur(10px) opacity 0 to rest (720ms, ease-out, 30ms stagger); outgoing letters go to translateY(−.42em) rotateX(55°) blur(8px) opacity 0 (460ms, ease-in, 18ms stagger) and overlap the incoming ones in the same absolutely positioned slot.

Clock: a 2px gradient hairline under the word scales 0 → 1 over the interval (CSS animation); its animationend advances to the next word, so pausing is just animation-play-state: paused — on hover, focus, offscreen (IntersectionObserver) or the Pause button. A blurred radial glow in the word's colours sits behind it and transitions with each word.

Accessibility: the animated text is aria-hidden; a visually hidden sentence lists every option ("Plan trips for your family, the whole team, just two, or a long weekend."). Reduced motion swaps words without movement on a slower clock. Themes: night and paper (deeper gradients).`,
  interaction: "Hover or focus to hold the current word; Pause stops the rotation.",
  animation: "In 720ms (30ms stagger), out 460ms (18ms stagger), width spring 640ms; dwell 2.6s.",
  a11y: "Screen readers get one static sentence with all the options; the motion is aria-hidden and pausable (WCAG 2.2.2).",
  responsive: "Type is fluid (clamp(2.3rem, 7.4vw, 5.6rem)); the slot is inline, so on narrow screens it wraps under the prefix.",
  touchFallback: "Tap Pause to hold a word.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --glow-k 34%; --ink #f4f1ea; --muted rgb(244 241 234 / 0.5). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --glow-k 22%; --ink #18171a; --muted rgb(24 23 26 / 0.5). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#08080a", mode: "fill" },
};
