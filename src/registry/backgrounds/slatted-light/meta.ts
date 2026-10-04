import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "slatted-light",
  name: "Slatted Light",
  category: "backgrounds",
  description: "Late light through window slats — blurred shafts across a dark room, a pattern on the floor, dust drifting in the beams.",
  tags: ["background", "css-only", "light", "atmosphere", "ambient", "warm"],
  traits: ["ambient"],
  source: "original",
  files: ["SlattedLight.tsx", "slatted-light.css"],
  dependencies: [],
  prompt: `Create an atmospheric, CSS-only background of low sun entering a dark room through window slats. Keep it spatial rather than decorative: there is a source, a volume of air, and a floor.

The source: a large blurred glow just off the top-left corner that breathes very slightly. The shafts: a repeating linear gradient of alternating wide and narrow warm bands (the gaps between slats) at the beam angle, rotated and skewed, then masked with a linear gradient so the beams are strongest near the window and dissolve across the room. Blur them (5px) and screen-blend; duplicate the layer with a heavy 22px blur for volumetric haze. Both layers sway over 19s and 27s in opposite directions — a few degrees and 40px — as if the blinds breathe.

Where the light lands, add a floor plane: a repeating stripe pattern put into perspective (rotateX ~58°), skewed to match the beams, masked into a soft pool, drifting in sync with the shafts. Finally, a dozen hand-placed dust motes drift slowly up through the beams and twinkle in and out, plus a whisper of film grain. Take the light colour, room colour and beam angle as props. Under reduced motion everything holds still and the motes are removed.`,
  interaction: "None — ambient.",
  animation: "Beams sway 19s/27s alternate; floor drifts 19s; source breathes 14s; motes drift 17–26s with twinkle.",
  a11y: "Entirely decorative and aria-hidden. Reduced motion freezes the scene and removes motes. Put text on the darker right/bottom side for contrast.",
  responsive: "Percentage-based layers scale to any container; beam angle and colours are props.",
  variants: [
    { id: "afternoon", label: "Afternoon", prompt: "Afternoon: warm cream light (#f1e3c8) in a near-black plum room (#0b080d), beams at 24°." },
    { id: "moonlight", label: "Moonlight", prompt: "Moonlight: cool blue-white light (#c9d8f0) in a blue-black room (#06080d), steeper beams at 32°." },
    { id: "dusk", label: "Dusk", prompt: "Dusk: low rose-peach light (#f0b8a0) in a red-black room (#0d0709), shallow beams at 18°." },
  ],
  preview: { bg: "#0b080d", mode: "fill" },
};
