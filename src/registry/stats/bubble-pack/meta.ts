import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bubble-pack",
  name: "Bubble Pack",
  category: "stats",
  description: "Shares of a whole as circles that pack themselves together: they drift in and settle when it first appears, each sized by its value with its name and share inside. Point at a bubble — or its row in the list beside it — and it swells while the others shrink a touch and make room; the list holds the same numbers for reading and for the keyboard.",
  tags: ["stats", "bubbles", "circle packing", "shares", "breakdown", "physics", "svg", "interactive", "legend", "analytics"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  isNew: true,
  files: ["BubblePack.tsx", "bubble-pack.css", "pack.ts"],
  dependencies: [],
  prompt:
    "Build a breakdown of shares as packed bubbles. Props: title, items [{label, value}], unit, format, theme and className.\n\nPacking (pure functions): radii in proportion to the square root of each share so the circles together cover 52% of the field's area; seeded start positions on a golden-angle spiral with the biggest in the middle; and a relaxation step — radii ease towards their targets, every circle drifts 3.5% of the way to the centre, three passes push overlapping pairs apart (each moving in inverse proportion to its size, with a 3px gap), and circles are kept inside the field; plus a measure of the worst overlap.\n\nLayout: the title and the total (\"103,700 visits\"), then two columns: the field and a list. The field is an SVG 340px tall as wide as its column (a ResizeObserver with inline-size containment). Each bubble is a group with a filled circle (one of eight distinct colours, a soft drop shadow) and, if it's big enough, its label and percentage inside in white (just the percentage for middling ones). On first render the bubbles start scattered at 2.2× the distance and 40% size and the simulation runs on requestAnimationFrame for 200 steps, so they drift together and settle; positions and radii are written straight to the elements.\n\nPointing at a bubble, or pointing at or focusing its row in the list, makes it the hot one: its target radius grows 14% (not so much that it outgrows a bigger share), the others shrink to 97% and fade to 45%, and the simulation runs again so they make room. The list rows are buttons with a colour dot, the label, the value and the share, labelled for screen readers, with the hot row tinted. The columns stack below 680px. Reduced motion settles the pack before showing it. Two themes, paper and night.",
  interaction: "Point at a bubble or a row in the list, or tab through the list, to swell that share while the others make room.",
  animation: "Bubbles drift in and settle over about three seconds; a hovered one swells while the others shift for about a second and a half. Reduced motion shows them settled.",
  a11y: "The bubbles are decorative; every share is a labelled button in the list with its value and percentage, so the data is fully readable and keyboard-reachable.",
  responsive: "The field fills its column and repacks on resize; the list moves under it on narrow screens.",
  touchFallback: "Tap a row in the list to highlight its bubble.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bp-bg #fbf9f4; --bp-c0 #1f5fae; --bp-c1 #b24a1f; --bp-c2 #127552; --bp-c3 #6b3fb8; --bp-c4 #8a6400; --bp-c5 #a8325d; --bp-c6 #1f6f7d; --bp-c7 #57524a; --bp-ink #1d1c19; --bp-line rgba(29, 28, 25, 0.1); --bp-muted #5f5b53; --bp-on #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bp-bg #121317; --bp-c0 #6aa6f0; --bp-c1 #f08a5d; --bp-c2 #4fcf9c; --bp-c3 #b18cf2; --bp-c4 #f0c24a; --bp-c5 #f27ba5; --bp-c6 #6cc8d6; --bp-c7 #b8b2a6; --bp-ink #eef0f4; --bp-line rgba(238, 240, 244, 0.1); --bp-muted #a3a6b0; --bp-on #0d0e12. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece9e2", mode: "center", height: 520 },
};
