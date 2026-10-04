import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "loom",
  name: "Loom",
  category: "backgrounds",
  description: "A curtain of hanging threads swaying on a slow breeze, parting around your cursor like a hand through beads.",
  tags: ["background", "canvas", "threads", "cursor", "physics", "textile"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["Loom.tsx"],
  dependencies: [],
  prompt: `Create a background of fine vertical threads, like the warp on a loom or a beaded curtain seen in the dark. Every 9px, draw a thread from the top of the section to the bottom as a 28-segment polyline in one of a few low-opacity colours from the theme's thread list, cycled so the curtain has a woven rhythm.

Threads hang from the top: a slow breeze sways them with two travelling sines whose amplitude grows toward the bottom (fixed at the top, free at the hem), each thread slightly out of phase, so the whole curtain ripples gently.

The cursor parts them. Every point on every thread has its own horizontal spring (stiffness 0.06, damping 0.82). Points within ~130px of the pointer are pushed sideways away from it with a squared falloff, more strongly toward the hem, so moving through the curtain opens a soft lens-shaped gap that closes behind you as the threads drift back into line on their own springs. Render at ~30fps with Canvas 2D, pause offscreen, cap DPR at 2, and draw a still curtain under reduced motion. Take the thread colours and ground colour as props.`,
  interaction: "The pointer pushes nearby thread points aside; they spring back when it passes.",
  animation: "Breeze sway continuous; per-point springs (k 0.06, damping 0.82); ~30fps.",
  a11y: "Canvas is aria-hidden; reduced motion draws a still curtain with no tracking.",
  responsive: "Thread count follows container width; spacing and reach are props.",
  touchFallback: "Touch moves still part the threads where pointer events fire; otherwise the breeze carries it.",
  variants: [
    { id: "frost", label: "Frost", prompt: "Threads in cream and frost blue at 8–20% opacity with an occasional lilac thread at 30% (rgba(239,232,220,.12), rgba(185,204,228,.2), rgba(239,232,220,.08), rgba(185,204,228,.14), rgba(200,185,234,.3)) on #0a080c." },
    { id: "ember", label: "Ember", prompt: "Threads in amber, cream and burnt orange (rgba(243,180,95,.16), rgba(239,232,220,.1), rgba(224,122,61,.22), rgba(239,232,220,.07)) on a warm black #0c0907, like firelight on a curtain." },
    { id: "linen", label: "Linen", prompt: "Inverted: dark plum threads at 10–18% with a dusty-blue accent thread (rgba(42,24,48,.18), rgba(42,24,48,.1), rgba(126,147,174,.3), rgba(42,24,48,.14)) on linen #ece4d6; the label pill uses dark ink on a translucent linen chip." },
  ],
  preview: { bg: "#0a080c", mode: "fill" },
};
