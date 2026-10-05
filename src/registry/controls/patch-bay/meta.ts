import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "patch-bay",
  name: "Patch Bay",
  category: "controls",
  description: "Routing drawn as cables between jacks. Drag from a source and the cable hangs with real slack (a solved catenary, not a bezier guess); a destination that can't take the signal refuses the plug and says why; click a cable to pull it. Fully usable from the keyboard, with the patch also listed as a table.",
  tags: ["routing", "connections", "cables", "node", "mapping", "integration", "controls"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["PatchBay.tsx", "patch-bay.css", "patch.ts"],
  dependencies: [],
  prompt:
    "Build a patch bay for routing signals (a fictional 'Masar studio routing'). Outputs are { id, name, type } (Signup form → JSON, Studio camera → video, Desk mic → audio, Humidity sensor → number, Docs export → text); inputs are { id, name, accepts[] } (Webhook: JSON; Recorder: video, audio; Dashboard chart: number; Search index: text, JSON; Speakers: audio). Cables are { from, to }; an input holds one cable, an output can feed many.\n\nLayout: a 14px-radius panel in Geist. The rack is a three-column grid: source rows on the left (name plus the type in its cable colour), an empty middle for cables, destination rows on the right (name plus what it accepts in mono). Each row is a white tab with a 24px jack on its inner edge: a dark socket with a 4px ring, coloured by the plugged signal. Cables are drawn in an SVG overlay: a 5px coloured line with a soft offset shadow, hanging as a true catenary for a cable 22% longer than the gap (solve 2a·sinh(h/2a) = √(L²−v²) by bisection, sample 28 points). When a cable is plugged in it swings once and settles (slack oscillating and decaying over a second).\n\nWhile carrying a cable, compatible destinations glow green and the rest dim; dropping on an incompatible one shakes the row and shows a red note under it: 'Webhook expects JSON, not video'. Hovering a cable dashes it; clicking pulls it. A collapsible table lists the connections with Unplug buttons.",
  interaction:
    "Drag from a source jack to a destination, or click a source and then a destination. Keyboard: Enter on a source picks up its cable and moves focus to the first compatible destination; ↑/↓ walk the jacks in a column; Enter plugs (or announces the refusal); Escape puts the cable down and returns focus. On a plugged destination, Enter or Delete unplugs.",
  animation: "Plugging in swings the cable once and lets it settle; a refusal shakes the destination row. Both are skipped with reduced motion.",
  a11y: "Jacks are buttons whose labels say what they carry or take, what is plugged in, and, while carrying a cable, whether this destination will take it. Every change is announced politely. The connections table gives the whole patch without the drawing.",
  responsive: "Columns and padding tighten below 560px; the cable area keeps at least 3.5rem. Cable geometry is re-measured on every resize.",
  touchFallback: "Tap a source then a destination; drag also works with touch.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#dedcd5", mode: "fill", frame: [1100, 640] },
  isNew: true,
};
