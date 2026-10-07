import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "product-atelier",
  "name": "Product Atelier",
  "category": "sections",
  "description": "A complete product configuration spread with finish, size, availability and purchase feedback.",
  "tags": [
    "sections",
    "responsive",
    "original"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "ProductAtelier.tsx",
    "product-atelier.css"
  ],
  "dependencies": [],
  "prompt": "Build a two-column product atelier. An original adjustable desk-lamp SVG occupies a tinted plinth on the left; the right has maker in mono, large serif title, restrained description, ruled option groups and a purchase summary. Use native labelled radios for finish and height. Explicit variant records supply imagery, integer minor-unit prices and availability: choosing either dimension updates the image, price and availability together. Unsupported combinations explain why the purchase action is disabled. Call onAdd with the selected variant ID; pending prevents duplicate purchase, success appears only on resolution, rejected calls expose an error and allow retry. No animated product spin. Stack the image above the choices below 700px. Reduced motion keeps all state changes immediate.",
  "interaction": "Choose finish and height, then add the available variant to the basket.",
  "animation": "User-triggered transitions only, 180\u2013240ms. Reduced motion removes transitions.",
  "a11y": "Native radio fieldsets with legends; labelled product image, availability live text, pending disabled actions and announced recoverable errors.",
  "responsive": "Fluid layout at 320px and above. Columns stack on narrow containers; text wraps without clipping.",
  "touchFallback": "All actions use direct tap targets of at least 44px; no hover-only information.",
  "preview": {
    "bg": "#f5f3ee",
    "mode": "fill",
    "frame": [
      1100,
      760
    ]
  },
  "variants": [
    {
      "id": "light",
      "label": "Light surface",
      "prompt": "Use surface=\"light\": warm off-white ground, ink text, deep green accents, hairline grey-green rules and restrained contact shadows. Preserve the specified geometry and behaviour."
    },
    {
      "id": "dark",
      "label": "Dark surface",
      "prompt": "Use surface=\"dark\": forest-black ground, raised deep green panels, warm near-white text, pale sage accents and clearer edge rules rather than large pale shadows. Preserve the specified geometry and behaviour."
    }
  ]
};
