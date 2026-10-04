import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "sign-off-footer",
  "name": "Sign-off Footer",
  "category": "footers",
  "description": "A footer that ends the page the way a letter ends: one large closing line, a live clock for where you are, and an email you can copy in one click.",
  "tags": [
    "footer",
    "contact",
    "cta",
    "email",
    "clock",
    "portfolio"
  ],
  "traits": [
    "click",
    "keyboard",
    "ambient"
  ],
  "source": "original",
  "files": [
    "SignOffFooter.tsx",
    "sign-off-footer.css"
  ],
  "dependencies": [],
  "prompt": "Design a closing footer for a portfolio that ends like a letter. One very large Instrument Serif line ('Let's make something careful.', clamp 2.6\u20136rem, first letter italic). Under it, a row: on the left a bone email pill; on the right two quiet lines \u2014 a green availability dot with a slow pulse, and a live clock in tabular mono for the owner's city (Intl.DateTimeFormat with the owner's timeZone), followed by how far ahead or behind the visitor that is ('4h ahead of you'), so they know when to expect a reply.\n\nClicking the email copies it: inside a one-line window the address lifts out and 'Copied \u2014 talk soon' rises in (520ms expo-out), the pill turns the accent colour, and the copy glyph fades as a check draws. A hairline base row holds \u00a9 year and owner, a few 'elsewhere' links and 'Back to top \u2191'.",
  "interaction": "Click the email to copy it; the clock ticks every second; Back to top scrolls smoothly.",
  "animation": "520ms text exchange in the pill, 380ms tick draw, 2.4s availability pulse.",
  "a11y": "A <footer> with a labelled nav; the pill is a button labelled with the address; 'Email copied' is announced. Reduced motion removes the exchange and pulse.",
  "responsive": "The line and pill scale with clamp(); the row wraps on small screens.",
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "Tap to copy; nothing hover-dependent."
};
