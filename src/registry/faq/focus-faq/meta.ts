import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "focus-faq",
  "name": "Focus FAQ",
  "category": "faq",
  "description": "An FAQ where choosing a question promotes it: it travels up and grows into the heading, its answer unfolds beneath, and every other question steps back into a compact list below.",
  "tags": [
    "faq",
    "flip",
    "accordion",
    "editorial",
    "typography",
    "section"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "FocusFaq.tsx",
    "focus-faq.css"
  ],
  "dependencies": [],
  "prompt": "Design an FAQ where choosing a question promotes it rather than opening it in place. At rest: a mono eyebrow and a numbered list of questions set in Instrument Serif (clamp 1.3\u20131.65rem) with hairline rules and a small \u2197 that nudges on hover.\n\nChoosing one re-lays the section: the chosen question becomes a large heading at the top (clamp 2\u20133.1rem), its answer fades up beneath (160ms after), with '\u2190 All questions'; the remaining questions become a compact sans list below ('more questions'). Make the transition physical with FLIP: before the state change, record every question's bounding box (data-flip keys); after React re-renders, animate each from its old box to its new one with translate + scale from the top-left (620ms, cubic-bezier(0.16,1,0.3,1)) \u2014 so the chosen question visibly travels up and grows into the heading while the others slide and shrink into the list. The eyebrow becomes 'Question 03 of 05'.",
  "interaction": "Click a question to make it the subject; pick another from the compact list, or go back to all.",
  "animation": "FLIP translate+scale 620ms expo-out on every question; answer and back link fade up with 160/260ms delays.",
  "a11y": "Questions are buttons in an ordered list; the focused question is a real heading; reduced motion swaps layouts instantly with no FLIP.",
  "responsive": "Fluid to 44rem; headings scale with clamp().",
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "Tap targets are full-width rows."
};
