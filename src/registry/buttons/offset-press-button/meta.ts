import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "offset-press-button",
  "name": "Offset Press Button",
  "category": "buttons",
  "description": "A primary action printed in two layers: a pastel capsule sits just off its ink backing, then presses into perfect alignment.",
  "tags": [
    "buttons",
    "keyboard",
    "original",
    "pastel"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "OffsetPressButton.tsx",
    "offset-press-button.css"
  ],
  "dependencies": [],
  "prompt": "Build a broad primary-action capsule as two flat printed layers. The native button is the dark ink backing; its inner face is pastel, with a thin ink outline and generous horizontal padding. At rest the face sits three pixels left and four pixels above the backing, leaving a crisp hard silhouette. Hover or visible keyboard focus separates it to four pixels left and six pixels up; an active press brings face and backing into alignment in 60ms, then releases over 180ms using an ease-out curve. Keep a minimum 52px face height and an outline-based focus ring outside the entire control, independent of the shadow. Disabled removes travel and lowers opacity. Forward native button attributes, children, onClick and explicit form type; default type is button. Support an optional full-width layout and no global shortcuts. Under reduced motion, remove transitions but retain immediate pressed, disabled and focus states. Keep the code self-contained with plain CSS.",
  "interaction": "Native click, keyboard activation, form semantics and disabled state; demo toggles a local saved value.",
  "animation": "180ms separation and release; 60ms press; reduced motion removes transitions.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#f1f0e9",
    "mode": "fill"
  },
  "variants": [
    {
      "id": "mint",
      "label": "Mint",
      "prompt": "Use accent=\"mint\" for the pastel face. Keep the same two-layer geometry and native button interaction on the pale demo surface."
    },
    {
      "id": "lilac",
      "label": "Lilac",
      "prompt": "Use accent=\"lilac\" for the pastel face. Keep the same two-layer geometry and native button interaction on the pale demo surface."
    },
    {
      "id": "butter",
      "label": "Butter",
      "prompt": "Use accent=\"butter\" for the pastel face. Keep the same two-layer geometry and native button interaction on the pale demo surface."
    }
  ]
};
