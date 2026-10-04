import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-torus",
  name: "Glass Torus",
  category: "heroes",
  description: "A ring of thick glass turning in front of huge type; the letters seen through it bend, flip and fringe into colour. Drag to spin it.",
  tags: ["hero", "glass", "webgl", "3d", "raymarching", "refraction", "typography", "torus"],
  traits: ["webgl", "click", "touch", "ambient"],
  source: "original",
  files: ["GlassTorus.tsx", "glass-torus.css"],
  dependencies: [],
  prompt: `Build a hero in raw WebGL1 (no libraries): huge bold type (default "GLASS / ICON", Geist 800, fitted to 86% of the width) drawn into a canvas texture behind a raymarched glass torus that turns slowly in front of it.

The torus (major radius 0.62, tube 0.21) is a signed distance field, rotated by a 3×3 matrix built from yaw, pitch and a fixed roll so it reads as a tilted ellipse; 72 sphere-tracing steps from a camera at z = 3.2. Off the ring each pixel shows the type texture directly. On the ring: compute the normal by central differences, refract the view ray with refract() three times — the index of refraction nudged down for red and up for blue by a dispersion amount — and look up the type at the screen position plus each refracted ray's x/y offset (plus a little of the normal), so the letters inside the glass shift, mirror and split into colour fringes. Multiply by the glass tint, mix in a Fresnel reflection of a soft studio (a bright strip overhead, faint side lights) with pow(1 − cosθ, 3), and add a tight specular highlight.

It turns by itself (0.45 rad/s); pointer drag spins it with inertia that decays, and the pitch eases back to a resting tilt. Rounded frosted 44px buttons: full screen at the top left, pause/play and reset at the top right. Render at 0.8× (0.55× on touch); the loop stops when the ring is paused and settled, and pauses offscreen. The type is in a visually hidden h1 too.`,
  interaction: "Drag the ring to spin it (it keeps turning, then settles back to its tilt); pause, reset or go full screen with the buttons.",
  animation: "Idle spin 0.45 rad/s; drag inertia decays to 12% per second; pitch eases back to 0.18 rad.",
  a11y: "The headline is a real h1 (visually hidden) and the canvas has a role=\"img\" description. Buttons are labelled; pause is aria-pressed. Reduced motion starts paused. Without WebGL the type is shown on its own.",
  responsive: "The type is re-fitted to the canvas on resize; the ring is sized to the height so it frames the words at any aspect.",
  touchFallback: "Drag spins the ring on touch too; vertical swipes still scroll.",
  variants: [
    { id: "smoke", label: "Smoke", prompt: "Smoked glass: tint (0.82, 0.83, 0.87), IOR 1.45, dispersion 0.03, full Fresnel reflection — a black glossy ring with bright rims; the white type behind shows through it bent and fringed." },
    { id: "clear", label: "Clear", prompt: "Clear glass: a pale blue-white tint (0.92, 0.95, 1), IOR 1.4, dispersion 0.025, 70% reflection — the type stays bright through the ring." },
    { id: "prism", label: "Prism", prompt: "Prism: untinted glass with strong dispersion (0.09), IOR 1.5, 55% reflection, over near-black type on a warm off-white page, so every edge seen through the ring splits into a rainbow." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 640 },
};
