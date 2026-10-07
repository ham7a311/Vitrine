import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "call-pill",
  name: "Call Pill",
  category: "buttons",
  description: "A bright booking button: an ice-white glass pill with cool blue mist at one end, led by a breathing availability dot or a phone that rings on hover; the mist drifts across as you point at it.",
  tags: ["button", "cta", "booking", "call", "frosted", "glass", "blue", "pill", "phone"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["CallPill.tsx", "mist.ts", "call-pill.css"],
  dependencies: [],
  prompt: `Build a large booking button for a navy page (React + CSS, no libraries): an ice-white glass pill with soft blue mist gathered at one end and a leading mark before the label.

Geometry in em: min-width 14.6em, height 3.95em, padding 0 1.7em, fully rounded, default font-size 22px. Label "Schedule a Call" at 1.18em in Inter 500, letter-spacing −0.012em, colour #13235a; the mark sits 0.75em before it.

Surface: base #e4f7fd; a crisp white rim (inset 0.07em), an inner top highlight, a faint inner blue shade at the bottom, and a soft dark drop shadow (0 0.35em 0.9em −0.2em, navy-black at 55%). Inside, a clipped mist layer (inset −12%, blur 0.7em) of six elliptical blobs placed by centre and size in percent: azure #1f97f2 at 12% (34×180), sky #56b8f7 at 28% high, aqua #6fe6fb at 42% (40×170), bright aqua #8ff1fc at 54% low, ice #c9f6fd at 64% high, and a near-white #f1fcff field at 88% that keeps the far end bright. Mirror the x positions to put the mist on the right. Each blob breathes on a 7–11s alternate loop.

Hover: the whole mist slides 22% of the pill toward the other end (eased 0.9s), the pill lifts a hair and the shadow deepens; press scales to 0.98. The status dot is a 0.62em navy disc with a ping ring that grows to 2.4× and fades every 2.4s. The phone is a 1.7-stroke line handset (1.25em); on hover two small sound arcs appear and it rings (rotate −14°/+12° twice over 0.9s). Focus-visible draws a white outline offset 0.22em. Reduced motion stops the breathing, the ping and the ring. Props: mark ("dot" | "phone"), side ("left" | "right", defaults to left for the dot and right for the phone), size, plus native button props.`,
  interaction: "Hover drifts the blue mist toward the other end and lifts the pill; with the phone mark it also rings. Press scales down slightly. Works as a native button.",
  animation: "Mist blobs breathe on 7–11s loops; the hover drift eases over 0.9s; the dot pings every 2.4s; the phone rings over 0.9s.",
  a11y: "A native button named by its visible label; the dot, phone and mist are aria-hidden. Navy text on the pale glass is above 10:1. White focus outline for the navy page. Reduced motion stops every loop.",
  responsive: "Sized in em from one font-size; at 22px it is about 312px wide and fits a 360px phone.",
  touchFallback: "No hover on touch; the dot keeps breathing and press feedback still shows.",
  promptAllow: ["dot", "phone"],
  isNew: true,
  variants: [
    { id: "dot", label: "Dot", prompt: "Lead with the breathing navy availability dot and keep the blue mist gathered on the left, the right end bright white." },
    { id: "phone", label: "Phone", prompt: "Lead with the line handset that rings on hover and gather the blue mist on the right, the left end bright white." },
  ],
  preview: { bg: "#0b2351", mode: "center", height: 260 },
};
