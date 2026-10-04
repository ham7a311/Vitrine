import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "star-rate",
  "name": "Star Rate",
  "category": "micro",
  "description": "A five-star rating where the stars light one after another with a pop; five stars throws a sparkle, and a line says what it means.",
  "tags": [
    "rating",
    "stars",
    "review",
    "feedback",
    "radio",
    "form",
    "icon",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard",
    "hover"
  ],
  "source": "original",
  "files": [
    "StarRate.tsx",
    "star-rate.css"
  ],
  "dependencies": [],
  "prompt": "Build a five-star rating as a radiogroup of five star buttons (44px targets, roving tabindex, arrow keys, Home/End). Hovering previews the fill up to the hovered star. Choosing a rating fills the stars one after another — each star pops (scale 1 → 1.35 → 1 while it fills amber, 460ms) with a 70ms stagger — and choosing five also throws eight small sparks out of the last star. A line under the stars says what the rating means (\"Not for me\" … \"Loved it\"), announced politely. Two identical pop keyframes alternate per choice so the stagger replays without remounting the buttons (so keyboard focus is kept).",
  "interaction": "Hover to preview, click or tap to rate; arrow keys move and select when focused.",
  "animation": "Star pop 460ms with a 70ms stagger; sparks 700ms on a five-star rating.",
  "a11y": "A radiogroup of labelled radios (\"3 stars\") with roving tabindex; the meaning line is a polite live region. Reduced motion fills the stars instantly with no sparks.",
  "responsive": "A fixed-size control that sits inline wherever it's placed; nothing depends on screen width.",
  "touchFallback": "Works the same on touch; there's no hover-only behaviour.",
  "variants": [
    {
      "id": "paper",
      "label": "Paper"
    },
    {
      "id": "night",
      "label": "Night"
    }
  ],
  "preview": {
    "bg": "#f3f1ec",
    "mode": "fill",
    "height": 420
  },
};
