import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ticker-ring-button",
  name: "Ticker Ring Button",
  category: "buttons",
  description: "A button with its announcement written around the border: a line of small capitals runs along it like a ticker, and hovering slows it down so you can read it.",
  tags: ["button", "border", "ticker", "marquee", "announcement", "svg", "text on path"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  files: ["TickerRingButton.tsx", "ticker-ring-button.css"],
  dependencies: [],
  prompt:
    "Build a pill button with a 13px band around a solid face ('Book a table'). In the band, an SVG textPath runs a short announcement in mono capitals ('WINTER MENU FROM 14 NOV \u00b7') around the pill. Measure the button with a ResizeObserver and build the pill-shaped loop through the band's centre; repeat the line enough times to go round once and pin it to exactly the loop's length with textLength + lengthAdjust=spacing, so it closes without a gap.\n\nMove it with requestAnimationFrame by advancing startOffset, using two copies one lap apart (offset o and o \u2212 length) so there's never a seam. The speed eases from 26px/s to 7px/s while the button is hovered or focused, so it slows to be read, and the ticker text and the face's rim light up in the theme's hot colour. The ticker text is also the button's accessible description. Reduced motion leaves it still.",
  interaction: "Hover or focus to slow the ticker; press to act.",
  animation: "Ticker moves at 26px/s, easing to 7px/s on hover; colours fade 300ms.",
  a11y: "A real button whose name is its label; the ticker text is linked with aria-describedby, and the SVG is hidden from assistive tech. Reduced motion stops the ticker.",
  responsive: "The ring is rebuilt from the button's measured size, so any label length works.",
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": a near-black band (#1c1a20) with warm grey ticker text (#c9c2b6) around a cream face (#efe8dc); on #0d0b0a." },
    { id: "paper", label: "Harbour green", prompt: "theme=\"paper\" (harbour green): a deep green band (#1d3b2f) with pale ticker text (#e6dcc4, hot #ffd27a) around an ivory face (#fbf7ec) with green ink; on #f1ece0." },
  ],
  preview: { bg: "#0d0b0a", mode: "fill" },
};
