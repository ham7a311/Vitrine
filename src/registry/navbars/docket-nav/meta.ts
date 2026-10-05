import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "docket-nav",
  name: "Docket Nav",
  category: "navbars",
  description: "A product navbar that knows where you are: a hairline under the links slides to the section in view, and on a narrow bar the links fold into a Menu that still names the current section and opens into a numbered docket.",
  tags: ["navbar", "header", "scrollspy", "mobile menu", "sticky", "product", "marketing", "navigation"],
  traits: ["scroll", "click", "keyboard", "touch"],
  source: "original",
  files: ["DocketNav.tsx", "docket-nav.css"],
  dependencies: [],
  prompt: `Build a sticky product navbar that reports position instead of decorating. A 60px bar: brand (small square mark and name) on the left, section links, one solid call to action on the right. Hairline border appears under the bar only once the page has scrolled.

Scrollspy. The active link is the last section whose top has passed a line at header height + 33% of the viewport; at the very bottom of the scroll the last link is active. Use scroll and resize listeners throttled with requestAnimationFrame, and a scroll container passed as scrollRef (falls back to window). The active link gets aria-current="location".

The marker. A single 2px hairline sits on the bar's bottom edge. It is one element that is moved with transform only: translateX to the active link's measured offsetLeft (+10px of link padding) and scaleX to its measured width (-20px), 380ms cubic-bezier(.2,.8,.2,1). It appears (opacity) only after the first measurement so it never slides in from the left. Re-measure with a ResizeObserver.

Narrow bars. Use a container query (container-type: inline-size, breakpoint 44rem), never a viewport query. Below it, links and the CTA leave the bar and a Menu button takes their place: the word "Menu" (or "Close") and, beside it in 11px mono capitals, the current section as "02 Changelog". Opening grows a docket below the bar with grid-template-rows 0fr to 1fr (320ms): a ruled ordered list in 24px serif, rows numbered 01, 02, 03 in mono, the current row in full ink with a small drawn tick, the rest muted, then the CTA full width. Rows arrive with a 40ms stagger. Closed content is visibility: hidden so it leaves the tab order.

Production behaviour: link clicks scroll the section to just under the bar (smooth unless reduced motion), move focus to the section, and close the docket. Escape closes it and returns focus to the Menu button, as does a pointerdown outside. Menu has aria-expanded and aria-controls. Paper and Night themes.`,
  interaction: "Scroll and the hairline follows the section in view. Click a link to travel there. Narrow the bar and open Menu, then pick a row; Escape closes it.",
  animation: "Marker slide 380ms; docket grow 320ms; rows rise 320ms with a 40ms stagger; current-section label rises 240ms when it changes.",
  a11y: "A header with a labelled nav; the active link is aria-current=\"location\". The Menu button exposes aria-expanded and aria-controls, and the closed docket is hidden from the tab order. Escape closes it and restores focus. Reduced motion removes the marker slide, the stagger and smooth scrolling; the state changes still happen.",
  responsive: "Driven by the bar's own width with a container query at 44rem; the menu button is 44px tall.",
  touchFallback: "Nothing depends on hover. Tap Menu, tap a row, tap outside to close.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 640 },
  isNew: true,
};
