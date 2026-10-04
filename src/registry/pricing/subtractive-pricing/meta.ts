import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "subtractive-pricing",
  "name": "Subtractive Pricing",
  "category": "pricing",
  "description": "Pricing as one feature list instead of three cards: step down a tier and the features you'd lose are struck through, one by one; step up and they come back.",
  "tags": [
    "pricing",
    "saas",
    "plans",
    "comparison",
    "strike-through",
    "section"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "SubtractivePricing.tsx",
    "subtractive-pricing.css"
  ],
  "dependencies": [],
  "prompt": "Replace the usual three pricing cards with a single feature list. On the left, a vertical plan ladder (radiogroup) from most generous to least \u2014 Studio, Team, Solo, Free \u2014 each row with an Instrument Serif name, a one-line blurb and a mono price; the selected row gets a faint fill and a 2px accent bar that grows from its centre.\n\nOn the right, one sheet: a large serif price whose digits roll like reels (each digit is a 0\u20139 column translated by \u2212digit\u00d710%, 700ms expo-out), '/ month', and a mono tally ('11 of 14 included \u00b7 3 left out', aria-live). Below, the full top-tier feature list in groups (Build / Collaborate / Operate) in two columns. Every feature knows the lowest plan that includes it.\n\nPlans are expressed by what is struck out: an excluded line is faint with a drawn 1px strike (a pseudo-element scaled on X) and a dash mark; an included line is bone with an accent tick that draws in. Changing plan animates only the lines that differ, staggered 45ms \u2014 losing features strikes them top-down (strike grows from the left); regaining unstrikes them bottom-up (strike retracts to the right), the tick redraws and the label glows accent once. \u2191/\u2193/Home/End move the plan. Stacks to one column below 44rem.",
  "interaction": "Pick a plan (click or \u2191/\u2193); only the features that change animate \u2014 struck when lost, restored when gained.",
  "animation": "45ms-staggered strike (420ms scaleX) and tick draw (380ms dash), directional per change; 700ms rolling price digits; one-shot accent glow on regained lines.",
  "a11y": "Plans are a radiogroup with roving tabindex; each feature has hidden 'included / not included' text; the tally and price are announced. Reduced motion changes state instantly.",
  "responsive": "A container query stacks the ladder above the sheet and the list into one column below 44rem.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent #b9cce4 (frost blue) for the plan bar, ticks and glow."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent #e8a24a (amber) for the plan bar, ticks and glow."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Plans are large tap targets; everything else is static reading."
};
