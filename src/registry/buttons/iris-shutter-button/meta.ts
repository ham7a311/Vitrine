import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "iris-shutter-button",
  name: "Iris Shutter",
  category: "buttons",
  description: "An async button with a camera iris for a status light — blades close and turn while it works, then open onto the result.",
  tags: ["button", "loading", "async", "mechanical", "svg", "status"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["IrisShutterButton.tsx", "iris-shutter-button.css"],
  dependencies: [],
  prompt: `Design an async action button whose loading state is mechanical rather than a spinner. It's a dark plum pill (56px) with a recessed circular lens on the left and a label on the right.

Inside the lens is a working six-blade iris: each blade is a large dark rectangle clipped to the lens circle, rotated 60° from the next, and pushed toward the centre by a CSS variable (--iris-r, the aperture radius). Because six half-planes at 60° always leave a hexagon, shrinking --iris-r closes a convincing hexagonal aperture; hairline cream edges on the blades show where they overlap. A second variable twists the whole blade set as it closes, the way a real iris turns. Behind the blades sits a glassy lilac lens core.

States: idle — iris wide open, glowing lens. Press → loading — the blades close over 620ms (cubic-bezier(0.65,0,0.35,1)) and the closed iris rotates slowly. When the promise resolves → success — the iris opens onto a cooler lens with a check mark that draws itself after a beat, and the ring lights frost blue. If it rejects → error — the iris half-closes with a warm red tint, the label turns rose, and the button jolts sideways. After 1.8s it returns to idle. Labels crossfade and rise 6px, stacked in one grid cell so the button width never jumps.`,
  interaction: "Click/Enter runs the async action; state flows idle → loading → success | error → idle. Can be controlled via the state prop.",
  animation: "Blades 620ms ease-in-out; loading rotation 2.4s linear; check draw 420ms after 380ms; error jolt 420ms; label crossfade 260–360ms.",
  a11y: "A real <button> with aria-busy while loading and a polite live region announcing each state. Inactive labels are aria-hidden. The iris is decorative. Reduced motion makes transitions near-instant and removes the rotation and jolt.",
  responsive: "Intrinsic width sized to the longest label, so nothing shifts between states.",
  touchFallback: "Nothing depends on hover.",
  preview: { bg: "#0b080d", mode: "fill" },
  featured: true,
};
