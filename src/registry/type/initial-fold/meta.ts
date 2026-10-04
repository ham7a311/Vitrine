import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "initial-fold",
  "name": "Initial Fold",
  "category": "type",
  "description": "A full name that folds down to its initials: the letters between them collapse to zero width in a stagger, and the initials gain periods.",
  "tags": [
    "name",
    "initials",
    "collapse",
    "hover",
    "toggle"
  ],
  "traits": [
    "hover",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "InitialFold.tsx",
    "initial-fold.css"
  ],
  "dependencies": [],
  "prompt": "Render each word of a name as: an italic serif initial in amber, an optional period, and the remaining letters inside a grid cell whose column animates 1fr\u21940fr (so the collapse has no fixed width). By default the name is folded \u2014 rests at 0fr and 0 opacity, periods shown. Hovering or focusing unfolds it over 0.55s with each word delayed by 70ms; leaving refolds it. A click/tap toggles, since touch has no hover.",
  "interaction": "Hover or focus unfolds the name; click/tap toggles.",
  "animation": "grid-template-columns 0fr\u21941fr with cubic-bezier(.6,0,.2,1), per-word stagger; periods fade/scale via width.",
  "a11y": "One button with aria-label of the full name and aria-pressed; visible focus ring; reduced motion drops the transitions.",
  "responsive": "Font size scales with clamp(); words never wrap.",
  "promptAllow": ["folded"],
  "variants": [
    {
      "id": "folded",
      "label": "Two words",
      "prompt": "Two words: \"Hamza Al-Bulushi\" (the hyphenated surname folds as one word), starting folded."
    },
    {
      "id": "long",
      "label": "Three words",
      "prompt": "Three words: \"Hamza Al Bulushi\", so three initials fold and unfold with the 70ms stagger."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
