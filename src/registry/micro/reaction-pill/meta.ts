import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "reaction-pill",
  name: "Reaction Pill",
  category: "micro",
  description: "A reaction button that opens a pill of six coloured reactions. The discs swell like a dock as you move along them, each names itself, and picking one pops it into the button while the count beside it updates — all optimistic, and put back if saving fails.",
  tags: ["reactions", "like", "emoji", "social", "picker", "dock", "micro-interaction", "feedback"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["ReactionPill.tsx", "reaction-pill.css", "reactions.ts"],
  dependencies: [],
  prompt:
    "Build a reaction picker. Props: reactions [{id, label, color, icon}] (default six: Like blue, Cheer green, Support violet, Love red, Insight amber, Laugh teal, each a white line icon), counts, value (the viewer's reaction), onChange (a promise) and theme.\n\nA 54px rounded-square trigger shows the first reaction's icon in a muted colour, or the viewer's reaction in its colour; beside it, up to three overlapping 22px discs of the most used reactions and the total. Clicking the trigger toggles the first reaction. Pointing at it for 380ms, a long press on touch (420ms, without the context menu) or ↑ on the keyboard opens the pill above it: a dark capsule with 52px discs (each a radial gradient of its colour with a white icon) that springs open from the trigger's corner and pops its discs in with a 30ms stagger.\n\nWhile the pointer moves along the pill, each disc scales by 1 + 0.42 × a Gaussian of its distance from the pointer (64px reach), growing from its base and lifting, like a dock; a dark label pill appears above the disc under the pointer or focus. The viewer's current reaction has a small dot under it.\n\nPicking a reaction (or picking the current one again to remove it) closes the pill, pops the new icon into the trigger with a slight overshoot and rotation, and updates the counts at once: the old reaction loses one and the new one gains one. onChange runs afterwards; if it rejects, the reaction and counts go back and a status line says so.\n\nThe pill is a menu of menuitemradio buttons with arrow-key navigation, Home and End, and Escape (which returns focus to the trigger); the trigger has aria-haspopup, aria-expanded and aria-keyshortcuts. Leaving the pill closes it after 260ms. Reduced motion keeps only fades.",
  interaction: "Click the button to like; point at it, long-press, or press ↑ to open the reactions; move along them and pick one. Arrow keys move between reactions, Escape closes.",
  animation: "Pill springs open over 360ms with discs popping in 30ms apart; discs magnify instantly with the pointer; the chosen icon pops into the trigger over 420ms. Reduced motion: fades only.",
  a11y: "The trigger is a button with aria-haspopup, aria-expanded and aria-keyshortcuts; reactions are menuitemradio buttons with labels and aria-checked; changes and rollbacks are announced in a status line.",
  responsive: "Fixed-size control; the pill opens upward from the trigger and needs about 80px above it.",
  touchFallback: "Tap to like; long-press the button to open the reactions, then tap one.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rpill-btn #1c1c1e; --rpill-edge rgba(255, 255, 255, 0.08); --rpill-ink #f2f2f0; --rpill-muted #a5a5a0; --rpill-pill #1a1a1b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rpill-btn #ffffff; --rpill-edge rgba(20, 20, 18, 0.1); --rpill-ink #151513; --rpill-muted #5c5a54; --rpill-pill #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 480 },
};
