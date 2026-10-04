import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "heart-burst",
  "name": "Heart Burst",
  "category": "micro",
  "description": "A like button with one good moment: the heart pops, a ring blooms, sparks fly and the count rolls up.",
  "tags": [
    "like",
    "heart",
    "favourite",
    "button",
    "icon",
    "social",
    "burst",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "HeartBurst.tsx",
    "heart-burst.css"
  ],
  "dependencies": [],
  "prompt": "Build a like button (a pill with a heart and a count, aria-pressed) whose like has one good moment. Liking: the heart fills red (#ff4d6d) with a springy pop (scale 0.2 → 1.28 → 0.94 → 1, 520ms), a ring blooms out from behind it (scale 0.3 → 2.1 while its border thins and fades), seven small sparks in red, amber, violet and teal fly out on evenly spaced angles and shrink away, and the count rolls up one digit (a two-row reel translated −50%, 420ms). The pill border and background tint red. Unliking is quiet: the heart just empties and the count rolls back down, with no burst. The effect layer is re-keyed per like so it replays. Pressing scales the heart to 0.86.",
  "interaction": "Click, tap, Space or Enter to like and unlike.",
  "animation": "Pop 520ms springy; ring and sparks 520–620ms; count reel 420ms.",
  "a11y": "A real toggle button with aria-pressed and a label that includes the count; the burst is decorative. Reduced motion skips the pop, ring and sparks.",
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
