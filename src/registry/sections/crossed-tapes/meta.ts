import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "crossed-tapes",
  name: "Crossed Tapes",
  category: "sections",
  description: "A section that opens under two tapes crossed like a cordon, each printed with big words — alternately solid and outlined — that roll along it in opposite directions and roll faster while the page is scrolling. Copy on the left, the actions on a tilted card in the tape's colour on the right. Caution stripes, festival colours or black and white.",
  tags: ["section", "breaker", "marquee", "tape", "ticker", "bold", "typography", "scroll", "event", "sale"],
  traits: ["scroll", "ambient"],
  source: "original",
  isNew: true,
  files: ["CrossedTapes.tsx", "crossed-tapes.css", "tape.ts"],
  dependencies: [],
  prompt:
    "Build a section that opens under two crossed tapes of rolling words. Props: words, eyebrow, title, lead, card {title, detail}, primary and secondary links {label, href}, palette {ground, ink, muted, line, a, aInk, b, bInk}, stripes, onNavigate and className.\n\nHelpers (pure functions): fold an offset into one repeat; a tape's pace — 46px/s boosted by the page's scroll speed up to five times (1 + min(4, |speed| / 500)); and a half-life of 0.25s that lets the measured scroll speed die away.\n\nThe crossing is 21% of the width tall (190–280px). Two tapes 130% wide and 5% of the width tall (48–66px) cross in it: tape A rotated −4.5° on top, tape B rotated 3.5° under it, each with a soft shadow, and optional hazard stripes along both edges in the tape's ink. Each tape holds a track of four copies of the words, in heavy uppercase, alternately solid and outlined (text-stroke), separated by a ✦. A requestAnimationFrame loop — running only while the section is on screen — moves both tracks by the same offset, one left and one right, each wrapped by the measured width of one copy so they never jump. A capture-phase scroll listener on the document (so it hears any scrolling ancestor) measures scroll speed. The words also sit in a visually hidden line for screen readers. Reduced motion leaves the tapes still.\n\nBody (container queries): two columns — eyebrow, a heavy uppercase title and a muted lead on the left; on the right a card in tape A's colour, tilted 1.5°, with a bold heading, a detail line, a primary button in tape B's colours and an outlined secondary; buttons lift and tilt on hover. One column below 780px.",
  interaction: "Scroll and the tapes speed up; the links work as normal.",
  animation: "Tapes roll at 46px/s in opposite directions, up to five times faster while scrolling. Reduced motion keeps them still.",
  a11y: "A labelled section with real links; the rolling tapes are hidden from screen readers and their words given once as text. Contrast holds on the tapes and the card.",
  responsive: "Tapes scale with the width; the body stacks below 780px.",
  touchFallback: "Touch scrolling speeds the tapes up the same way.",
  variants: [
    { id: "caution", label: "Caution", prompt: "Caution tape: yellow #ffd400 with black words and hazard stripes crossed over black tape with yellow words, on off-white #f2efe6 with black ink." },
    { id: "festival", label: "Festival", prompt: "Festival tapes in pink #ff4f8b and teal #21c7b5 with deep violet words, no stripes, on a deep violet #1a1033 section with near-white ink." },
    { id: "mono", label: "Mono", prompt: "Black tape with off-white words crossed over off-white tape with black words, no stripes, on stone #e8e6e1." },
  ],
  preview: { bg: "#f2efe6", mode: "fill", frame: [1440, 900] },
};
