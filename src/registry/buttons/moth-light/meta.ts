import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "moth-light",
  name: "Moth Light",
  category: "buttons",
  description: "The button is a lamp. Point at it and it switches on, and moths come in out of the dark — spiralling to the light, circling its edge in jittery loops, bumping into it — while dust drifts in the glow. Leave and the lamp goes out and they scatter. Or fireflies, drifting round it and blinking.",
  tags: ["button", "hover", "moths", "fireflies", "lamp", "light", "glow", "night", "canvas", "nature"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  promptAllow: ["moths", "fireflies"],
  files: ["MothLight.tsx", "moth-light.css", "flight.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that is a lamp with moths drawn to it. Props: children, night (moths or fireflies), onClick, type and motion.\n\nThe lamp: a 56px pill, dark and warm when off (a brown gradient with a faint rim) with a cream label. A light level eases to 1 on hover in about 200ms and drives a CSS variable: a lit face fades in over the dark one (a radial gradient from pale cream to amber), with a tight and a wide amber glow; a soft radial halo grows round the whole button; and the label mixes from cream to dark brown so it reads on either face.\n\nFlight (pure functions): a damped spring towards a target plus a random jolt every frame — stiffness 26, damping 5.5, jolt ±450px/s² — which gives the erratic, darting flight of a moth; a point a given distance outside the pill outline at distance s along it; and a firefly blink cycle (a quick swell over 12% of the period, a fade over 30%, then dark).\n\nOn a canvas overlay 70px round the button (pointer-events none), hovering brings in seven moths from random points beyond the button. Each orbits at its own speed and direction round the outline, 5–21px outside it, flying on the spring. Every 1.5–4.5s each one dives right into the edge for a moment. Draw a moth along its velocity: two wings from quadratic curves that open and close with the flap phase (about 35 flaps a second), coloured from dull grey-brown to warm cream by how close it is to the lit lamp, and a dark body. Faint dust motes drift upwards in the glow. On leave, each moth flies off away from the centre, fading. A press startles them outwards before they come back. The loop stops once they're gone.\n\nFireflies: eleven of them drift lazily on a soft spring 14–54px outside the edge with a slow bob, each blinking on its own period of 1.4–3.2s — a dark body, a radial yellow-green glow up to 14px and a bright core. On leave they drift up and away as their light fades. The lamp stays forest green, with a faint green glow.\n\nKeyboard focus switches the lamp on; touch gets 3.2s on press. Reduced motion lights the lamp and shows a few resting where they would fly, with no movement.",
  interaction: "Point at the button to switch the lamp on and draw them in; press to startle the moths; leave to switch it off.",
  animation: "The lamp lights over about 200ms; moths spiral in and orbit on a jittery spring; fireflies blink on 1.4–3.2s cycles. Reduced motion shows them still.",
  a11y: "A real button with its text label, which changes colour with the light so it stays above 4.5:1 lit or unlit; the canvas and halo are decorative and hidden.",
  responsive: "Leave about 70px of room round the button for the flight.",
  touchFallback: "A press lights the lamp for a few seconds.",
  variants: [
    { id: "moths", label: "Moths", prompt: "Moths round an amber lamp: a dark brown button (#3a2f22 to #241c13) with a cream label #f3e3c2 that lights to a cream-to-amber face (#fff1c9, #ffcc6e, #f0a540) with a dark #3a2205 label and an amber glow, over a near-black warm ground, with drifting dust in the light." },
    { id: "fireflies", label: "Fireflies", prompt: "Fireflies in a meadow at night: a forest-green button (#18311f to #0f2216) with a pale label #ecf8e2 and a faint green glow, over a dark green ground, with eleven yellow-green fireflies drifting round it and blinking." },
  ],
  preview: { bg: "#100d09", mode: "center", height: 340 },
};
