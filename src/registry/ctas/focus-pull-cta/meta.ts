import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "focus-pull-cta",
  "name": "Focus Pull",
  "category": "ctas",
  "description": "A closing call to action with a camera's depth of field: whichever action you move toward racks into focus, hunting slightly before it locks, while the rest of the block falls soft.",
  "tags": [
    "cta",
    "section",
    "focus",
    "depth-of-field",
    "buttons",
    "editorial"
  ],
  "traits": [
    "hover",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "FocusPullCta.tsx",
    "focus-pull-cta.css"
  ],
  "dependencies": [],
  "prompt": "Compose a closing CTA block as three optical planes: an eyebrow + serif headline (Instrument Serif, clamp 2.3\u20134.1rem, 18ch), a primary action (bone pill, dark text, arrow) and a secondary action (hairline pill). At rest the headline is the subject and everything is sharp.\n\nMoving the pointer onto an action (or tabbing to it) racks focus to it like a camera: every other plane falls back \u2014 blur(1.6px), 42% opacity, scale 0.985 from its own anchor \u2014 over 520\u2013620ms on cubic-bezier(0.16,1,0.3,1). The new subject doesn't just sharpen; it 'hunts' like a lens: a 560ms keyframe goes blurred \u2192 sharp at 38% \u2192 slightly soft (0.55px) at 58% \u2192 locked. Two identical keyframes alternate on each rack so the hunt replays without remounting. Leaving the block (or focus leaving it) racks back to the headline.\n\nThe primary arrow nudges 3px when it's the subject; the secondary's hairline strengthens. The effect is attention-direction, so it's tuned to be felt rather than noticed.",
  "interaction": "Hover or tab to an action and focus racks onto it; leave the block and focus returns to the headline.",
  "animation": "520ms filter/opacity + 620ms scale rack on expo-out; 560ms 'hunt' keyframe on the new subject.",
  "a11y": "Real links in a <section> with an h2; nothing is hidden, only softened. Reduced motion swaps blur for a gentle dim with no hunt; keyboard focus behaves exactly like hover.",
  "responsive": "Headline scales with clamp(); actions wrap on narrow screens.",
  "variants": [
    {
      "id": "studio",
      "label": "Studio",
      "prompt": "Studio: on #0c0b0a \u2014 eyebrow \"Available from March\", headline \"Have something worth building carefully?\" (italic last word), primary \"Start a project\", secondary \"See selected work\", note \"Hamza Al-Bulushi \u00b7 Software engineer, Muscat\"."
    },
    {
      "id": "product",
      "label": "Product",
      "prompt": "Product: accent #b9cce4 on #0b0e13 \u2014 eyebrow \"Vitrine \u00b7 v2\", headline \"Components worth copying into real work.\", primary \"Browse the library\", secondary \"Read the docs\", note \"Free and open source \u00b7 MIT licence\"."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "On touch devices (hover: none) nothing is ever blurred \u2014 the block renders fully sharp."
};
