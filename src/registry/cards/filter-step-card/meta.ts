import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "filter-step-card",
  name: "Filter Step Card",
  category: "cards",
  description: "A numbered feature card that shows the feature working: stacked dark sheets hold a real filter panel with place, price and date tabs and a live match count, over a field of drifting characters lit by a warm glow behind the step number.",
  tags: ["card", "feature", "step", "filter", "tabs", "form", "glow", "dark", "onboarding"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["FilterStepCard.tsx", "filter.ts", "filter-step-card.css"],
  dependencies: [],
  prompt: `Build a numbered feature card that demonstrates its feature with a working mini UI (React + CSS, no libraries).

Card: 40em × 44em (16px base), radius 2em, clipped. Background near-black at the top warming toward a dark tint of the glow colour at the bottom; a hairline rim tinted with the glow, brighter along the top edge.

Upper half, a stack of sheets: a faint outlined back sheet (inset 1em, 25.6em tall, fading out at its foot) and a front sheet (inset 3.3em each side, 23.7em tall, #1a1817 → #0f0d0d, hairline, deep shadow) holding the panel:
- a three-tab segmented control (Place, Price, Date) in a hairline tray; each tab has a grey icon (pin, coin, calendar), its label and a small square count badge in the badge colour showing how many constraints that tab applies (dimmed at 0). Tabs follow the ARIA tabs pattern: arrows and Home/End move, roving tabindex.
- the active panel: Price shows "From" and "To" money fields ($0 / $720; an empty field means open-ended), Place a distance slider, Date seven day toggles.
- a wide frosted action bar: an ✕ that clears every filter and "See 156 matching events", where the number is counted live from a small seeded list of events (a polite live region announces it).

Lower half: a dashed 1.5px rule across the card at 65% with a frosted step pill ("04") on it; behind it a warm glow (a white-hot core, a glow-colour ellipse and a broad wash, breathing). Behind everything, rows of random alphanumeric strings in a dim glow colour, staggered every other row and masked to fade from the glow, with a few characters re-rolling every 160ms. Under the rule, a centred title (2.5em, 500, tracking −0.04em) whose first word is dimmed, and a 1.38em description with a few words set brighter. Reduced motion stops the re-rolling and the breathing. Props: step, title, children (description), tone {glow, badge, page}, onApply(filters, count).`,
  interaction: "Switch tabs by click or arrow keys; type prices, drag the distance or toggle days and the match count updates; ✕ clears every filter; the action reports the filters and count.",
  animation: "Glyphs re-roll a few characters every 160ms; the glow breathes over 6s; tab and badge states ease over 0.2s.",
  a11y: "Tabs use tablist, tab and tabpanel with roving focus; fields have labels; day toggles use aria-pressed; the clear button is labelled; the match count is announced politely; the title carries the step number for screen readers. The glyph field and glow are aria-hidden. Reduced motion stops all loops.",
  responsive: "40em wide, shrinking to its container; under 520px the type steps down and the sheet insets tighten so the fields still fit side by side.",
  touchFallback: "Every control is a normal tap target; the glyph field drifts on its own.",
  isNew: true,
  variants: [
    { id: "copper", label: "Copper", prompt: "Glow #e07a3f with #ff8a4c badges on a #070b14 navy page." },
    { id: "teal", label: "Teal", prompt: "Glow #22b8a6 with #3fe0cb badges on a #04100f page." },
    { id: "violet", label: "Violet", prompt: "Glow #8a5cff with #b49bff badges on a #0a0816 page." },
  ],
  preview: { bg: "#070b14", mode: "center", height: 800 },
};
