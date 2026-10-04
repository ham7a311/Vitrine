import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "image-compare",
  name: "Image Compare",
  category: "media",
  description: "Two pictures of the same object in one frame, split by a jelly line that bows when you drag fast and wobbles back straight.",
  tags: ["compare", "before after", "slider", "image", "x-ray", "svg", "spring", "drag"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["ImageCompare.tsx", "image-compare.css", "CameraArt.tsx"],
  dependencies: [],
  prompt: `Build a before/after image comparison whose divider behaves like jelly. Both pictures are the same scene at the same size, stacked in one 8:5 frame (18px radius, deep shadow); the left picture is clipped to the left of the divider.

The knob sets x. The divider's ends chase it on a soft spring integrated every frame — v += ((x − e)·620 − v·44)·dt, e += v·dt (slightly under-damped, so it overshoots once) — and the curve is a quadratic from (e, 0) to (e, h) whose control point is 2x − e, so the middle always passes through the knob. The left picture is cut along exactly that curve with clip-path: path("M0 0 L e 0 Q (2x−e) h/2 e h L0 h Z"), and an SVG path draws the same curve as a 2px seam with a soft shadow. The loop stops once the ends settle.

Pointer down anywhere jumps the knob there and drags it (pointer capture; touch-action pan-y so vertical scrolling still works). The knob is a 44px round handle with ⟨ ⟩ chevrons that grows slightly while hovered or dragged, and two frosted mono pills label the sides. The demo pictures are one illustrated camera drawn twice from the same SVG geometry — a colour product shot and a second "inside" render that shows the battery, board, shutter and sensor — so the halves line up exactly.`,
  interaction: "Drag anywhere in the frame (or click to jump) to move the divider; fast moves bow the line and it springs straight.",
  animation: "Divider ends: spring k 620, damping 44, integrated per frame with dt; knob scale 200ms.",
  a11y: "The knob is a role=\"slider\" (0–100) labelled with both sides, with arrows (Shift ×5), Page Up/Down, Home and End. Reduced motion moves the line rigidly with no spring.",
  responsive: "Keeps its 8:5 aspect at any width; the clip path is rebuilt from measured size on resize.",
  touchFallback: "Touch drags move the divider horizontally while vertical swipes still scroll the page.",
  variants: [
    { id: "xray", label: "X-ray", prompt: "Inside render as an x-ray: near-black navy (#03070f) with glowing pale blue-white lines (#dff1ff) and a blue glow (#6fb6ff) through a blur-and-merge filter; seam and knob in #e8f4ff; left label \"X-ray\"." },
    { id: "night", label: "Night vision", prompt: "Inside render as night vision: green-black (#020a03) with phosphor-green lines (#c6ffb8) and a bright green glow (#39ff6a); seam and knob in #c6ffb8; left label \"Night vision\"." },
    { id: "blueprint", label: "Blueprint", prompt: "Inside render as a blueprint: blueprint blue (#123d7a) with a faint 20px grid and crisp white linework (no glow); seam and knob white; left label \"Blueprint\"." },
  ],
  preview: { bg: "#0b0f17", mode: "fill", height: 620 },
};
