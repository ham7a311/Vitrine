import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "end-credits",
  "name": "End Credits",
  "category": "type",
  "description": "Film-style end credits: roles in right-aligned mono, names in left-aligned italic serif, split on a hairline and rising slowly through a fade mask.",
  "tags": [
    "names",
    "credits",
    "film",
    "marquee",
    "scroll"
  ],
  "traits": [
    "ambient",
    "hover"
  ],
  "source": "original",
  "files": [
    "EndCredits.tsx",
    "end-credits.css"
  ],
  "dependencies": [],
  "prompt": "Build a looping end-credits roll. Each row is a three-column grid: role on the left in Geist Mono uppercase (0.6875rem, 0.16em, accent colour) right-aligned, a 1px vertical hairline that fades at both ends, and the names on the right in Instrument Serif italic (clamp 1.3\u20131.9rem). Render the list twice inside one track and translate the track -50% over 28s linear infinitely for a seamless loop. Mask the top and bottom 18% with a gradient so rows emerge from and dissolve into darkness. Hover or focus pauses the roll.",
  "interaction": "Rolls continuously; hover or keyboard focus pauses it.",
  "animation": "Seamless translateY(-50%) loop, 28s linear, paused on hover/focus.",
  "a11y": "Region is focusable and labelled; the duplicate list is aria-hidden. Reduced motion stops the roll and makes it scrollable.",
  "responsive": "Two-column grid scales with clamp() type and fills its container height.",
  "variants": [
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber roles) on #0c0b0a."
    },
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#9fb8d8\" (frost-blue roles) on #080a0e."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
