import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "static-edge",
  name: "Static Edge",
  category: "buttons",
  description: "Point at the button and it charges up: jagged arcs of electricity crawl along its edge, gathering where your pointer is, forking off into the air and snapping across to the pointer when you come close to the rim, while the face glows from below. Press to discharge the lot in one bright flash.",
  tags: ["button", "hover", "electric", "lightning", "spark", "energy", "glow", "canvas", "dark", "edge"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  files: ["StaticEdge.tsx", "static-edge.css", "arc.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a dark pill button with electricity crawling round its edge. Props: children, charge (one of three colours, each a glow, a hot core, a face and a label colour), onClick, type and motion.\n\nGeometry (pure functions): the pill outline walked by distance (point, tangent, outward normal), the outline distance nearest to a point, and the shortest way round between two distances. Bolts: midpoint displacement between two points — each pass splits every segment and pushes the midpoint sideways by a random amount up to the current roughness, which shrinks to 55% each pass. A crawling arc samples the outline every 4px over its length, pushed out a few px and jittered across the edge, both scaled by a sine taper so it starts and ends on the edge. A fork leaves the outline outwards along the normal (with a little sideways lean) as a short bolt.\n\nA canvas overlay extends 28px round the button with pointer-events none. While hovered there are four streamers; each has a place on the outline, a length of 26–86px and a short life of 0.12–0.42s. Their places drift towards the outline point nearest the pointer, with a little random wander, and each is reborn near it when it dies. Every 45ms each streamer is reshaped (that re-jitter is the flicker) and has a 22% chance of a fork 7–18px long. If the pointer is within 18px of the edge, a bolt jumps from the nearest edge point to the pointer. Draw everything additively: a 3.2px glow stroke at half opacity with a 12px shadow in the glow colour, then a 1.1px core stroke; new streamers fade in.\n\nA charge level eases to 1 on hover and back to 0 on leave and drives a CSS variable: the face warms from below with the glow colour, the hairline rim brightens, an inner and an outer glow grow, the label picks up a faint glow and the bolt icon glows. Pressing discharges: one bolt all the way round plus seven sparks thrown off it, which fade over about 300ms with a flash in the glow. The loop stops when everything has faded. Keyboard focus charges it from the top; touch gets a 1.8s charge and the discharge. Reduced motion shows only the steady glow, with no arcs.",
  interaction: "Point at the button to charge it; arcs gather where your pointer is and jump to it near the rim. Press to discharge. Keyboard focus charges it too.",
  animation: "Arcs re-jitter every 45ms and live 0.12–0.42s each; the glow eases in over about 100ms and out over 200ms; the discharge fades over 300ms. Reduced motion shows a steady glow.",
  a11y: "A real button with its text label; the canvas is decorative and hidden. The label keeps strong contrast on the dark face at every charge level.",
  responsive: "Leave about 28px of room round the button for the arcs.",
  touchFallback: "A press charges it briefly and discharges.",
  variants: [
    { id: "blue", label: "Blue", prompt: "Blue electricity: glow #3fa2ff, core #eef8ff, face #0a111f, label #e9f4ff, on a near-black ground." },
    { id: "violet", label: "Violet", prompt: "Violet plasma: glow #b06cff, core #f7efff, face #110a1e, label #f3eaff." },
    { id: "amber", label: "Amber", prompt: "Amber sparks: glow #ffa526, core #fff6e2, face #171006, label #fff1d8." },
  ],
  preview: { bg: "#080b12", mode: "center", height: 300 },
};
