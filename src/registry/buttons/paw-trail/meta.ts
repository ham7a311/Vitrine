import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "paw-trail",
  name: "Paw Trail",
  category: "buttons",
  description: "Point at the button and an animal walks round it from where you came in, in the direction you were heading: each print is stamped into the ground with a puff of dust and fades behind it, lap after lap until you leave. A dog with claws, a lighter-stepping cat, or a bird that hops in pairs. Pressing stamps one big print on the face.",
  tags: ["button", "hover", "paw", "footprints", "animal", "playful", "pets", "trail", "edge", "fun"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["PawTrail.tsx", "paw-trail.css", "gait.ts", "prints.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that an animal walks around. Props: children, animal (one of three walkers, each with its own print and gait), ink (print colour), tone {face, label}, onClick and type.\n\nGeometry (pure functions): the outline of a w × h rounded rectangle with radius h/2, walked clockwise from the start of the top edge — its length, the point at distance s with its clockwise tangent and outward normal (straight edges and quarter-circle corners), and the distance nearest to any point.\n\nWalking: on pointerenter, find the outline distance nearest to where the pointer came in, and walk in the direction the pointer was moving along the edge there (the sign of the tangent · the pointer's movementX/Y). Each walker has a gait — a step interval, a stride, how far outside the edge its line runs, how far apart its feet are, and whether it alternates feet or lands both at once. Every step, advance by the stride and place a print on the line just outside the edge, offset to the walker's left or right by half the foot spread, rotated so it points along the direction of travel. Keep walking laps while hovered; stop on leave.\n\nEach print is an inline SVG in currentColor in an overlay behind the button that extends 34px beyond it, with pointer-events none. It stamps in over 240ms — from 1.45× and blurred to 0.9× and back to 1 — with a thin ring of dust expanding and fading beside it, holds, then fades out over 700ms after 1.5s and is removed. All of it uses the Web Animations API on elements appended imperatively, so React doesn't re-render per step.\n\nThe button: a 52px pill in the face colour with the label colour, a small print icon that turns 24° on hover, a 1px lift on hover and a small press. Pressing stamps a big print (46px, soft-light blend, 32% opacity) on the face where you pressed, which fades over 1.1s. Keyboard focus starts a walk from the top centre; blur stops it. On touch, a press starts a walk for 2.2s. Reduced motion: a still ring of prints fades in on hover, with no walking and no stamps.",
  interaction: "Point at the button to start a walk from where you came in; press for a big stamp. Keyboard focus starts a walk too.",
  animation: "A step every 150–260ms; each print stamps in over 240ms with a dust ring and fades out after 1.5s. Reduced motion shows a still ring of prints instead.",
  a11y: "A real button with its text label; the prints are decorative and live in an aria-hidden overlay with pointer-events none. The focus ring sits outside the prints.",
  responsive: "The button keeps its size; leave about 34px of room around it for the trail.",
  touchFallback: "A press starts a short walk and stamps the face.",
  variants: [
    { id: "pup", label: "Pup", prompt: "A dog: a heart-shaped pad and four oval toes with small claws, 15px; a step every 170ms, 21px stride, a line 15px outside the edge, feet 6px either side, alternating. Ground #f3ead9, prints #6b4a2f, button #2e2219 with #fbf3e6 text." },
    { id: "cat", label: "Cat", prompt: "A cat: a rounder pad and four round toes with no claws, 12px; a step every 150ms, 17px stride, 13px out, feet 4px either side, alternating. Ground #ebe8f2, prints #5b5470, button #2a2638 with #f4f1fb text." },
    { id: "bird", label: "Bird", prompt: "A bird: three forward toes and a back toe drawn as strokes, 13px; a hop every 260ms, 30px stride, 13px out, both feet landing together 5px apart, with no dust. Ground #e3eef1, prints #3c6672, button #173d46 with #eef8fa text." },
  ],
  preview: { bg: "#f3ead9", mode: "center", height: 360 },
};
