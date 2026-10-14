import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "domino-run",
  name: "Domino Run",
  category: "buttons",
  description: "Point at the button and a ring of dominoes is set up round it, one after another from where you came in. Leave — or press — and the first one tips: the whole ring goes down in a chain that speeds up as it travels, each tile coming to rest on the next, the last one lying flat.",
  tags: ["button", "hover", "dominoes", "chain reaction", "game", "playful", "edge", "satisfying", "css"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["DominoRun.tsx", "domino-run.css", "domino.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that dominoes are stood round and knocked down. Props: children, set (one of three tile styles), onClick and type.\n\nGeometry (pure functions): the pill outline walked by distance with its tangent and outward normal, and the distance nearest a point. A ring of tiles every 11px round the outline from the entry point, in the direction the pointer was travelling along the edge, each standing 3px outside it with its face turned outward (rotated so local up is the outward normal, so local +x runs along the outline). The lean of a fallen tile resting on the next is asin(spacing / height) — about 47° for 11px spacing and 15px tiles — and the last lies flat at 90°. The chain's timing speeds up: the first gap is 70ms and each one is 3.5% shorter, down to 26ms.\n\nEach tile is an 8 × 15px rounded rect with a hairline edge, a thicker darker side underneath, a soft shadow, a line across the middle and one to three pips in each half drawn with radial gradients. Tiles sit in an overlay 30px beyond the button behind it, pointer-events none. On pointerenter they're set up one by one, 16ms apart, rising from 0.6× with a small overshoot. On leave, or on press, they fall: each rotates about its bottom corner on the side it falls towards to the lean angle (190ms, ease-in like gravity) on its chain delay, and its shadow tightens; the ring clears 1.4s after the last tile lands. Keyboard focus sets them up from the top centre and blur knocks them down; on touch a press sets them up and knocks them down a second later. Reduced motion shows them up and down without animation.\n\nThe button: a 54px pill in a deep colour with a light label, a 1px lift on hover.",
  interaction: "Point at the button to set up the dominoes; leave or press to knock them down. Keyboard focus sets them up and blur knocks them over.",
  animation: "Tiles stand up 16ms apart; the fall starts with 70ms gaps that shrink 3.5% each tile, 190ms per tile. Reduced motion skips the movement.",
  a11y: "A real button with its text label; the dominoes are decorative, hidden and pointer-transparent.",
  responsive: "Leave about 30px of room round the button for the ring.",
  touchFallback: "A press sets the dominoes up and topples them a second later.",
  variants: [
    { id: "ivory", label: "Ivory", prompt: "Classic ivory tiles (#fbf6ea, side #cdbf9f) with black pips on green baize, a dark green #0f2419 button with a cream label." },
    { id: "ebony", label: "Ebony", prompt: "Black tiles (#1b1a1d) with white pips on a warm grey ground #e9e5dc, an off-white #f2efe8 button with a near-black label." },
    { id: "candy", label: "Candy", prompt: "Tiles cycling through pink #ff5a7a, amber #ffae2b, green #29b98a, blue #3d7bff and violet #a65bff with white pips, on cream #fff3e6, with a deep violet #2b1d52 button." },
  ],
  preview: { bg: "#2f6b4c", mode: "center", height: 300 },
};
