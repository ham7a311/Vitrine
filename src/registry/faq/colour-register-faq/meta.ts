import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "colour-register-faq",
  "name": "Colour Register FAQ",
  "category": "faq",
  "description": "Every question keeps its own colour: a small register becomes the open answer surface, so the FAQ reads like a carefully filed set.",
  "tags": [
    "faq",
    "keyboard",
    "original",
    "pastel"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "ColourRegisterFaq.tsx",
    "colour-register-faq.css"
  ],
  "dependencies": [],
  "prompt": "Build a colour-indexed accordion on pale paper. Each stable-ID question owns one of five preset treatments: mint, lilac, blue, peach or butter. Closed, the row has a small vertical colour register beside a mono number, a medium-weight Geist question and a plus icon. Open, that same colour fills the entire row and answer surface, the register shortens and the plus becomes a minus. One answer may be open; activating it again closes all. Reveal content using a 0fr to 1fr grid transition over 320ms, without measuring content height. Accept arbitrary React-node answers, including links and long paragraphs. Link each heading button to its answer region with unique per-instance IDs; closed regions must be inert, aria-hidden and visually hidden. Arrow Up/Down and Home/End move among question buttons; Enter/Space activate normally. On a phone reduce padding while preserving number, wrapped question and icon alignment. Reduced motion changes all states immediately. Identity colour never substitutes for expanded state or a visible focus ring.",
  "interaction": "Open one answer or close all. Arrow Up/Down and Home/End move focus without changing the open answer.",
  "animation": "320ms grid-row expansion, colour fill and plus rotation; reduced motion is immediate.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#f3f1e9",
    "mode": "fill"
  },
  "isNew": true
};
