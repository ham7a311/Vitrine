import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "copy-check",
  "name": "Copy Check",
  "category": "micro",
  "description": "A copy button that answers: the clipboard's two sheets fold into a tick and the label rolls to “Copied”, then back.",
  "tags": [
    "copy",
    "clipboard",
    "button",
    "icon",
    "tick",
    "feedback",
    "code",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "CopyCheck.tsx",
    "copy-check.css"
  ],
  "dependencies": [],
  "prompt": "Build a copy-to-clipboard button whose icon and label answer the click. The icon is two rounded rectangles (the clipboard's back and front sheet) and a hidden tick path. On copy (navigator.clipboard with a textarea fallback): both sheets slide toward each other, shrink to 60% and fade (280ms), while the tick draws itself in with stroke-dashoffset on pathLength=1 a beat later (360ms after 160ms); the label rolls from \"Copy\" to \"Copied\" (a two-row reel, 360ms); the button turns green. After 1.8s it all rolls back. A visually hidden status line announces \"Copied to clipboard\".",
  "interaction": "Click, tap, Space or Enter to copy; it resets itself after 1.8 seconds.",
  "animation": "Sheets fold 280ms; tick draws 360ms after 160ms; label reel 360ms; reset after 1.8s.",
  "a11y": "A real button with a visible label; the result is announced in a role=\"status\" region. Reduced motion swaps states instantly.",
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
