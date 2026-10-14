import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bloom-album",
  name: "Bloom Album",
  category: "cards",
  description: "An album cover that blooms: point at it and eight picture cards spring out from behind it into a loose, hand-placed ring, each one tilted and staggered; point at one to straighten and lift it. Leave and they tuck back into the pile.",
  tags: ["album", "gallery", "hover", "cluster", "photos", "travel", "cover", "stack"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["BloomAlbum.tsx", "bloom-album.css", "bloom.ts"],
  dependencies: [],
  prompt:
    "Build an album card that blooms into a cluster of pictures. Props: cover (any element), label, items [{id, title, picture element or src and alt}], size (cover size, default 340px), spread, theme and onSelect.\n\nAt rest only the cover shows — a rounded 26px square with a deep shadow — with the first three picture cards peeking out above it — offset about 16% left, 17% right and straight up, by 10–19% of its size — tilted −9°, 7° and −3°. The picture cards are 78% of the cover with 22px corners.\n\nOn pointer enter, focus inside or a tap, the cards spring out to slots around the cover: on an ellipse 0.98 × the cover's width and 0.86 × its height (times spread), starting at the top and going clockwise, with a small fixed wobble in angle and distance per card so the ring looks hand-placed, a tilt of up to ±7°, and a 32ms stagger. Use a slightly overshooting spring (cubic-bezier(0.34, 1.36, 0.64, 1), 600ms); cards near the top and bottom sit above those at the sides. The cover scales to 1.03 and stays on top. Pointing at a card straightens it (cancels its tilt), scales it to 1.06, lifts it above the others and shows its title as a small frosted pill. On leave (after 180ms), Escape or a press outside, they fold back in reverse order with a calmer ease.\n\nThe cover is a button with aria-expanded and a label like 'Coast Lines, a field album, 8 photos'; the cards are buttons named by their titles, hidden from assistive tech and out of the tab order while folded. Escape returns focus to the cover. On touch, a tap on the cover toggles the bloom. Reduced motion swaps positions instantly with only a fade.",
  interaction: "Point at, focus or tap the album to bloom it; point at a picture to straighten and lift it; leave, press Escape or tap outside to fold it away.",
  animation: "Bloom: 600ms overshooting spring with a 32ms stagger; fold: 420ms ease-in-out in reverse order; a hovered card lifts in 280ms. Reduced motion: instant moves with a 200ms fade.",
  a11y: "The cover is a button with aria-expanded and the photo count in its name. Pictures are named buttons, removed from the tab order and hidden while folded. Escape folds and returns focus.",
  responsive: "Size is a prop; the bloom extends beyond the cover, so leave room around it (about the cover's size on every side).",
  touchFallback: "Tap the cover to bloom or fold; tap a picture to select it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bloom-card-bg #1b1b1d; --bloom-lift 0 36px 70px -24px rgba(0, 0, 0, 0.85); --bloom-ring #ffffff; --bloom-shadow 0 24px 50px -22px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 0, 0, 0.35). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bloom-card-bg #e2e0da; --bloom-lift 0 34px 64px -24px rgba(40, 30, 10, 0.5); --bloom-ring #151513; --bloom-shadow 0 22px 44px -22px rgba(40, 30, 10, 0.45), 0 0 0 1px rgba(20, 20, 18, 0.08). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#050505", mode: "fill", frame: [1200, 900] },
};
