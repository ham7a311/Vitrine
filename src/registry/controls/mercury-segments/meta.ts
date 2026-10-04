import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "mercury-segments",
  "name": "Mercury Segments",
  "category": "controls",
  "description": "A segmented control whose thumb behaves like a bead of mercury: it stretches toward the new option, sheds droplets that trail behind, and they merge back as it settles.",
  "tags": [
    "navigation",
    "segmented-control",
    "gooey",
    "liquid",
    "tabs"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "MercurySegments.tsx",
    "mercury-segments.css"
  ],
  "dependencies": [],
  "prompt": "Build a pill segmented control (radiogroup) whose selected thumb is liquid metal. Render the thumb as three absolutely positioned pills inside a layer filtered by an SVG goo filter (feGaussianBlur 6 \u2192 feColorMatrix alpha row '0 0 0 22 -9' \u2192 feComposite atop source): a full-size body plus two smaller droplets centred inside it. All three are positioned by left/right from two CSS variables (--ms-l, --ms-w) measured from the active button.\n\nWhen the value changes, the body's leading edge moves first and its trailing edge follows 110ms later (swap the delays by direction), over 460ms on cubic-bezier(0.16,1,0.3,1), so it stretches toward the new option. The droplets use longer durations (700ms, 900ms) and small delays, so they lag behind, pinch off from the body through the goo threshold, and merge back as they arrive \u2014 like a bead of mercury. Fill everything with a vertical white \u2192 tint \u2192 dark tint gradient (tint prop), and add a crisp 38%-height specular strip over the settled bead outside the filter so the text stays sharp. Labels sit above in Hanken 15px; the active one turns near-black and 600.\n\nKeyboard: roving tabindex, \u2190/\u2192/Home/End select and focus.",
  "interaction": "Click or tap an option; \u2190/\u2192/Home/End move the selection.",
  "animation": "Staggered left/right transitions (460ms body, 700/900ms droplets) through an SVG goo filter; specular strip follows at 120ms delay.",
  "a11y": "role=radiogroup with role=radio buttons, aria-checked and roving tabindex; the liquid layer is aria-hidden. Reduced motion snaps the thumb.",
  "responsive": "Re-measures with a ResizeObserver; works with any number of options and label lengths.",
  "promptAllow": ["mercury"],
  "variants": [
    {
      "id": "mercury",
      "label": "Mercury",
      "prompt": "tint=\"#c9d3de\" (silver mercury); a four-option Range control \u2014 Day, Week, Month, Year \u2014 with a \"showing \u00b7 last week\" line below."
    },
    {
      "id": "gold",
      "label": "Gold",
      "prompt": "tint=\"#e8c07a\" (liquid gold); the same Day/Week/Month/Year control."
    },
    {
      "id": "rose",
      "label": "Rose",
      "prompt": "tint=\"#e9b3b0\" (a pink metal); the same Day/Week/Month/Year control."
    },
    {
      "id": "billing",
      "label": "Billing toggle",
      "prompt": "A two-option Billing control \u2014 \"Monthly\" / \"Yearly \u00b7 save 20%\" \u2014 in tint #e8c07a, as used on a pricing page."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "Taps select directly; the tap highlight is suppressed."
};
