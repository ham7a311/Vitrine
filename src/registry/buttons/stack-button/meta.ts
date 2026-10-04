import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "stack-button",
  "name": "Stack Button",
  "category": "buttons",
  "description": "An add-to-bag button where the quantity is physical: every press slides another sheet out from behind it, and removing one peels the top sheet away.",
  "tags": [
    "button",
    "quantity",
    "cart",
    "stack",
    "counter",
    "stateful"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "StackButton.tsx",
    "stack-button.css"
  ],
  "dependencies": [],
  "prompt": "Design an add-to-bag button whose quantity is shown as a physical stack rather than a badge. The button is a 52px-tall, 14px-radius slab (tone-coloured, inset top highlight) holding the label in Hanken 15px/600 and a small tabular count chip in the accent colour.\n\nBehind it, draw one 'sheet' per item: the same rounded shape inset 6px on each side, a subtle top-lit gradient, a 1px highlight and a short shadow. Sheet i sits (i+1)\u00d75px higher than the button, is scaled down by 1.2% per level, and leans by a fixed, deterministic angle from a table (\u22121.3\u00b0, 0.9\u00b0, \u22120.5\u00b0, 1.4\u00b0\u2026) around its bottom centre \u2014 so the stack always looks the same and reads as hand-stacked. The wrapper's top padding grows with the count (480ms expo-out) so the stack never overlaps what's above. Draw at most six sheets; the count keeps going.\n\nPressing the button slides a new sheet up out from behind it (from translateY 0 and 0.96 width to its slot, 520ms cubic-bezier(0.16,1,0.3,1)) and rolls the digit up. Once the count is above zero, a minus segment slides open on the left (width 0 \u2192 44px). Removing an item peels the top sheet off: it rises 26px, drifts right, rotates a further 7\u00b0 and fades on an ease-in curve.",
  "interaction": "Press to add one; the minus segment (appears once there's something to remove) peels the top sheet off.",
  "animation": "520ms expo-out slide-up per sheet with a fixed lean table; 520ms ease-in peel; 380ms digit roll; minus segment width 420ms.",
  "a11y": "Two real buttons (add, 'Remove one'); the count is announced politely ('3 in bag'); the stack is aria-hidden. Visible focus rings; reduced motion shows the stack without the slide/peel.",
  "responsive": "Intrinsic width; the stack grows upward inside its own padding so nothing overlaps.",
  "promptAllow": ["paper", "frost"],
  "variants": [
    {
      "id": "ember",
      "label": "Warm",
      "prompt": "Warm tone (default): a warm near-black slab (#1b1714) with an amber count chip, \"Add to bag\" starting at 1, on #0c0b0a; caption \"Stoneware cup \u00b7 \u20ac24 each\"."
    },
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "tone=\"frost\": a cool blue-black slab with a frost-blue chip; label \"Save to collection\", unit \"saved\", starting at 3, on #0b0e13; caption \"Reference board \u00b7 Type\"."
    },
    {
      "id": "paper",
      "label": "Paper",
      "prompt": "tone=\"paper\": a light paper slab with dark ink and a paper-toned stack, starting at 2, on #e9e4da; caption \"Linen overshirt \u00b7 \u20ac128\"."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "Plain taps; press state nudges the label 1px. Tap highlight suppressed."
};
