import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glow-base-pricing",
  name: "Glow Base Pricing",
  category: "pricing",
  description: "A three-plan pricing section on black where each card's base glows in its own colour, so its button sits in a pool of light, with rims tinted to match and a monthly/yearly switch that rolls the prices.",
  tags: ["pricing", "plans", "tiers", "toggle", "switch", "glow", "gradient", "dark", "saas"],
  traits: ["click", "hover"],
  source: "original",
  files: ["GlowBasePricing.tsx", "prices.ts", "glow-base-pricing.css"],
  dependencies: [],
  prompt: `Build a three-plan pricing section on pure black (React + CSS, no libraries) where each card glows from its base in its own colour.

Header, centred: a wide eyebrow "PRICING" (Archivo at width 112, 400, 2.1em), a 1.13em subtitle, a two-line grey intro (max 30em) and a billing row: "Monthly", a switch (role switch; outlined pill 2.75em × 1.55em with a white knob that slides with a slight overshoot and a dark fill when on), "Yearly" and a small pink "Save 20%" chip. The active word is white, the other grey. Yearly takes 20% off and the prices roll in from above; a polite live line says which prices are shown.

Cards: three columns of up to 18.6em with a 0.95em gap (one column of 22em under 900px), min-height 32em, radius 1.4em, #050505, a 1px border mixed 45% from the card's colour into near-black. The base glow is two radials anchored at the bottom centre: a hot core (68% × 25%, the colour lifted 12% toward white, fading by 45%) over a wider wash (95% × 40%), stretching 12% taller on hover. Content: the plan name (Archivo width 108, 500, 1.65em), a two-line description, the price (2.35em) with "/ mo", a list of five to seven features with green check marks (0.8em, 0.95em gap) and, pushed to the bottom and centred, a white rounded button sitting in the glow (it lifts and picks up a halo of the card colour on hover).

Default plans: Starter $19 (orange #ff6a1f), Pro $49 (magenta #d62ee0), Scale $129 (blue #1f7bff), all copy original. Reduced motion stops the roll and the transitions. Props: eyebrow, title, intro, plans [{id, name, blurb, monthly, features[], cta, glow}], currency, defaultYearly, onChoose(plan, yearly).`,
  interaction: "Flip the switch (click, Space or Enter) to show yearly prices; each plan's button reports its plan and billing. Hovering a card stretches its glow.",
  animation: "Knob slides in 0.28s with overshoot; prices roll in over 0.4s; glows stretch over 0.6s on hover; buttons lift 1px.",
  a11y: "A labelled section with a real heading; billing is a native button with role switch and aria-checked, announced politely; each plan is an article with a heading and a native button. Text sits in the dark upper part of each card, above 12:1. Reduced motion stops the roll and transitions.",
  responsive: "Three columns down to 900px, then a single column of up to 22em; the header stays centred.",
  touchFallback: "Tap the switch and buttons; the glow simply stays at rest without hover.",
  isNew: true,
  variants: [
    { id: "sunset", label: "Sunset", prompt: "Glows #ff6a1f (orange), #d62ee0 (magenta) and #1f7bff (blue), left to right." },
    { id: "aurora", label: "Aurora", prompt: "Glows #19c37d (green), #14b8c9 (cyan) and #7a4dff (violet), left to right." },
    { id: "mono", label: "Mono", prompt: "Glows #9a9aa3, #c9c9d1 and #ececf1: three greys rising in brightness." },
  ],
  preview: { bg: "#000000", mode: "page", height: 780 },
};
