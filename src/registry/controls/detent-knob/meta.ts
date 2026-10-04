import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "detent-knob",
  name: "Detent Knob",
  category: "controls",
  description: "A machined knob from good studio gear: drag round the rim or up and down, scroll, or use the keys; it clicks through detents with a tiny tick while a ring of 31 lights fills to the value and a small display reads it out. The light on the brushed metal stays put while the knurled body turns.",
  tags: ["knob", "dial", "slider", "rotary", "skeuomorphic", "audio", "volume", "hardware"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["DetentKnob.tsx", "detent-knob.css"],
  dependencies: [],
  prompt: `Build a rotary knob control (role="slider", focusable, aria-valuenow/min/max and valuetext like "62%") on a hardware panel.

Look: a rounded panel with a soft top sheen. A 168px knob sits in a dark seat with a deep shadow. Its body — a knurled rim (repeating-conic-gradient teeth every 2°, masked to the outer 20%) and a glowing indicator line — rotates through 270° (−135° … +135°); its top face does not rotate, so the light stays still as the knob turns. Around it, 31 LED dots on the same 270° arc at radius 112px: dots up to the value glow (a gradient from the low to the high colour), the head dot is white-hot, the rest are dull sockets. Under it, an LCD readout with a small label and tabular mono digits with a glow. Min and max labels at the ends.

Input: pointer down on the outer ring turns by angle (unwrapped atan2 deltas, 270° = the full range); near the centre, dragging up and down lifts it (220px = full range); pointer capture; touch-action none. Wheel ±1 step (Shift ×5) without scrolling the page. Keys: arrows ±step, PageUp/PageDown ±10%, Home/End. Double-click resets. Values snap to the step; each new step plays a 90ms scale(0.985) tick on the knob (WAAPI). Controlled or uncontrolled, with onChange. Reduced motion drops the transitions and the tick.`,
  interaction: "Drag round the rim or up and down near the centre, scroll over it, or focus it and use the arrows, Page keys, Home and End. Double-click resets.",
  animation: "Body turns with a 90ms ease; a 90ms detent tick per step; LEDs fade in 120ms.",
  a11y: "A real slider role with value text, a visible focus ring and the full keyboard set; the hint text describes the gestures.",
  responsive: "Fixed physical size (like hardware); the panel sits centred and fits a 320px screen.",
  touchFallback: "Drag on the knob with a finger; touch-action none keeps the page from scrolling under it.",
  variants: [
    { id: "studio", label: "Studio", prompt: "theme=\"studio\": a graphite panel on #0b0b0d, a brushed-aluminium top face (fine repeating-radial rings over a conic metal sheen), amber LEDs; label \"Volume\", default 62." },
    { id: "bakelite", label: "Bakelite", prompt: "theme=\"bakelite\": a cream panel on #cdbf9f, a domed black bakelite knob with a soft highlight and a brass knurl, red LEDs and a green LCD; label \"Volume\", default 62." },
  ],
  preview: { bg: "#0b0b0d", mode: "fill" },
};
