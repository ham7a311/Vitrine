import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ember-button",
  name: "Ember Button",
  category: "buttons",
  description: "A warm amber button with a soft gold glow, and ornaments that draw in: circuit traces that power on, or hand-sketched sparks.",
  tags: ["button", "cta", "amber", "svg", "draw-in", "ornament"],
  traits: ["hover", "scroll"],
  source: "original",
  files: ["EmberButton.tsx", "ember-button.css"],
  dependencies: [],
  prompt: `Design a warm, confident primary button for a dark interface. It's an amber (#e8a24a) rounded rectangle (6px radius, 44px tall, medium-weight label with -0.01em tracking) with a faint white inner highlight along its top edge. On hover it brightens to #f3b45f and gains a soft gold drop-glow beneath it; on press it sinks by exactly 1px. An optional arrow (↗) nudges 2px up and to the right on hover. All transitions are 200ms cubic-bezier(0.4,0,0.2,1). Ornaments, when used, play once when the button scrolls into view (IntersectionObserver, 40% visible); under reduced motion they appear in their final state.`,
  interaction: "Hover brightens and glows; press translates 1px down. Ornaments draw once when 40% of the button is visible.",
  animation: "Button: 200ms colour/shadow/transform. Trace: 600ms stroke draw (+90ms for the second), power-on at 600/690ms with a 200ms fill + glow. Sparkle: 450ms stroke draw.",
  a11y: "Polymorphic: a real <button type=\"button\"> by default, an <a> when href is set (external links get rel=\"noopener noreferrer\"). Ornaments are aria-hidden SVGs. Visible amber focus outline with 3px offset.",
  responsive: "Ornamented buttons are width min(100%, 20.5rem) so the flourishes never overflow narrow screens; sparkles shrink from 32px to 28px below 640px.",
  touchFallback: "Nothing depends on hover — the ornament is scroll-triggered, so it plays the same on touch.",
  variants: [
    { id: "trace", label: "Power trace", prompt: "Power trace ornament (ornament=\"trace\", size lg, \"Open the console\"): two right-angled circuit traces, one above-right and one below-left of the button, each ending in a small round pad. They draw themselves in 600ms (ease-out-expo, the second 90ms later) in a dim grey, then \"power on\": the line turns amber and the pad fills with a soft amber glow." },
    { id: "sparkle", label: "Sparkle", prompt: "Sparkle ornament (ornament=\"sparkle\", size lg, \"Claim your seat\"): two hand-drawn six-ray asterisks with uneven ray lengths and an off-centre hub, so they read as a quick pen scribble rather than a geometric star; they draw in over 450ms." },
    { id: "variants", label: "Primary · Secondary · Ghost", prompt: "Three styles side by side, no ornament: primary (amber, with arrow) \"Get started\", secondary (hairline border, transparent) \"Read the docs\", and ghost (text only) \"Maybe later\"." },
  ],
  preview: { bg: "#0c0b0a", mode: "fill" },
};
