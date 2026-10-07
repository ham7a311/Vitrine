import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "missing-glyph-404",
  "name": "Missing Glyph 404",
  "category": "feedback",
  "description": "A typographic dead end: an empty aperture between two giant fours, interrupted by a registration line, with clear links back to familiar places.",
  "tags": [
    "feedback",
    "404",
    "recovery",
    "page"
  ],
  "traits": [
    "keyboard",
    "cursor"
  ],
  "source": "original",
  "files": [
    "MissingGlyph404.tsx",
    "missing-glyph-404.css"
  ],
  "dependencies": [],
  "prompt": "Build a typography-led missing-page composition on pale mineral paper (#e9e7df), with deep green ink. A small mono header reads LOST & FOUND and ERROR \u2014 404. Across the centre, two huge flat Geist fours bracket an empty oval aperture with a second inset outline and tiny ABSENT annotation. One hairline registration rule crosses the whole numeral. A green radial highlight inside the fours follows a fine mouse pointer, returning to the middle on leave. Below, arrange a small status, a medium-weight heading and muted description beside a ruled recovery-link index; the primary home link comes first. Use ordinary anchors and configurable content, not router imports. Keep the numeral decorative, the heading semantic and the recovery navigation labelled. On a phone, scale the numeral without clipping and stack copy above links. Touch and reduced motion keep the highlight fixed. Do not add depth, a game, or animated letters.",
  "interaction": "In Vitrine and the usage example, activating a recovery link is simulated locally and never changes page. In a consumer application, caller-supplied anchors remain usable. Follow a fine pointer with the numeral highlight; use normal recovery links.",
  "animation": "Pointer sets a CSS gradient position without a frame loop. Reduced motion holds it centrally.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#e9e7df",
    "mode": "page",
    "frame": [
      1280,
      800
    ]
  },
};
