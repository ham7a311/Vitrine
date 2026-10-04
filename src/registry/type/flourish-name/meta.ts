import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "flourish-name",
  "name": "Flourish Name",
  "category": "type",
  "description": "A name in italic serif that signs itself: a calligraphic swash draws under it with a thick-thin stroke, then the ink dot lands.",
  "tags": [
    "name",
    "signature",
    "svg",
    "stroke-draw",
    "calligraphy"
  ],
  "traits": [
    "ambient",
    "click"
  ],
  "source": "original",
  "files": [
    "FlourishName.tsx",
    "flourish-name.css"
  ],
  "dependencies": [],
  "prompt": "Set a name in Instrument Serif italic in the ink colour, clamp(3\u20136rem), which fades and un-blurs in when scrolled into view. Beneath it draw a calligraphic swash as an SVG cubic path with pathLength=1: one thick stroke (3.2px) and one hairline copy (0.8px, offset 2px, 70% opacity), both animated with stroke-dashoffset 1\u21920 over 1.7s on an ease-in-out curve so they read as a thick-and-thin pen stroke. When the stroke completes, an ink dot at its end pops from scale 0 with overshoot. Clicking replays the signature.",
  "interaction": "Signs itself when scrolled into view (IntersectionObserver); click or Enter replays.",
  "animation": "stroke-dashoffset draw (1.7s) on two paths, staggered; dot pop; text fade/blur reveal.",
  "a11y": "The whole signature is a button labelled with the name; reduced motion shows the finished signature statically.",
  "responsive": "The name uses clamp() and the swash SVG scales to width.",
  "variants": [
    {
      "id": "ivory",
      "label": "Ivory",
      "prompt": "ink=\"#f4efe6\" (ivory) on #0c0b0a; name \"Hamza\"."
    },
    {
      "id": "ember",
      "label": "Ember",
      "prompt": "ink=\"#f0a35e\" (ember orange) on #100a06; name \"Hamza\"."
    },
    {
      "id": "mint",
      "label": "Mint",
      "prompt": "ink=\"#9fe3c4\" (mint) on #07100d; name \"Hamza\"."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
