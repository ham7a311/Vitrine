import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "wayfinder-404",
  "name": "Wayfinder 404",
  "category": "feedback",
  "description": "A missing location and a working compass: choose a familiar destination, watch the needle turn, and take the direct link there.",
  "tags": [
    "feedback",
    "404",
    "recovery",
    "page"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "Wayfinder404.tsx",
    "wayfinder-404.css"
  ],
  "dependencies": [],
  "prompt": "Build a useful interactive 404 as a destination-finding instrument on deep blue-green (#111e25). Set a large serif heading and concise recovery copy on the left, with an always-available home anchor. On the right draw a round compass in CSS: thin concentric rim, evenly spaced ticks, N/E/S/W labels, a pale mint needle and a central 404 / NO FIX badge. Under it, a radio group contains Home and caller-supplied destination labels. Selection rotates the needle by an equal fraction of a turn per destination, highlights its button and updates a separate Go to [destination] anchor plus a polite direction-set status. Support arrow keys and Home/End with roving focus. No drag puzzle, automatic navigation or global shortcuts. On small screens stack copy and dial, retaining direct destination controls. Reduced motion changes the angle immediately. Use normal anchors, unique IDs and independent state per instance.",
  "interaction": "In Vitrine and the usage example, activating a recovery link is simulated locally and never changes page. In a consumer application, caller-supplied anchors remain usable. Choose a destination by click or arrow/Home/End keys, then activate its link. Home is always available.",
  "animation": "Needle rotates over 550ms expo-out; reduced motion updates immediately.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#111e25",
    "mode": "page",
    "frame": [
      1280,
      800
    ]
  },
  "isNew": true
};
