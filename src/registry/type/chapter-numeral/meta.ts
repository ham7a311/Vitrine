import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "chapter-numeral",
  "name": "Chapter Numeral",
  "category": "type",
  "description": "A giant outlined numeral that fills from the bottom like a rising liquid level as it scrolls into view, with the name set on its baseline.",
  "tags": [
    "name",
    "numeral",
    "outline",
    "scroll",
    "fill"
  ],
  "traits": [
    "scroll",
    "ambient"
  ],
  "source": "original",
  "files": [
    "ChapterNumeral.tsx",
    "chapter-numeral.css"
  ],
  "dependencies": [],
  "prompt": "Set a two-digit numeral in Anton at clamp(9\u201320rem), drawn twice: an outline copy (1.5px text-stroke, 70% accent) and a solid accent copy stacked on top, clipped with inset(100% 0 0 0). When the block passes 50% visibility, transition the clip to inset(0) over 2.2s on an ease-in-out \u2014 the numeral fills like a level of liquid, darkening slightly toward the bottom via a multiply gradient. Place the person's name (italic serif) and role (mono) at the baseline with mix-blend-mode: difference so text stays legible across filled and empty regions.",
  "interaction": "Fills as it scrolls into view and drains as it leaves.",
  "animation": "2.2s clip-path inset transition on the fill layer.",
  "a11y": "Digits are decorative (aria-hidden); the figcaption carries name and role. Reduced motion shows the filled numeral.",
  "responsive": "Numeral size uses clamp(); the caption sits on the baseline on one line, so on a phone a long name runs past the numeral instead of wrapping into it.",
  "variants": [
    {
      "id": "cyan",
      "label": "Cyan",
      "prompt": "color=\"#5fd6e8\" (cyan), number \"03\"; name \"Hamza Al-Bulushi\", role \"Software Engineer\"."
    },
    {
      "id": "rose",
      "label": "Rose",
      "prompt": "color=\"#ff7fb6\" (rose), number \"07\"; name \"Hamza Al-Bulushi\", role \"Software Engineer\"."
    },
    {
      "id": "gold",
      "label": "Gold",
      "prompt": "color=\"#ffc35c\" (gold), number \"12\"; name \"Hamza Al-Bulushi\", role \"Software Engineer\"."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
