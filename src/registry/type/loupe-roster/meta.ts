import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "loupe-roster",
  "name": "Loupe Roster",
  "category": "type",
  "description": "A dense wall of tiny names in mono, with a circular loupe following the pointer that magnifies whichever names it passes over.",
  "tags": [
    "names",
    "loupe",
    "magnify",
    "cursor",
    "keyboard"
  ],
  "traits": [
    "cursor",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "LoupeRoster.tsx",
    "loupe-roster.css"
  ],
  "dependencies": [],
  "prompt": "Lay out a paragraph of dozens of names in Geist Mono at 0.72rem, uppercase, dim grey, separated by middle dots. On pointer move, render a second copy of the same paragraph on top: an outer layer clipped with clip-path circle(72px at pointer) and given a dark opaque background, containing an inner layer scaled 2.4\u00d7 with transform-origin at the pointer \u2014 because both copies share the same layout, the magnified names line up exactly under the lens. Bright white text shows inside. Add an accent ring with glow around the lens. Arrow keys move the lens by 28px when the region is focused; touch drags it.",
  "interaction": "Pointer or finger moves the loupe; arrow keys move it under keyboard focus; leaving hides it.",
  "animation": "No keyframes \u2014 the clip-path and transform-origin follow the pointer through CSS variables.",
  "a11y": "Focusable region with label and arrow-key control; the magnified copy is aria-hidden so names are read once.",
  "responsive": "Text reflows with its container; the loupe radius and zoom are props.",
  "variants": [
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber lens ring); the paragraph is a list of ~40 engineering skills repeated twice."
    },
    {
      "id": "mint",
      "label": "Mint",
      "prompt": "accent=\"#7fe3b6\" (mint lens ring)."
    },
    {
      "id": "sky",
      "label": "Sky",
      "prompt": "accent=\"#8fc4ff\" (sky-blue lens ring)."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
