import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stack-pricing",
  name: "Stack Pricing",
  category: "pricing",
  description: "Build your plan and watch it stack up. The base plan is the foundation; every add-on you switch on drops onto the pile as a block whose height is its share of the price, landing with a little give. Switch one off and it slides out while the blocks above settle into the gap.",
  tags: ["pricing", "add-ons", "configurator", "plan builder", "stack", "switches", "billing"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["StackPricing.tsx", "stack-pricing.css"],
  dependencies: [],
  prompt: `Build an add-on pricing configurator with a physical stack that shows what you're paying for.

Props: base ({ name, note, price }), addons ({ id, name, note, price }), initial ids, yearlyOff (e.g. 0.2), currency.

Left: "Build your plan", a Monthly / Yearly radiogroup (yearly shows the discount), the base plan as a fixed row, and each add-on as a row — a colour key, name and note, its price, and a native checkbox styled as a switch (role=switch, labelled with the name and price). Add-on colours are categorical slots 1–5 in fixed order (blue, orange, aqua, yellow, magenta), stepped for Night; the key dims when an add-on is off.

Right: the total in large tabular figures, easing to its new value over 420ms (ease-out cubic), with "/ month" and either "Billed yearly · you save OMR …" or the yearly figure. Below it, the stack: the base block at the bottom (solid ink) and one block per active add-on in the order they were switched on. Each block's height is its price × 7.2px (× the discount when yearly) with 3px between blocks, and it is a tint of its colour (24% into the surface, 30% on Night) with a 5px solid stripe on its left. Labels stay in ink and muted text, never the series colour. Switching an add-on on drops its block from 9rem above, through clear space the pile keeps above the stack and clips: an ease-in fall, a 0.82 vertical squash on landing, then an overshoot settle (620ms). Switching one off slides its block out to the right with a slight tilt and fade (260ms) before removing it, and the blocks above slide down into the gap (bottom 520ms with overshoot). Yearly resizes every block (height 420ms). A CTA counts the pieces. Under 720px the two halves stack. Paper and Night; reduced motion removes every animation.`,
  interaction: "Switch add-ons on and off to drop and remove blocks; toggle Monthly and Yearly to resize the stack.",
  animation: "Drop 620ms (fall, squash, settle); remove 260ms slide-out; settle 520ms overshoot; yearly resize 420ms; total eases over 420ms.",
  a11y: "Add-ons are native checkboxes with role=switch and a label that includes the price; billing is a radiogroup; the total is a polite live region; the stack is decorative and aria-hidden. Reduced motion shows changes at once.",
  responsive: "Two columns from 720px; one column below, with the stack under the list.",
  touchFallback: "Whole rows are labels, so the switch can be toggled from anywhere on the row.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --stk-base #1b1a17; --stk-card #fffdf8; --stk-focus #2a78d6; --stk-ink #1b1a17; --stk-line rgb(27 26 23 / 0.1); --stk-muted #6f6a62; --stk-s0 #2a78d6; --stk-s1 #eb6834; --stk-s2 #1baf7a; --stk-s3 #eda100; --stk-s4 #e87ba4; --stk-tint 24%. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --stk-base #efe8dc; --stk-card #1a1a19; --stk-focus #8fb8ff; --stk-ink #ffffff; --stk-line rgb(255 255 255 / 0.1); --stk-muted #c3c2b7; --stk-s0 #3987e5; --stk-s1 #d95926; --stk-s2 #199e70; --stk-s3 #c98500; --stk-s4 #d55181; --stk-tint 30%. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece8e0", mode: "fill" },
};
