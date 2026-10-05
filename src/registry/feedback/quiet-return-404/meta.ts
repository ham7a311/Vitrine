import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "quiet-return-404",
  "name": "Quiet Return 404",
  "category": "feedback",
  "description": "A useful pause: a small status, a plain explanation, and one unmistakable way home. Nothing asks for attention twice.",
  "tags": [
    "feedback",
    "404",
    "recovery",
    "page"
  ],
  "traits": [
    "keyboard"
  ],
  "source": "original",
  "files": [
    "QuietReturn404.tsx",
    "quiet-return-404.css"
  ],
  "dependencies": [],
  "prompt": "Build an extremely restrained 404 on off-white (#f5f5f0), using dark olive Geist typography. Centre a narrow content column within generous space. Start with a tiny dot and mono 404 / NOT FOUND status; follow with a medium-weight, tightly spaced heading and a short description at comfortable line height. Provide a small dark home anchor with a northeast arrow and optional secondary destination links beneath it. A discreet bottom annotation reads A SMALL DETOUR. Keep every action a real anchor with an independent visible focus outline. No illustration, loading state, ambient motion or artificial delay. On narrow screens keep the same hierarchy, allow text to wrap naturally, and provide enough padding for short viewports. Reduced motion uses the identical static composition. Expose title, description, home link, destinations and className, without importing a framework router.",
  "interaction": "In Vitrine and the usage example, activating a recovery link is simulated locally and never changes page. In a consumer application, caller-supplied anchors remain usable. Use a primary home anchor or optional secondary destinations.",
  "animation": "No animation or transition.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#f5f5f0",
    "mode": "page",
    "frame": [
      1280,
      800
    ]
  },
  "isNew": true
};
