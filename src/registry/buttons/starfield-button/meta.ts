import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "starfield-button",
  name: "Starfield Button",
  category: "buttons",
  description: "A night-sky pill with a faint dust of stars on its face. Point at it and stars blink on just outside its edge, nearest first, then fine lines join them into a constellation that slowly drifts round; a press sends a shooting star across the face.",
  tags: ["button", "hover", "stars", "constellation", "night", "space", "sky", "edge", "svg", "playful"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["StarfieldButton.tsx", "starfield-button.css", "stars.ts", "perimeter.ts"],
  dependencies: [],
  // "night sky" describes the look, not the option.
  promptAllow: ["night"],
  prompt:
    "Build a night-sky pill button that gathers a constellation round its edge. Props: children, palette {star, bright, line, face, label}, count (18), onClick and type.\n\nGeometry (pure functions): the outline of a w × h rounded rectangle with radius h/2, walked clockwise, with the point and outward normal at any distance and the distance nearest to a point.\n\nThe sky: place `count` stars round the outline, unevenly — each slot's position jittered by a seeded random — each pushed 9–24px out along the normal, with a radius of 1.1–2.7px; about a quarter are bright, drawn in the bright colour with a soft halo and a thin four-point spike. Join neighbours round the outline with 0.7px lines, skipping roughly a quarter of the joins so it reads as a figure rather than a fence.\n\nOn pointerenter, find where the pointer crossed the edge; reveal the stars in order of their distance round the outline from that point (60–580ms), each blinking up to 1.8× and settling, then twinkling forever at its own pace; draw each line in by dash offset after both its stars are lit. The whole constellation then rocks slowly ±5° round the button's centre over 14s. On leave it fades out with a slight blur. Keyboard focus reveals it from the top centre; touch reveals it on press for 2.6s.\n\nThe button: a 52px pill in the face colour, warmed at the bottom by a radial tint of the bright colour, a hairline rim, a faint dust of six tiny stars on the face, and a soft glow on hover. Pressing sends a shooting star — a short gradient streak — across the face at a slight angle. Everything lives in an aria-hidden SVG overlay with pointer-events none. Reduced motion: the finished constellation fades in, without blinking, twinkling, rocking or shooting stars.",
  interaction: "Point at the button and a constellation gathers round it from where you came in; press for a shooting star. Keyboard focus reveals it too.",
  animation: "Stars blink on over about 0.6s, lines draw in after them, everything twinkles and rocks slowly; the shooting star crosses in 520ms. Reduced motion shows a still constellation.",
  a11y: "A real button with its text label; the sky is decorative SVG in an aria-hidden overlay with pointer-events none.",
  responsive: "The button keeps its size; leave about 32px of room around it.",
  touchFallback: "A press shows the constellation for 2.6s and fires a shooting star.",
  variants: [
    { id: "night", label: "Night", prompt: "Deep navy: face #141846 with #f4f1ff label, white stars #f4f1ff, gold bright stars #ffd88a, lilac lines at 50%, on a #080a1c ground." },
    { id: "dusk", label: "Dusk", prompt: "Plum dusk: face #3a1846 with #fff1f8 label, pale pink stars #ffe9f4, rose bright stars #ff9fd0, pink lines at 50%, on a #1c0f24 ground." },
  ],
  preview: { bg: "#080a1c", mode: "center", height: 360 },
};
