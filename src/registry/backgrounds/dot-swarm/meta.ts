import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dot-swarm",
  name: "Dot Swarm",
  category: "backgrounds",
  description: "720 dots that sweep from one outline to the next — circle, star, Oman, heart, a V — scatter from the pointer and burst on a press.",
  tags: ["particles", "dots", "morph", "canvas", "shapes", "interactive", "physics", "background"],
  traits: ["canvas", "cursor", "click", "touch", "ambient"],
  source: "original",
  files: ["DotSwarm.tsx", "dot-swarm.css"],
  dependencies: [],
  prompt: `Build a Canvas 2D swarm of exactly 720 dots that morphs between outlines: a circle, a five-point star, the outline of Oman (from about 20 longitude/latitude points), a heart (the classic parametric curve) and a V.

Every outline is resampled by arc length into three nested contours (scale 1, 0.72 and 0.44 with 360, 230 and 130 points — 720 in all), each centred on its centroid and sorted by angle around it, so the swarm reads as layered rings of distinct dots. Changing shape only changes each dot's home — dot i moves to point i of the new outline in the same layer — and because every layer is in angle order the swarm sweeps round into the new shape instead of crossing through itself. Homes are scaled to 36% of the smaller side.

Physics per frame: the pointer pushes dots away within 18% of the smaller side with strength (1 − d/reach)²; then v = (v + (home − p)·0.05)·0.84 pulls each dot home on a damped spring. A press sends a shockwave from the press point — v += away·(1 − d/200)·30 within 200px — and moves to the next shape; with nobody touching it the shape also advances every 7 seconds. A moving dot is drawn as an ellipse stretched along its velocity (radius × s by radius ÷ √s, s = 1 + speed·0.18, capped at 4), so fast dots streak. All dots are filled in one path. On first view the dots arrive from a ring outside the frame. A mono caption names the shape (polite live region) next to a "Next shape" button.`,
  interaction: "Move through the swarm to part it; press to send a shockwave and move to the next shape, or use the Next shape button.",
  animation: "Spring 0.05 with damping 0.84; shockwave 30 within 200px; shapes advance every 7s when idle; dots streak along their velocity.",
  a11y: "The canvas is role=\"img\" with the current shape named; changes are announced politely and the Next shape button works from the keyboard. Reduced motion jumps straight to each outline with no physics.",
  responsive: "Scales the outline to the container and re-homes the dots on resize; dot size grows with the frame.",
  touchFallback: "Drag a finger through the dots to part them; tap for the shockwave and the next shape.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", height: 600 },
};
