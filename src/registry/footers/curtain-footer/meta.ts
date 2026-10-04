import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "curtain-footer",
  "name": "Curtain Footer",
  "category": "footers",
  "description": "The page lifts away like a sheet at the end of the scroll, revealing the footer fixed underneath \u2014 a giant wordmark cropped by the bottom edge, rising as it's uncovered.",
  "tags": [
    "footer",
    "reveal",
    "scroll",
    "wordmark",
    "sticky",
    "editorial"
  ],
  "traits": [
    "scroll"
  ],
  "source": "original",
  "files": [
    "CurtainFooter.tsx",
    "curtain-footer.css"
  ],
  "dependencies": [],
  "prompt": "Make the end of the page feel like lifting a sheet off something. The last section of the page (the 'sheet') sits on z-index 1 with rounded lower corners (clamp 1.25\u20132.25rem) and a deep shadow. Behind it, the footer is position: sticky; bottom: 0, so as you reach the end the sheet scrolls up and away to uncover it.\n\nReveal progress (how much of the footer is uncovered, 0\u20131, rAF-throttled from the sheet's bottom edge) drives the footer's contents: link columns rise 24px and go from 25% to full opacity, and a giant Anton wordmark (clamp 6\u201320rem, a top-to-bottom fade of the ink colour clipped to the text) sits cropped by the bottom edge and rises as it's revealed. Works with the window or a passed scroll container.",
  "interaction": "Scroll to the bottom; the page lifts off to reveal the footer and the wordmark rises into view.",
  "animation": "Scroll-linked (no timers): opacity, translate of the columns and wordmark from a reveal variable.",
  "a11y": "A real <footer> with labelled navs; the wordmark is decorative. Reduced motion shows the footer at rest.",
  "responsive": "Columns auto-fit (min 9rem); the wordmark scales with the viewport and is always cropped at the bottom.",
  "preview": {
    "bg": "#16130f",
    "mode": "scroll"
  },
  "touchFallback": "Works with touch scrolling."
};
