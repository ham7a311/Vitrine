import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "yarn-wrap",
  name: "Yarn Wrap",
  category: "buttons",
  description: "Point at the button and a ball of yarn rolls round it from where you came in, unwinding as it goes and leaving the thread wrapped round the pill in loose laps that cross each other; the ball shrinks as it pays out. Leave and it winds itself back up. Press to make the ball hop.",
  tags: ["button", "hover", "yarn", "knitting", "craft", "thread", "svg", "playful", "edge", "cosy"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["YarnWrap.tsx", "yarn-wrap.css", "yarn.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that a ball of yarn wraps itself round. Props: children, yarn (one of three yarns), onClick, type and motion.\n\nGeometry (pure functions): the pill outline walked by distance with its tangent and outward normal, the distance nearest a point, and a coil — 2.3 laps round the outline from the entry point in the direction the pointer was moving, sampled every 3px, each sample pushed out from the edge by 7 + 4·sin(2π·3.3t/L) + 2·sin(2π·7.1t/L + 1) px so the laps drift in and out and cross each other. Plus running lengths along a polyline and the point (with direction) at any distance along it.\n\nAn SVG overlay 34px round the button, pointer-events none, draws the coil twice through a mask: a 2.6px round-capped stroke in the yarn colour with a faint shadow, and a lighter 1.1px dashed strand (1.6 2.4) on top for the twist of the plies. The mask is the same path as an 8px white stroke whose dash offset reveals it. A ball rides the head of the revealed thread: a circle with five curved strand lines, rolling — rotated by distance travelled over its radius — and shrinking from 11px to 6px as it pays out.\n\nProgress runs on requestAnimationFrame: towards 1 on hover at about 0.6/s, slowing as it fills, and back to 0 at 1.5/s on leave, so the yarn winds itself up quicker than it came out; the ball fades when it's home. Pressing makes the ball hop 10px on a sine. Keyboard focus wraps from the top centre; touch wraps on press for 2.4s. Reduced motion jumps straight to wrapped or unwrapped.\n\nThe button: a 54px pill in a deep colour with a light label and a 1px lift on hover.",
  interaction: "Point at the button to wrap it in yarn; leave to wind it back; press to make the ball hop. Keyboard focus wraps it too.",
  animation: "The thread pays out over about two seconds and winds back in under one; the ball rolls and shrinks with it. Reduced motion skips the movement.",
  a11y: "A real button with its text label; the yarn is decorative SVG, hidden and pointer-transparent.",
  responsive: "Leave about 34px of room round the button.",
  touchFallback: "A press wraps the button for a couple of seconds.",
  variants: [
    { id: "wool", label: "Wool", prompt: "Tomato-red wool #c8432f with a peach twist #f19a7f round a dark brown #2c2420 button, on oatmeal #f2e8dc." },
    { id: "cotton", label: "Cotton", prompt: "Undyed cotton #f3ead8 with a fawn twist round a navy #24324a button, on slate blue #7d8fa8." },
    { id: "neon", label: "Neon", prompt: "Hot pink acrylic #ff3ea5 with a pale pink twist round a near-black #151320 button, on deep violet #2a2440." },
  ],
  preview: { bg: "#f2e8dc", mode: "center", height: 300 },
};
