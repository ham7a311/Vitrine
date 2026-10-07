import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "credit-tier-pricing",
  name: "Credit Tier Pricing",
  category: "pricing",
  description: "A three-plan pricing section in black glass: a rating pill, a heavy two-line headline, a Month/Year switch with a sliding thumb, cards lit by dot-matrix glows with a colour-drenched middle plan, and a glowing dome of dots rising underneath.",
  tags: ["pricing", "plans", "tiers", "toggle", "billing", "credits", "dark", "glow", "dots", "saas"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["CreditTierPricing.tsx", "tiers.ts", "credit-tier-pricing.css"],
  dependencies: [],
  prompt: `Build a three-plan pricing section on pure black (React + CSS, no libraries), driven by one accent colour.

Header, centred: a pill badge (accent-tinted fill, accent hairline and glow, a star icon, "Rated 4.9 by 2,000 studios"); a two-line uppercase headline in Inter 800 (clamp 2.2–3.95em, line-height 0.92, tracking −0.035em) filled with a vertical white-to-pale-accent gradient; a Month/Year switch (dark pill with a hairline and faint accent glow; an accent-gradient thumb with an inner top highlight that slides between the halves with a little overshoot). The switch is a radiogroup: arrows flip, Home/End jump, roving tabindex; a polite live line says which billing is shown.

Cards (three columns of up to 21.2em, gap 1.75em, stacking under 960px): #050506, radius 0.95em, a white hairline at 13%. Each corner is lit by a dot matrix (7px grid of 1.1px dots) masked by a radial fade: the first card at its top-right with a soft white glow, the third at its top-left with a stronger white glow. The middle (featured) card is drenched in accent: a bright accent wash across the top 30%, a dark indigo body, accent rising again along the bottom, a dot matrix across its upper 70% and a pale accent rim with an outer glow; it is labelled "most popular" for screen readers.

Card content: plan name (1.25em, 700), a grey tagline, the price (2.6em, 700, tabular) + "/month", a "per 100 credits" line, a full-width white-gradient button "Get started for free" with a soft white glow, a list of ten features (the first three in a pale accent with accent check circles, the rest grey checks; some end in a small "i" button with a tooltip on hover, focus or tap, Escape closes) and "14 days free trial". Yearly billing takes 20% off and the price rolls in from above when it changes; per-100-credit costs recompute.

Under everything, a dome: an ellipse rising from below the bottom edge, white at its core through pale accent to accent, overlaid with a 7px dot grid and masked to fade out, breathing slowly. Reduced motion stops the dome and the roll. Props: badge, title [line1, line2], tiers [{id, name, tagline, monthly, credits, featured}], features [{label, info, accent}], trial, cta, currency, accent, defaultPeriod, onChoose(tier, period).`,
  interaction: "Switch between monthly and yearly billing by click or arrow keys; prices and per-credit costs update with a short roll. Info buttons open tooltips; Escape closes them. Each plan's button reports its plan and period.",
  animation: "Switch thumb slides in 0.38s with overshoot; prices roll in over 0.42s; the dome breathes over 7s; buttons lift 1px on hover.",
  a11y: "A labelled section with a real heading; the switch is a radiogroup with roving focus and a polite announcement; each plan is an article, the featured one labelled most popular; tooltips use role tooltip and aria-describedby while open. Grey copy on black stays above 6:1. Reduced motion stops the dome and the roll.",
  responsive: "Three columns down to 960px, then one column of up to 24em; the headline scales with the viewport and the type steps down under 420px.",
  touchFallback: "Tap the switch and info buttons; tooltips close on Escape or when focus leaves.",
  isNew: true,
  variants: [
    { id: "violet", label: "Violet", prompt: "Accent #7b4dff: a violet badge, switch, featured plan, checks and dome." },
    { id: "cyan", label: "Cyan", prompt: "Accent #1fb6ff: an electric blue badge, switch, featured plan, checks and dome." },
    { id: "ember", label: "Ember", prompt: "Accent #ff6a2b: a molten orange badge, switch, featured plan, checks and dome." },
  ],
  preview: { bg: "#000000", mode: "page", height: 1080 },
};
