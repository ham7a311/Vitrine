import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "errata-404",
  "name": "Errata 404",
  "category": "feedback",
  "description": "A correction sheet for a missing page: an interrupted column, editorial annotation, and a neatly numbered route back.",
  "tags": [
    "feedback",
    "404",
    "recovery",
    "page"
  ],
  "traits": [
    "hover",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "Errata404.tsx",
    "errata-404.css"
  ],
  "dependencies": [],
  "prompt": "Build a 404 like an editorial correction sheet on warm paper (#f1eadb) with brown ink. A mono ruled masthead identifies THE CORRECTION SHEET and No. 404. Beneath it, a narrow margin holds ERRATA, a small annotation and a bent arrow; the main column carries a large Instrument Serif headline. Supporting copy shares a row with an interrupted text column represented by fine rules and a TEXT OMITTED annotation. A numbered index of ordinary recovery anchors follows; hovering or focusing a link draws an underline from the left over 250ms. End with a quiet ruled colophon. This is a missing-page composition, not a document browser. Keep all text semantic, omit decorative marks from accessibility, and never require motion to navigate. On a phone move the margin note inline, remove the decorative empty column and keep the source reading order. Reduced motion makes link feedback instant.",
  "interaction": "In Vitrine and the usage example, activating a recovery link is simulated locally and never changes page. In a consumer application, caller-supplied anchors remain usable. Numbered recovery anchors underline on hover or keyboard focus.",
  "animation": "250ms underline scale; reduced motion removes the transition.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#f1eadb",
    "mode": "page",
    "frame": [
      1280,
      800
    ]
  },
};
