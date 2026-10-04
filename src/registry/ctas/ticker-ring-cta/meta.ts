import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ticker-ring-cta",
  name: "Ticker Ring CTA",
  category: "ctas",
  description: "A closing banner with its small print — dates, seats left, where — running continuously round its border like a ticker; point at the button and the ticker slows so you can read it.",
  tags: ["cta", "section", "closing", "ticker", "textPath", "svg", "border"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  files: ["TickerRingCta.tsx", "ticker-ring-cta.css"],
  dependencies: [],
  prompt:
    "Build a closing CTA as a dark band (34px wide, 30px outer radius) around a calm inner face. Measure the band with a ResizeObserver and build a rounded-rectangle path through the middle of the band; write the event's facts along it in 11px mono capitals ('NEXT INTAKE 12 JAN \u00b7 18 OF 24 SEATS LEFT \u00b7 MUSCAT & ONLINE \u00b7 \u2026') with SVG textPath. Repeat the line enough times to fill one lap, fit it exactly with textLength and lengthAdjust=spacing, and render two copies one lap apart so the loop has no seam.\n\nMove both copies' startOffset in a requestAnimationFrame loop at 34px/s. While the primary or secondary action is hovered or focused, ease the speed down to 6px/s, light the ticker in the theme's hot colour and ring the inner face in it, so the small print becomes readable exactly when you're deciding. The face holds a mono eyebrow, a balanced headline, a muted paragraph, a pill button with a nudging arrow and an underlined secondary link. Under reduced motion the ticker stands still.",
  interaction: "Point at or tab to an action and the ticker slows to a crawl and turns amber.",
  animation: "Ticker 34px/s, easing to 6px/s; colour 400ms.",
  a11y: "The ticker is decorative (aria-hidden); its facts are also a visually hidden list that describes the primary link, so screen readers hear them once. Real heading and links. Reduced motion stops the ticker.",
  responsive: "The path is rebuilt on every resize, so the text always fits one lap; type and padding scale with clamp().",
  touchFallback: "The ticker keeps running; tapping goes straight to the link.",
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": band #1a181e with ticker text #b8b0a4 around a dark face #121015; the hot colour is warm amber #f0b37a." },
    { id: "paper", label: "Harbour", prompt: "theme=\"paper\" (harbour): a deep green band #1d3b2f with ticker text #d8cfb8 around an ivory face #fbf7ec; the hot colour is gold #ffd27a." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
