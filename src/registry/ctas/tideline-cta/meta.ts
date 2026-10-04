import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tideline-cta",
  name: "Tideline CTA",
  category: "ctas",
  description: "A closing section where a tide rises to the real share of seats taken as it scrolls into view; the words invert exactly along the wave and the button floats on the waterline like a buoy.",
  tags: ["cta", "section", "closing", "event", "scarcity", "mask", "wave", "scroll"],
  traits: ["scroll", "ambient", "hover", "keyboard"],
  source: "original",
  files: ["TidelineCta.tsx", "tideline-cta.css"],
  dependencies: [],
  prompt:
    "Build a full-width closing section (min 36rem tall) for an event that's 73% full. Register --p (number) and --x (length) with @property. Measure the section's height into --h with a ResizeObserver; the surface sits at --top = (1 \u2212 p) \u00d7 h. When 35% of the section is visible (IntersectionObserver, once), set --p to the real share and let it rise over 2.4s with a little overshoot.\n\nRender the content twice in identical layouts: a dry layer, and a 'water' layer whose colour variables are inverted. Mask the water with a seamless wave image (240px period, repeat-x, 16px tall) at (--x, --top \u2212 16px) plus a solid block from --top to the bottom; roll --x 0 \u2192 240px every 4.5s. A paler second swell rolls the other way just behind. Because the inverted copy is inside the mask, the oversized headline (clamp 2.5\u20136rem) inverts exactly along the wave.\n\nPin a mono '73% of seats taken' just above the surface on the left, and the primary link on the surface on the right like a buoy (top: --top, margin-top \u22121.9rem), bobbing 5px with \u00b11\u00b0 over 3.6s; hover pauses the bob and nudges the arrow. Under reduced motion the tide shows at its level, still.",
  interaction: "Scroll it into view and the tide rises to how full the event is. The buoy is the link.",
  animation: "Tide rises over 2.4s with overshoot; surface rolls every 4.5s; buoy bobs every 3.6s.",
  a11y: "Real heading, text and link, read once; the water copy is aria-hidden and inert. The fullness is stated in plain text, not only shown. Reduced motion shows the final level with no movement.",
  responsive: "The mask uses the measured height, so the line is right at any size; the headline balances and the buoy stays on the line at the right edge.",
  touchFallback: "Same on touch; the buoy is an ordinary link.",
  promptAllow: ["night", "paper"],
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": a dark section; the water is pale aqua with dark ink." },
    { id: "paper", label: "Harbour", prompt: "theme=\"paper\" (harbour): a light section; the water is harbour blue with cream ink." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
