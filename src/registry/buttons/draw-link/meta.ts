import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "draw-link",
  "name": "Draw Link",
  "category": "buttons",
  "description": "A text link whose underline follows your hand: it draws in from the side you arrive on and leaves out the far side, like a stroke passing under the words.",
  "tags": [
    "link",
    "underline",
    "text-button",
    "hover",
    "direction-aware",
    "typography"
  ],
  "traits": [
    "hover",
    "cursor",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "DrawLink.tsx",
    "draw-link.css"
  ],
  "dependencies": [],
  "prompt": "Build a text link with an underline that travels. The underline is a pseudo-element under the text (height max(1px, 0.07em), accent colour) scaled on X from 0. On mouseenter, detect which half of the link the pointer entered from and set data-from; the underline grows from that side (transform-origin left or right) over 520ms on cubic-bezier(0.65,0,0.35,1). On mouseleave, detect the exit side and shrink the line toward it \u2014 so a pointer passing through left-to-right draws the stroke in from the left and wipes it out to the right, like a pen passing under the word. A small \u2197 arrow nudges up-right and brightens. Focus shows the full underline and a soft ring. On touch the underline rests at 40% opacity so links are recognisable.",
  "interaction": "Hover from either side: the underline enters from that side and exits through the side you leave.",
  "animation": "520ms ease-in-out scaleX with a direction-dependent origin; arrow nudge 520ms expo-out.",
  "a11y": "A real link; focus-visible shows the underline and a ring. Reduced motion makes it instant.",
  "responsive": "Scales with its font size (em-based line and arrow).",
  "variants": [
    {
      "id": "editorial",
      "label": "In a sentence",
      "prompt": "In a sentence: three links inside a large Instrument Serif sentence (clamp 1.9\u20133rem, muted #a7a1ab text) \u2014 \"Currently building Vitrine, writing about interface motion, and studying at GUtech.\" \u2014 each with its \u2197 arrow."
    },
    {
      "id": "nav",
      "label": "Navigation",
      "prompt": "Navigation: a row of four nav links (Work, About, Writing, Contact) in Hanken Grotesk 15px with arrow={false}, gap 2rem."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Underline rests visible at reduced opacity."
};
