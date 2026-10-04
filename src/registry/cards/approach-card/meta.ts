import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "approach-card",
  "name": "Approach Card",
  "category": "cards",
  "description": "A project card whose hierarchy responds to distance: from afar it's only a title; as you come closer the title steps back and the details arrive from the side you approach.",
  "tags": [
    "card",
    "project",
    "proximity",
    "hierarchy",
    "portfolio",
    "typography"
  ],
  "traits": [
    "cursor",
    "keyboard",
    "hover"
  ],
  "source": "original",
  "files": [
    "ApproachCard.tsx",
    "approach-card.css"
  ],
  "dependencies": [],
  "prompt": "Design a portfolio/project card whose hierarchy is driven by distance rather than hover. One CSS variable, --p (0 = far, 1 = close), controls the whole layout. Compute it from a single window pointermove listener: the distance from the pointer to the card's rectangle edge (0 inside), mapped through 1 \u2212 d/220px and a smoothstep, then eased with a 0.11 lerp in a rAF loop that stops when settled. When --p first rises above 0.04, record which side the pointer came from (--dir = \u00b11).\n\nAt p = 0 the card (21:27, 18px radius, #121015 with a hairline ring) shows only a mono index and year at the top and a very large Instrument Serif title sitting at the bottom. As p rises, the title scales to 50% from its top-left and translates up into a slot under the meta row (the travel distance is measured once with a ResizeObserver), and three details \u2014 summary, tech chips, a 'Read the case study \u2192' line \u2014 each run their own clamp((p \u2212 0.35 \u2212 0.12k)\u00b72.6) progress, fading in and sliding 22px from the approach side. A radial light gathers on that side, the ring strengthens, and a hairline along the bottom scales with p as a quiet proximity gauge.\n\nKeyboard focus sets p to 1. Each card takes an accent colour for its light and gauge.",
  "interaction": "Approach the card and it reorganises itself continuously; focus it with the keyboard for the full detail view. It's a normal link.",
  "animation": "Continuous: a lerped proximity value drives transform/opacity through CSS calc(); staggered detail entry from the approach direction.",
  "a11y": "The whole card is one link containing all text in reading order (title is an h3), so screen readers get everything regardless of --p. Focus opens it fully; reduced motion jumps straight to each target value.",
  "responsive": "Fluid width up to 21rem with a fixed aspect ratio; the title's travel is re-measured on resize.",
  "promptAllow": ["single"],
  "variants": [
    {
      "id": "pair",
      "label": "Pair",
      "prompt": "Pair: two cards side by side (wrapping on narrow screens) \u2014 Masar (accent #b9cce4) and Wally (accent #e8a24a) \u2014 so with the pointer between them both half-open."
    },
    {
      "id": "single",
      "label": "Single",
      "prompt": "Single: one card (Masar, accent #b9cce4) centred on the page."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "On devices without hover the card renders in its fully-open state."
};
