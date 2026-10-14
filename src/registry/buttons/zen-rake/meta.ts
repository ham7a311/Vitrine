import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "zen-rake",
  name: "Zen Rake",
  category: "buttons",
  description: "The button is a stone set in a raked gravel garden. Point at it and a rake draws six grooves round it, spreading both ways from where you came in; the lines part round your pointer like gravel round a stone, and a press sets a pebble down that the grooves swerve round. Leave and the gravel smooths over.",
  tags: ["button", "hover", "zen", "garden", "calm", "meditation", "canvas", "texture", "edge", "mindful"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  promptAllow: ["sand", "ash"],
  isNew: true,
  files: ["ZenRake.tsx", "zen-rake.css", "rake.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that sits like a stone in a raked gravel garden. Props: children, sand (light sand or dark ash), onClick, type and motion.\n\nGeometry (pure functions): the pill outline walked by distance with its outward normal, the distance nearest a point and the shortest way round; a groove — the outline pushed out by d px, sampled 200 times with each point keeping its outline distance; a bend that pushes a point away from a centre by amount·exp(−(dist/radius)²), the way gravel lines part round a stone; and whether an outline distance has been raked yet when the rake has spread a fraction of the way round both ways from the entry point.\n\nA canvas 64px round the button sits behind it (DPR ≤ 2, pointer-events none). Six grooves at 11, 19, 27, 35, 43 and 51px out. Each is drawn as a dark 2.4px trough offset (0.7, 0.9) and a light 1.3px ridge offset (−0.6, −0.7), skipping points not yet raked, so it reads as a groove pressed into gravel. While hovered the rake spreads round in under a second; the lines bend 5px away from a point 14px outside the edge nearest the pointer, over 26px. A press sets a pebble 30px out from the nearest edge point (a radial-gradient stone with a soft shadow, growing in) and every groove swerves 9px round it over 20px; up to three pebbles. On leave the grooves fade over about a second and the pebbles go with them. The loop only runs while something is changing. Keyboard focus rakes from the top centre; touch rakes on press for 2.6s. Reduced motion draws the finished grooves at once.\n\nThe button is a stone: a 56px pill with a radial grey gradient lit from the upper left, inner highlights and shadows and a short cast shadow, and a label with a slight emboss. The demo ground is gravel — a base colour with two fine dot scatters.",
  interaction: "Point at the button to rake the gravel round it; move to part the lines; press to place a pebble. Keyboard focus rakes it too.",
  animation: "Grooves spread round in about 0.9s and fade over about 1.1s on leave; pebbles grow in over 0.2s. Reduced motion shows the finished pattern.",
  a11y: "A real button with its text label; the canvas is decorative, hidden and pointer-transparent. The label keeps strong contrast on the stone.",
  responsive: "Leave about 64px of room round the button for the garden.",
  touchFallback: "A press rakes the garden and places a pebble for a couple of seconds.",
  variants: [
    { id: "sand", label: "Sand", prompt: "Warm sand gravel #e7dbc1 with brown troughs and cream ridges round a dark granite stone (#8b867d to #3d3a35) with a light label." },
    { id: "ash", label: "Ash", prompt: "Dark ash gravel #2b2a28 with black troughs and faint light ridges round a pale limestone stone (#e2ddd3 to #8f8a80) with a dark label." },
  ],
  preview: { bg: "#e7dbc1", mode: "center", height: 320 },
};
