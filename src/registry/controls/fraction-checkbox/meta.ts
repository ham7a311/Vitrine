import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "fraction-checkbox",
  "name": "Fraction Checkbox",
  "category": "controls",
  "description": "A select-all checkbox that tells the truth about partial states: its box fills in proportion to how many items are checked, and the count rolls beside it.",
  "tags": [
    "checkbox",
    "select-all",
    "tri-state",
    "list",
    "form",
    "control"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "FractionCheckbox.tsx",
    "fraction-checkbox.css"
  ],
  "dependencies": [],
  "prompt": "Design a 'select all' checkbox that shows how partial the selection is. It's a real tri-state control (checked when all are, indeterminate when some are), but its 20px box is a tiny gauge: an accent fill rises from the bottom to exactly the fraction of children checked (520ms expo-out), with a faint meniscus line at the level; only at 100% does the ring turn accent and a tick draw in. Beside it: the group title and a mono count ('2 of 5') whose number rolls in on change.\n\nChildren are ordinary checkboxes (hidden native input + drawn box): the box fills with the accent and the tick draws; the row's label brightens; an optional mono meta sits on the right. Everything is inside a fieldset with a legend.",
  "interaction": "Toggle individual items or the parent; the parent's fill tracks the fraction.",
  "animation": "Level 520ms expo-out; tick draws 320ms (the parent's after the fill arrives); count roll 320ms.",
  "a11y": "Native checkboxes in a fieldset/legend; the parent sets .indeterminate for assistive tech and is described by the live count; focus-visible outlines the whole row. Reduced motion makes it instant.",
  "responsive": "Fluid to 22rem.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Whole rows are tap targets."
};
