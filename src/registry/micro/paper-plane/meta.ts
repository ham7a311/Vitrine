import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "paper-plane",
  "name": "Paper Plane",
  "category": "micro",
  "description": "A send button whose plane actually leaves — it tips back and launches away trailing a dashed line — then a fresh one glides in.",
  "tags": [
    "send",
    "button",
    "paper plane",
    "message",
    "submit",
    "icon",
    "chat",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "PaperPlane.tsx",
    "paper-plane.css"
  ],
  "dependencies": [],
  "prompt": "Build a send button (blue pill, 48px, white label with a paper-plane icon) whose plane really leaves. On press: the plane tips back (−3px, −12°) for a beat, then launches up and to the right (translate 70px, −60px, a slight turn, fading) over 650ms on an accelerating curve, trailing a short dashed line that flashes and fades; the label rolls from \"Send\" to \"Sent\" and the pill turns green. About 1.75s later a fresh plane glides in from the lower left (translate −40px, 18px → 0, fading in, 520ms) and the label rolls back, ready again. Presses during the flight are ignored (aria-disabled). A hidden status announces \"Sent\".",
  "interaction": "Click, tap, Space or Enter to send; it resets itself after about 2.4 seconds.",
  "animation": "Launch 650ms; label reel 380ms; return glide 520ms; colour change 300ms.",
  "a11y": "A real button with a visible label; aria-disabled while sending and a role=\"status\" announcement. Reduced motion swaps states without flight.",
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
