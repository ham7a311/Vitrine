import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "bookmark-fold",
  "name": "Bookmark Fold",
  "category": "micro",
  "description": "Saving pours colour down the ribbon from the top, drops it into its slot and flips the notch; a small “Saved” note rises.",
  "tags": [
    "bookmark",
    "save",
    "button",
    "icon",
    "ribbon",
    "favourite",
    "toggle",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "BookmarkFold.tsx",
    "bookmark-fold.css"
  ],
  "dependencies": [],
  "prompt": "Build a bookmark toggle (icon button, aria-pressed). The ribbon is an outlined SVG shape with a notched bottom; inside it, clipped to the same shape, a fill rectangle scaled on Y from the top. Saving: the fill pours down from the top (scaleY 0 → 1, 380ms ease-out), the ribbon drops 2px into its slot on a springy curve, the outline stretches a touch and settles (a short scaleY 1.06 → 0.97 → 1 keyframe from the top) like a ribbon catching, and a small amber \"Saved\" note rises above the button and fades over 1.4s. Unsaving drains the fill quickly upward. Amber (#f59e0b) is the saved colour.",
  "interaction": "Click, tap, Space or Enter to save and unsave.",
  "animation": "Fill 380ms; drop springy 360ms; catch 520ms after 260ms; note 1.4s.",
  "a11y": "A toggle button with aria-pressed and a label naming what it saves; the note is decorative. Reduced motion changes state instantly with no note.",
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
