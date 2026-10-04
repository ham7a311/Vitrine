import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "inline-cta",
  "name": "Inline CTA",
  "category": "ctas",
  "description": "A call to action that lives inside a sentence: one phrase is the action, and on approach it lifts out of the line into a pill while the words around it make room.",
  "tags": [
    "cta",
    "inline",
    "editorial",
    "typography",
    "section",
    "link"
  ],
  "traits": [
    "hover",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "InlineCta.tsx",
    "inline-cta.css"
  ],
  "dependencies": [],
  "prompt": "Write the CTA as one large editorial sentence (Instrument Serif, clamp 2.2\u20134.4rem, balanced wrapping) with the action embedded in it as an italic phrase The phrase is a real link and nothing else on the section competes with it; a mono caption sits well below.\n\nAt rest the phrase shows only a hairline underline: a pill-shaped background clipped with clip-path inset(calc(100% \u2212 0.06em) 0.28em 0 0.28em round 999px). On hover or focus the clip opens to inset(0 round 999px) over 560ms on cubic-bezier(0.16,1,0.3,1), so the pill grows up out of the underline around the words. At the same time the link's horizontal padding animates 0.04em \u2192 0.42em (with small margin changes) so the neighbouring words physically step aside instead of being covered, the text inverts to near-black, and a \u2197 arrow grows in (width 0 \u2192 0.5em) beside it. Focus adds a ring outside the pill. On touch the lifted state is shown by default.",
  "interaction": "Hover or focus the phrase and it lifts into a pill; the sentence reflows around it. It's a normal link.",
  "animation": "560ms expo-out clip-path, padding/margin and arrow width; 240ms colour inversion delayed 60ms so it lands after the pill covers the text.",
  "a11y": "A single real link inside a paragraph, so the sentence is read in order; decorative pill and arrow are aria-hidden; focus-visible shows the lifted state plus a ring. Reduced motion switches states instantly.",
  "responsive": "Type scales with clamp() and wraps with text-wrap: balance; the phrase never breaks across lines.",
  "variants": [
    {
      "id": "bone",
      "label": "Bone",
      "prompt": "Bone (default accent #efe8dc) on #0c0b0a: \"Have an idea that needs a careful hand? Let's *build it together* \u2014 properly.\", caption \"Hamza Al-Bulushi \u00b7 replies within a day\"."
    },
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" on #0b0e13: \"The library is open. Take what you need, or *browse all components* first.\", caption \"Free \u00b7 MIT licensed \u00b7 no sign-up\"."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" on #0e0b08: \"Seats are limited this year \u2014 *reserve yours* before the 14th.\", caption \"Northstar Build Summit \u00b7 Harbour Hall\"."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "On devices without hover the phrase is shown already lifted, so it reads as tappable."
};
