import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "storm-veil",
  name: "Storm Veil",
  category: "backgrounds",
  description: "Smoke rolling through a storm: three layers of warped noise make deep folds and drifting veils, with fine silky strands drawn along the currents. A slow eddy turns around the pointer. Comes dark or pale. A background only, with no text of its own.",
  tags: ["background", "smoke", "clouds", "storm", "turbulence", "marble", "moody", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["StormVeil.tsx", "storm-veil.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): rolling storm smoke, seen flat-on.\n\nTake the position in screen heights \u00d7 1.15 and domain-warp it twice (Inigo Quilez style): q = two fBm lookups of p drifting in opposite directions; r = two fBm lookups of p + 4q; the smoke density f = fBm(p + 3.6r). Five octaves of quintic value noise with a rotation between octaves keep it free of grid artefacts. Turn the density into cover with smoothstep(cover, cover + 0.32, f), where cover sets how much of the frame is smoke and how much is open void; mix void \u2192 body colour by it, then towards a light colour where f is highest. Draw silky strands along the currents: pow(1 \u2212 |sin((2r.x + q.y) \u00d7 14)|, 10), added faintly inside the smoke and more strongly near its thin edges.\n\nThe pointer stirs a slow eddy: rotate the position around it by up to 1.3 radians, falling off as a Gaussian. Everything drifts slowly (time \u00d7 0.035).\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer to stir a slow eddy in the smoke.",
  animation: "The folds drift and turn slowly. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The dark looks suit white text; the pale look is mid-toned, so give text a scrim or a solid panel.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No eddy on touch; the smoke keeps drifting.",
  variants: [
    { id: "midnight", label: "Midnight", prompt: "Navy smoke on near-black, mostly open void: void #010209, body #323e62, light #a3b4dd, cover 0.29." },
    { id: "overcast", label: "Overcast", prompt: "Pale steel-blue smoke filling the frame with dark navy pockets: void #0f2240, body #557ba3, light #cfe2f5, cover 0.21." },
    { id: "ash", label: "Ash", prompt: "Warm grey smoke on black: void #0a0a0b, body #625d58, light #ece6dc, cover 0.3." },
  ],
  preview: { bg: "#010209", mode: "fill", height: 600 },
};
