import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tether",
  name: "Tether",
  category: "cursors",
  description: "A name tag on a lanyard. Pick it up from its nail and it hangs from your cursor on a real rope, trailing, swinging when flung and settling like a pendulum. Click anywhere to hang it on a fresh pin; brush past it and it sways. The tag stays a real, clickable link.",
  tags: ["cursor", "physics", "rope", "verlet", "lanyard", "pendulum", "badge", "contact"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["Tether.tsx", "tether.css"],
  dependencies: [],
  prompt: `Build a cursor companion: a name tag hanging on a rope that you can carry with the pointer and hang anywhere in its host.

Physics: a 14-point Verlet rope, 9px between points, gravity 2200px/s², velocity damping 0.989, fixed 1/120s steps from an accumulator, and 10 constraint passes per step. Point 0 is pinned (inverse mass 0); the last point carries the tag and has inverse mass 0.35, so the card is heavier than the cord and pulls it straight. The tag's rotation follows the angle of the last two segments, −atan2(dx, dy), through its own spring (k 140, c 9), so it lags and over-swings slightly like a real card. The loop sleeps once the rope's kinetic energy and the tag's angular speed have been near zero for 400ms, and wakes on movement.

Modes: hung (pin at a fixed nail) and carried (pin = the pointer, written in pointermove). The nail is a real button (aria-pressed, "Pick up the name tag" / "Hang the name tag here") drawn as a brass pin head; clicking it picks the tag up. While carried, the system cursor is hidden inside the host and a small metal clip is drawn at the pointer; the button rides under the pointer, so any click hangs the tag right there (clamped inside the host); Escape hangs it in place; leaving the host hangs it at the edge. Because the pin is always where the pointer is when the mode changes, the rope never jumps. While hung, a pointer moving through the cord (within 16px of a point) or across the card nudges those points by its velocity, so brushing past makes it sway.

Drawing: the cord is an SVG path through the points with quadratic curves via the midpoints, a 4.5px round-capped band with a soft drop shadow; the card is an <a> (176px, 14px radius, layered shadow) translated to the last point with transform-origin at its top centre and a metal ring there. Coordinates are host-local and corrected for scaled hosts. Focusing the card hangs it so it can be activated. Paper (blue lanyard) and Night (orange).`,
  interaction: "Click the nail to pick the tag up and move around; click anywhere to hang it there, or press Esc. Brush past a hanging tag to make it sway; click the tag to open the link.",
  animation: "Verlet rope at 120Hz; tag rotation on a spring (k 140, c 9); nail and clip 140–180ms.",
  a11y: "The nail is a button with an aria-pressed state and a label that says what it will do; the tag is a normal link, reachable by Tab, and focusing it while carried hangs it first. The rope and clip are aria-hidden. Reduced motion hangs the cord straight with no simulation; carrying moves the tag rigidly with the pointer.",
  responsive: "The nail is placed by fractions of the host and re-placed on resize; the tag is clamped inside the host.",
  touchFallback: "On touch the tag hangs from its nail and swings when the nail is tapped; it stays a normal link.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#efebe2", mode: "fill" },
};
