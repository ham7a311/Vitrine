import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "rocker-switch",
  name: "Rocker Switch",
  category: "controls",
  description: "An industrial rocker in its housing: the cap tilts on its pivot, the lit half catches the light, the LED warms on — and holding it tilts it only part way.",
  tags: ["toggle", "switch", "rocker", "hardware", "skeuomorphic", "led", "css", "3d"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["RockerSwitch.tsx", "rocker-switch.css"],
  dependencies: [],
  prompt: `Build a hardware rocker switch as a <button role="switch" aria-checked> in CSS. The housing is a 64×104px dark rounded block (12px radius, a top bevel highlight, an inner shadow, a soft drop) with perspective 260px; inside it the cap is two halves — "I" on top, "O" below — on one rounded face, tilted with rotateX(−13deg) when off and rotateX(13deg) when on, on a springy cubic-bezier(0.3,1.6,0.5,1) over 180ms so it clicks over and settles.

The half that is pressed in falls into shadow (a darker gradient) while the raised half catches the light, so the tilt reads as depth even without 3D lighting. When on, the "I" glows in the LED colour with a soft text-shadow. Above the housing a 10px LED is a dull socket when off and warms on (a radial gradient into the LED colour and a glow) over 220ms; a small mono uppercase label sits below. Pointer down sets the tilt to 0deg (held halfway, with a slower, smooth transition); the switch only flips on release, so it feels like pushing a real rocker over its centre.`,
  interaction: "Click, tap, Space or Enter flips it; pressing and holding tilts the cap to its midpoint until you let go.",
  animation: "Tilt 180ms cubic-bezier(0.3,1.6,0.5,1) (260ms smooth while held); LED and lit legend 200–220ms.",
  a11y: "A real switch with aria-checked and a visible text label (also its accessible name); the legends are decorative. Focus ring in the LED colour. Reduced motion removes the transitions.",
  responsive: "Fixed physical size, like hardware; wrap several in a flex row.",
  touchFallback: "Touch press-and-hold tilts it the same way; release flips it.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0e0f11", mode: "fill", height: 420 },
};
