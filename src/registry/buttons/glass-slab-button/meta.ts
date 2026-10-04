import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "glass-slab-button",
  "name": "Glass Slab Button",
  "category": "buttons",
  "description": "A button made like a thick glass tile: its bevel's bright line turns to face the pointer, a soft beam slides through the glass, and pressing sinks the slab.",
  "tags": [
    "button",
    "glass",
    "neon",
    "bevel",
    "hover",
    "cursor",
    "dark",
    "premium"
  ],
  "traits": [
    "hover",
    "cursor",
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "GlassSlabButton.tsx",
    "glass-slab-button.css"
  ],
  "dependencies": [],
  "prompt": "Build a button that looks like a thick tile of dark glass (60px tall, 16px radius): a near-black face with a faint glow of the glow colour from the top, a top inner highlight, a dark inner shadow at the bottom and a coloured drop glow. The bevel is a 1.5px ring made with a pseudo-element masked to its border (content-box exclude); its fill is a conic gradient bright in the glow colour (whitening at the peak) over about 60°, transparent elsewhere, rotated by a registered --a angle that points at the pointer (atan2 from the button's centre, converted to conic's zero at top), transitioning over 380ms — so the lit edge swings round to face you, the way light catches the bevel of real glass. On hover a soft diagonal beam (blurred 105° band in the glow colour) appears inside the glass and slides with the pointer's x. The label has a faint glow. Pressing sinks the slab 1px with a deeper inset shadow. Glow colour is a prop.",
  "interaction": "Move across it and the lit edge turns to face the pointer while a beam slides through; press to sink it.",
  "animation": "Rim angle 380ms (registered @property); beam 200–300ms; press 140ms.",
  "a11y": "A real button; keyboard focus lights the full rim and shows a ring in the glow colour. Reduced motion removes the transitions.",
  "responsive": "Sized by its label; works at any width.",
  "touchFallback": "Taps work normally; pointer-only effects are skipped on touch.",
  "variants": [
    { "id": "violet", "label": "Violet", "prompt": "glow=\"#c25cff\": neon violet bevel, beam and drop glow on a violet-black page (#07040e)." },
    { "id": "ice", "label": "Ice", "prompt": "glow=\"#7fd8ff\": icy cyan bevel, beam and drop glow on a blue-black page (#03070d)." }
  ],
  "preview": {
    "bg": "#0d0d0f",
    "mode": "center"
  },
};
