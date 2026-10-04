import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "route-globe",
  name: "Route Globe",
  category: "maps",
  description: "A dotted globe with flight arcs from one hub: comets run each great circle and the destinations pulse as they land. Drag to spin it.",
  tags: ["globe", "map", "world", "routes", "flights", "canvas", "earth", "travel"],
  traits: ["canvas", "click", "touch", "cursor", "ambient"],
  source: "original",
  files: ["RouteGlobe.tsx", "globe.ts", "land.ts", "route-globe.css"],
  dependencies: [],
  prompt: `Build a dotted globe in Canvas 2D (no map libraries) with flight routes from one hub. Land comes from a 1° land mask of Natural Earth 1:110m countries (public domain), stored run-length encoded in a small module; sample about 30,000 points on a Fibonacci sphere (18,000 on phones) so dots are evenly spaced everywhere, and keep the ones on land (Antarctica left out).

Each frame rotate the points by yaw (around the vertical axis) then tilt, and draw them in orthographic projection: dots on the far side tiny at 9% opacity, dots on the near side in four depth bands brightening toward the middle and slightly larger, plus a soft atmosphere ring outside the limb. Routes go from the hub (Muscat) to ten cities: each is a great circle (slerp) lifted off the surface by sin(πu) × (0.06 + 0.12 × angular distance), drawn as a faint 1px line (almost invisible where it passes behind the globe). A comet — a bright head with a ten-segment fading tail — runs along each route in 70% of a 3.6s cycle, each route with its own offset, and the destination dot sends out a pulse ring as it lands. The hub is a pulsing dot.

Drag spins the globe (yaw and tilt, tilt clamped) with inertia that decays; after 2.5s idle it turns slowly on its own and the tilt eases back. Hovering near a destination shows a small frosted tooltip with the city and flight time. The route list is also in the DOM for screen readers.`,
  interaction: "Drag to spin the globe with inertia; hover a destination for its flight time.",
  animation: "Comets loop every 3.6s with staggered offsets; arrival pulses; idle spin 0.08 rad/s after 2.5s; drag inertia decays to 5% per second.",
  a11y: "The canvas is role=\"img\" with a summary, and every route (with its flight time) is in a visually hidden list. Reduced motion draws one still frame with comets at their destinations; drag still turns it.",
  responsive: "The globe is 80% of the smaller side and recentres on resize; fewer land dots on phones.",
  touchFallback: "Drag to spin on touch (vertical swipes still scroll the page); tooltips are mouse-only, the list covers the rest.",
  variants: [
    { id: "night", label: "Night", prompt: "Night: blue-grey land dots (#9fb4d6) on #06080d with a blue atmosphere glow, amber routes and comets (#ffb547), white hub." },
    { id: "paper", label: "Paper", prompt: "Paper: slate land dots (#3b4a63) on warm paper (#f3efe6) with a faint grey glow, vermilion routes (#d9480f), dark hub — like a printed route map." },
  ],
  preview: { bg: "#06080d", mode: "fill", height: 620 },
};
