import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "trash-drop",
  "name": "Trash Drop",
  "category": "micro",
  "description": "A delete button that shows where the thing went: the lid tips open, a sheet drops in, the lid shuts and the bin shakes.",
  "tags": [
    "delete",
    "trash",
    "bin",
    "button",
    "icon",
    "remove",
    "undo",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "TrashDrop.tsx",
    "trash-drop.css"
  ],
  "dependencies": [],
  "prompt": "Build a delete icon button that shows where the thing went. The bin is an outlined SVG: a tapered can with two ribs, a lid with a handle that hinges at its right end, and a small sheet hidden above. On press the lid tips open 32° and lifts a pixel, the sheet drops into the can (translate down 10px, shrinking and fading), the lid shuts with a small overshoot, and the can gives a short shake (−6°, 4°, −2°) — about 620ms in all — and only then the delete callback runs, so the row disappears after the motion explains it. Hover tints the button red. Two identical keyframe sets alternate per press so it replays. Pair it with an undo; the demo is a drafts list with an Undo line.",
  "interaction": "Click, tap, Space or Enter to delete; the demo offers Undo afterwards.",
  "animation": "Lid 620ms; sheet drop 520ms after 80ms; shake 360ms after 400ms; the callback fires at 520ms.",
  "a11y": "Each button is labelled with what it deletes; the demo announces the deletion and offers Undo in a polite live region. Reduced motion deletes without the animation.",
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
