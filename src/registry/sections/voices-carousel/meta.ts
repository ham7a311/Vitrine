import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "voices-carousel",
  name: "Voices Carousel",
  category: "sections",
  description: "A testimonial exhibition: one large quote at a time on frosted glass, crossfading between voices without ever resizing.",
  tags: ["testimonials", "carousel", "section", "quote", "glass", "keyboard"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["VoicesCarousel.tsx", "voices-carousel.css"],
  dependencies: [],
  prompt: `Design a testimonial section that feels like a quiet exhibition rather than a slider. On a warm near-black stage with a faint central glow: a mono eyebrow (amber index "04", short rule, label), a compact 600-weight title, and a one-line lead that ends in an italic serif phrase.

The centrepiece is one wide frosted-glass card (10px radius, 8% ink hairline, inner top highlight, deep soft drop shadow, backdrop-filter: blur(18px)) with a subtle sheen from the top-left. Inside: a circular placeholder avatar, the name in small tracked uppercase, the role in mono (with " at " rendered as " · "), the session in amber mono split over two lines, and then the quote — large (up to 2.75rem), weight 450, −0.028em tracking — with a giant, 8%-opacity italic serif opening quote mark tucked behind its first line.

All slides stay mounted and stacked in the same grid cell (grid-area: 1 / 1), so the card never changes height; switching crossfades opacity over 480ms (cubic-bezier(0.4,0,0.2,1)). Prev/next square pager buttons flank the card on wide screens (below it on narrow ones) and their arrows nudge 4px outward on hover. Arrow keys page through voices only while at least 25% of the section is in view. Below: a "01 / 06" mono index and an amber archive link whose ↗ nudges diagonally.

Two amber italic serif pull quotes float in the margins (top-right and bottom-left) on slow 16s/19s drifts. A wide 2688:1220 image plate grounds the bottom of the section, masked to fade in at the top and out at the bottom; until an image is supplied, show a halftone placeholder plate with a mono "[ image · 2688 × 1220 ]" caption.`,
  interaction: "Pager buttons or ←/→ (while the section is in view) crossfade to the previous/next voice, wrapping around.",
  animation: "Crossfade 480ms (200ms under reduced motion). Pull quotes drift 7px/6px over 16s/19s. Pager/arrow nudges 200ms.",
  a11y: "Labelled <section> with <h2>. Each voice is an <article> labelled by the speaker's name; inactive slides are aria-hidden and inert. A polite live region announces the new voice. Pager buttons are labelled; the arrow-key handler ignores inputs and elements marked data-own-arrows.",
  responsive: "Container queries: pagers move beside the card from 64rem, card padding steps at 40/48/64rem, the second pull quote hides and the first becomes inline below 40rem.",
  touchFallback: "Pager buttons are 44px touch targets; nothing depends on hover.",
  preview: { bg: "#0c0b0a", mode: "scroll", frame: [1100, 825], height: 760 },
  featured: true,
};
