import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "bell-ring",
  "name": "Bell Ring",
  "category": "micro",
  "description": "A notification bell that swings from its hook and dies down, the clapper a beat behind, while the badge pops up a number.",
  "tags": [
    "notification",
    "bell",
    "badge",
    "icon",
    "alert",
    "button",
    "ring",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "BellRing.tsx",
    "bell-ring.css"
  ],
  "dependencies": [],
  "prompt": "Build a notification bell icon button with an unread badge, where a new notification rings it like a real bell. The bell swings from its hook (transform-origin at the top of the dome): +24°, −20°, +14°, −9°, +5°, −2°, 0 over 1.1s; the clapper (the little arc under the bell) swings the opposite way, 60ms behind, with smaller amplitude, so it reads as a pendulum inside a pendulum. Two identical keyframes alternate on each new notification so it replays without remounting. The badge (red, ring in the page colour, tabular count, \"9+\" cap) pops in springily (scale 0.2 → 1.25 → 1) whenever the count changes. Opening the bell clears the count and the badge scales away. The ring only plays when the count goes up.",
  "interaction": "New notifications ring the bell; click to open and clear the badge. The demo has a button to simulate one.",
  "animation": "Swing 1.1s with decaying amplitude; clapper 60ms behind; badge pop 460ms.",
  "a11y": "The button's label includes the unread count (\"Notifications, 3 unread\"). Reduced motion keeps the bell still and the badge static.",
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
