import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "masthead-nav",
  "name": "Masthead Nav",
  "category": "navbars",
  "description": "An editorial masthead that condenses as you scroll \u2014 the big name shrinks and travels into the logo slot, the frame gathers into a floating pill, and nothing ever snaps.",
  "tags": [
    "navbar",
    "header",
    "scroll",
    "editorial",
    "portfolio",
    "responsive"
  ],
  "traits": [
    "scroll",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "MastheadNav.tsx",
    "masthead-nav.css"
  ],
  "dependencies": [],
  "prompt": "Build a navbar that starts life as an editorial masthead and condenses, continuously, into a floating pill as the page scrolls. Drive everything from one variable --p = clamp(scrollY / 110px) (window or a passed scroll container, rAF-throttled), plus two derived phases in CSS: --q (meta leaves early, p\u00d72.4) and --r (CTA arrives late).\n\nThe header is sticky and only as tall as the compact bar; the masthead hangs below it over the page's top padding, so the layout never jumps. Its frame interpolates: width from 100% to min(44rem, 100% \u2212 1.5rem) (centred), height from 11rem to 3.5rem, radius 0 \u2192 1.75rem, a glass background alpha 0 \u2192 0.72 with backdrop blur 0 \u2192 14px, a hairline ring and shadow fading in, and a bottom rule that fades out.\n\nInside: a mono meta row (location/role left, a green 'Available for new work' dot right) fades and lifts away; the name, set in Instrument Serif at clamp(3rem, 8.5cqi, 5.25rem), scales from its bottom-left toward exactly 19px (the scale is measured from its computed font size) while travelling from the masthead's bottom-left into the bar's vertical centre; the links move from the bottom-right to the bar's centre line, tightening their gap; a bone 'Contact' pill scales in at the right in the late phase and becomes interactive only once compact. Links have a drawn underline for hover and aria-current.\n\nBelow a 40rem container width, links and CTA fold into a 'Menu' button (two-line burger that crosses) which opens a sheet out of the bar: clip-path + scale from the top-right, with large serif links numbered in mono, staggered 45ms. Escape closes it.",
  "interaction": "Scroll: the masthead condenses into a pill and unfolds again on the way back up. On small containers a Menu button opens a sheet; Escape closes it.",
  "animation": "Scroll-linked (no timers): every property is a calc() of --p. Menu sheet 460ms clip-path reveal with 45ms item stagger.",
  "a11y": "A <header> with a labelled <nav> and aria-current; the wordmark is a home link; the CTA is hidden from pointer and tab order until the bar is compact; the menu button has aria-expanded/aria-controls. Reduced motion keeps the scroll-linked layout (it's positional, not animated) and removes the sheet animation.",
  "responsive": "Container queries (not viewport) switch to the menu below 40rem, and the wordmark size uses cqi units, so it adapts wherever it's placed.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" (frost blue) for link underlines and focus; name \"Hamza Al-Bulushi\"."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber) for link underlines and focus; name \"Hamza Al-Bulushi\"."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Scroll-linked on touch exactly as on desktop; the menu sheet uses large tap targets."
};
