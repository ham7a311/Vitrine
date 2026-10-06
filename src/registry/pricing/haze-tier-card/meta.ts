import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "haze-tier-card",
  name: "Haze Tier Card",
  category: "pricing",
  description: "One pricing tier in a dark card whose edges glow with a soft, smoky haze that drifts and leans toward the pointer, with a bright top-edge highlight, info tooltips and a gradient button.",
  tags: ["pricing", "card", "plan", "tier", "glow", "haze", "tooltip", "dark", "saas"],
  traits: ["cursor", "ambient"],
  source: "original",
  files: ["HazeTierCard.tsx", "tier.ts", "haze-tier-card.css"],
  dependencies: [],
  prompt: `Build a single pricing-tier card (React + CSS, no libraries): a dark card about 400px wide whose edges glow with a soft, smoky haze, leaving the middle dark for the content.

Shell: 16px radius, background #050507, a 1px ring of the highlight colour at 22% and a soft drop glow underneath. Haze layer (behind the content, clipped to the radius): seven blurred radial puffs of the glow colour hugging the edges (a big one over the top-left corner, one along the rest of the top, tall ones down the left and right sides, one along the bottom and one in the bottom-right corner), each blurred 18px and drifting on its own 16–23s alternate loop (±3% translate, 0.96–1.06 scale). Over them, a rounded rectangle of the card colour inset 9% and blurred 22px punches a dark hole, so the light only lives along the border and reads as patchy mist. Edge layer: an inset 1px ring, an inset 24px glow, a 1px highlight line along the top from 8% to 70% with a soft bloom, and a shorter highlight into the bottom-right corner. A fine pointer leans the whole haze up to 9px toward it, eased over 0.9s.

Content, centred: the tier name (1.8rem, 400, pale grey-violet), the price as a raised currency sign (1.8rem), a big amount (3.6rem, 500, tight tracking, tabular figures, cents set smaller) and "/mo" on the baseline, then a muted line "Billed yearly or $24 billed monthly". Then a left-aligned list of features with 0.75rem gaps: each has a filled grey check circle (15px) and the label; some end in a small outline "i" button. Hovering, focusing or clicking it shows a dark tooltip above it (role="tooltip", linked with aria-describedby while open), and Escape closes it. Last, a full-width 2.4rem button with a 100° gradient between two accent tones, a 1px inner top highlight and 4px radius; on hover it lifts 1px, brightens and casts a coloured glow.

Copy is yours: a tier called Studio at $18/mo, eleven features. Reduced motion stops the drift and transitions. Props: name, price, monthly, currency, features [{label, info?}], cta, href, tone {glow, hi, from, to, ink}.`,
  interaction: "Hover, focus or tap an info button to read its tooltip; Escape or moving away closes it. A fine pointer pulls the edge haze toward it. The button lifts and glows on hover.",
  animation: "Haze puffs drift on 16–23s alternate loops; the pointer lean eases over 0.9s; tooltips fade and rise 4px in 0.16–0.2s; the button lifts 1px in 0.25s.",
  a11y: "An article labelled with the plan name and a real heading. Info buttons are labelled 'About …', expose aria-expanded and point at their tooltip with aria-describedby while it is open; Escape closes it. Text contrast on the dark middle is above 7:1 for the list and price. Reduced motion stops the drift.",
  responsive: "Fills up to 25rem; under 420px the padding and list text tighten so long labels still fit on one or two lines.",
  touchFallback: "Tap an info button to open its tooltip and tap elsewhere to close it; the haze drifts on its own without the pointer lean.",
  isNew: true,
  variants: [
    { id: "lavender", label: "Lavender", prompt: "Tone {glow #7a6fc4, hi #c3b8f5, button #957cf0 → #6b4fd6, ink #ece8fb}: lavender haze with a violet button." },
    { id: "ember", label: "Ember", prompt: "Tone {glow #c46a3a, hi #ffc9a3, button #f08a4c → #d4532a, ink #fff1e8}: warm ember haze with an orange button." },
    { id: "teal", label: "Teal", prompt: "Tone {glow #2f9b95, hi #a6efe6, button #35c2b0 → #1f8f8a, ink #eafffb}: cool teal haze with a sea-green button." },
    { id: "rose", label: "Rose", prompt: "Tone {glow #b85a86, hi #ffbfdc, button #ec6fa6 → #c3417f, ink #fff0f7}: rose haze with a pink button." },
  ],
  preview: { bg: "#08080a", mode: "center", height: 780 },
};
