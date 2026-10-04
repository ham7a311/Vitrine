import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "intent-label",
  name: "Intent Label",
  category: "cursors",
  description: "The cursor says what a click will do. Over anything marked data-intent it grows from a dot into a pill — View case study, Play reel · 0:42, Drag, Copy email — whose width springs to each new label. Dragging nudges its arrows; a playing reel draws progress along its edge.",
  tags: ["cursor", "pointer", "label", "portfolio", "hover", "contextual cursor", "pill", "spring"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["IntentLabel.tsx", "intent-label.css"],
  dependencies: [],
  prompt: `Build a scoped contextual cursor: a wrapper component that reads data attributes on its descendants and turns the pointer into a pill naming the action under it.

Markup contract: data-intent="Label", data-intent-icon (view | play | pause | drag | external | copy | check), optional data-intent-progress (0–1) and data-intent-drag (the element is dragged sideways).

Scope: under (hover: hover) and (pointer: fine) the host gets data-live → cursor:none on it and every descendant (!important), fields excepted, where the drawn cursor fades out. The layer is aria-hidden, pointer-events:none, absolute over the children; coordinates are host-local and corrected by rect.width / offsetWidth for scaled hosts.

The cursor is one element, centred on the pointer, its position written in the pointermove handler. With no intent it is a 10px dot (8px pressed) with a hairline ring. Over an intent it becomes a 40px-tall pill: the label and its 15px icon are written into the idle one of two absolutely-centred slots and cross-faded (opacity, blur 5px → 0, scale 0.9 → 1 with a slight overshoot, 40ms delay in), while a hidden measuring span with the same font gives the new width + 30px. Width and height are springs (k 340, ζ 0.78), so moving from "Drag" to "View case study" visibly stretches the pill. The pill leans up to 7° into horizontal speed and rights itself. One rAF loop runs only while something is moving.

States: pressing a data-intent-drag element spreads the drag arrows (scaleX 1.22) and nudges them 3px toward the direction you're pulling, until release. data-intent-progress drives a 2px bar along the pill's bottom edge (scaleX). A MutationObserver on data-intent, -icon and -progress updates the pill live while you hover, so a reel can count down ("Play reel · 0:42" → "Pause · 0:17") and a copy button can confirm ("Copied" with a check). Keyboard: a :focus-visible element with data-intent shows the pill at its lower-right corner, so the action is never pointer-only. Night (cream pill) and Paper (ink pill).`,
  interaction: "Move across the case studies, the reel, the press strip and the links. Click the reel to play it, drag the strip, copy the email.",
  animation: "Width/height springs (k 340, ζ 0.78); label cross-fade with blur 200–280ms; lean into horizontal speed; drag arrows 200ms.",
  a11y: "Every target is a real link, button or focusable region with its own accessible name; the pill only repeats it visually and is aria-hidden. Keyboard focus shows the same label beside the element. Status changes are announced by the page's own live region. Reduced motion removes the blur, overshoot and lean; widths change at once.",
  responsive: "The grid stacks under 640px; the pill is host-scoped and works in scaled previews.",
  touchFallback: "Touch shows no pill and keeps native behaviour: the strip scrolls natively and every target is a normal tap.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0e0e0c", mode: "fill" },
};
