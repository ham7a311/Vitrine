import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "letterform-hero",
  name: "Letterform Hero",
  category: "heroes",
  description: "A portfolio hero where the name is a set of windows: the work shows through the letters, and pointing at a project wipes its view across them.",
  tags: ["hero", "portfolio", "name", "typography", "mask", "projects", "landing"],
  traits: ["hover", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["LetterformHero.tsx", "letterform-hero.css"],
  dependencies: [],
  prompt:
    "Build a portfolio hero where a short word (a first name) is set enormous in a condensed display face (Anton, uppercase, about 27% of the container width) and the letters are windows onto the work: each project has a cover (any CSS background, usually a screenshot) painted into the letters with background-clip: text.\n\nBelow the name, an index of projects: mono number, serif title, kind and year, separated by hairlines. Pointing at a row (or focusing it) changes the view through the letters: the new cover wipes in from left to right over the old one with a clip-path inset animation (900ms expo-out) while the previous cover stays underneath, so the letters are never empty. A caption under the name reads 'Through the letters — Vitrine, 2026'. The active row's title brightens and steps right, and a rule draws across its top.\n\nA faint outline of the letters (1px text-stroke) always sits beneath, so the word reads even before the covers load. The pointer shifts the cover inside the letters by up to 18px, like looking through a window; the layer box is padded so a shifted image never shows its edge inside a glyph. On phones (no hover) the view cycles every 4 seconds until the visitor touches the list. The heading's accessible text is the full name; the layered copies are aria-hidden.",
  interaction: "Point at or focus a project to see it through the letters. Move the pointer to shift the view. Rows are links.",
  animation: "Cover wipe 900ms expo-out; first arrival rises 1.1s; caption and row changes 300–600ms; parallax eases 900ms.",
  a11y: "The h1's text is the full name (visually hidden); the letter layers are aria-hidden. Projects are a list of real links, and focusing one changes the view just like hovering. Reduced motion swaps covers instantly, without parallax or cycling.",
  responsive: "Letter size follows the container (container query units). Below 520px the kind column hides; the auto-cycle replaces hover on touch screens.",
  touchFallback: "Without hover, covers cycle on their own every 4.2 seconds until the visitor touches the list; tapping a row opens it.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0c0b0e", mode: "fill", height: 640, frame: [1280, 800] },
};
