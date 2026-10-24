import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "riso-mark",
  name: "Riso Mark",
  category: "highlights",
  description: "A highlight printed like a risograph: flat fluorescent pink with a blue halftone screen over it, slightly out of register, so a third colour appears wherever the dots land on pink, speckled where the ink didn't take. The passes slide into place as the word comes into view.",
  tags: ["highlight", "risograph", "print", "misregistration", "zine", "poster", "svg"],
  traits: ["scroll"],
  source: "original",
  files: ["RisoMark.tsx", "riso-mark.css"],
  dependencies: [],
  prompt: `Build a risograph-style highlight for a condensed, extra-bold uppercase poster headline in Archivo — "Print it [yourself], / two colours [at a time]" — in navy ink on cream paper, each marked phrase printed in fluorescent pink and blue.

Construction: an inline-block, nowrap wrapper (.03em inline margin, .12em padding) with a plate behind the word (z-index −1, isolated) from .26em below the top to .04em above the bottom of the line box — just above x-height to just below the baseline. The plate is an SVG sized in pixels (ResizeObserver) with two passes over the same rectangle (1.5px corners): a flat pink #ff48b0 at 92% opacity, then a blue #0078bf halftone screen at 85% with mix-blend-mode multiply — 1.45px dots on a 5px grid turned 18°, a riso screen angle — so violet appears only where the dots land on pink, and the words stay readable on the pink.

Grain: both passes run through a filter that punches tiny bare specks into the ink — fractal noise at base frequency 1.1, its alpha thresholded hard with a colour matrix (−9, +6.2) and composited "in" with the ink — the look of ink that didn't take on the drum.

Registration: at rest each pass is well out of place and invisible (pink .6em to the left, blue .6em to the right); when the word is 70% in view both slide in (900ms, cubic-bezier(.2,.75,.2,1)) to a final position that is still slightly off — pink nudged up and left by about .03em, blue down and right by about .05em — so the misregistration is part of the finished print. The word itself carries a faint pink text-shadow offset by .035em × .025em, as if the pink plate caught it too. On a dark page the blue pass uses screen instead of multiply. Reduced motion shows it printed.`,
  interaction: "None; each mark is printed once when its words scroll into view.",
  animation: "Two passes slide into register over 900ms.",
  a11y: "The plate is aria-hidden SVG; the words stay real text, navy on the light inks (or cream on the dark page) at 4.5:1 or better.",
  responsive: "Measured in pixels and offset in em, so the misregistration stays proportional at every size; phrases stay on one line.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --misprint rgb(255 72 176 / 0.55); --mix multiply; --pass-a 0.92; --pass-b 0.85. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --misprint rgb(255 72 176 / 0.45); --mix screen; --pass-a 0.7; --pass-b 0.7. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4efe4", mode: "fill" },
  isNew: true,
};
