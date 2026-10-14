import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "clockwork-edge",
  name: "Clockwork Edge",
  category: "buttons",
  description: "Point at the button and a train of gears rises from behind its top and bottom edges, meshing tooth into gap. They turn as one machine — each the opposite way to its neighbour at the ratio of their teeth — speeding up when you move along the button, and a press ratchets them on a tooth at a time.",
  tags: ["button", "hover", "gears", "clockwork", "mechanical", "steampunk", "svg", "edge", "brass", "machine"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  promptAllow: ["brass", "steel"],
  files: ["ClockworkEdge.tsx", "clockwork-edge.css", "gears.ts"],
  dependencies: [],
  prompt:
    "Build a pill button with working gears behind its edges. Props: children, metal (brass or steel), onClick, type and motion.\n\nGears (pure functions): a spur gear outline with module m (pitch radius m·N/2, tips at R + m, roots at R − 1.25m) — trapezoid teeth with tooth 0 along +x — and a hub hole cut out with even-odd fill. A chain lays gears of given tooth counts in a row: each centre at a height that depends on its radius, placed so its pitch circle touches the previous one. Each gear's angle is k·φ + C for the driver's angle φ: k alternates sign and scales by the tooth ratio (k_i = −(N_{i−1}/N_i)·k_{i−1}), and C makes a gap face each neighbour's tooth where they meet: C_i = −q·C_{i−1} + α + π − π/N_i + q·α, with q = N_{i−1}/N_i and α the direction from the previous centre.\n\nAn SVG overlay 36px round the button sits behind it (z-index −1, pointer-events none). Two trains with module 2.2: one along the top, centres 12% of their radius above the edge so they peek over it; one along the bottom turning the other way, both kept within the straight part of the pill. Each gear is filled with a metal gradient, edged darker with a soft shadow, with a groove ring and a centre pin. On hover they rise out from behind the edge (520ms, springy, 28ms apart) and the driver eases up to 0.7 rad/s; moving the pointer sideways adds speed in that direction, which decays. Pressing ratchets them — quick steps with pauses, about a tooth at a time for 0.66s. Every frame sets each gear's rotation from φ directly; the loop stops when they come to rest after leaving, as they sink back behind the button. Keyboard focus starts them; touch runs them for 2.6s. Reduced motion shows them still.\n\nThe button: a 54px dark pill with a metal ring inset and a light label.",
  interaction: "Point at the button to bring the gears out and turning; move along it to drive them faster; press to ratchet them on. Keyboard focus starts them too.",
  animation: "Gears rise in 520ms with an overshoot and turn at 0.7 rad/s at the driver, faster with pointer movement; the ratchet steps for 0.66s. Reduced motion keeps them still.",
  a11y: "A real button with its text label; the gears are decorative SVG, hidden and pointer-transparent.",
  responsive: "The trains fill whatever width the button has; leave about 36px above and below.",
  touchFallback: "A press brings the gears out and ratchets them for a couple of seconds.",
  variants: [
    { id: "brass", label: "Brass", prompt: "Brass gears (#f0c66a to #9c6a1f, edges #5c3c0e) round a dark walnut #2a1912 button with a brass ring and a cream label, on a deep brown vignette." },
    { id: "steel", label: "Steel", prompt: "Steel gears (#e4e9ee to #7f8a96, edges #3c444d) round a charcoal #1b1f24 button with a steel ring, on light grey #d9dde2." },
  ],
  preview: { bg: "#2d1f15", mode: "center", height: 300 },
};
