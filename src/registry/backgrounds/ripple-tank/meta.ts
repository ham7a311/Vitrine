import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ripple-tank",
  name: "Ripple Tank",
  category: "backgrounds",
  description: "A shallow tank of water running a real wave equation: move across it to leave a wake, click to drop a stone, and every ring spreads, reflects and bends the tiled floor from exactly where it started.",
  tags: ["background", "webgl", "water", "ripple", "simulation", "physics", "interactive"],
  traits: ["webgl", "cursor", "click", "ambient"],
  source: "original",
  files: ["RippleTank.tsx"],
  dependencies: [],
  prompt: `Build an interactive water background from a real 2D wave equation.

Simulation (CPU): a heightfield grid at one cell per 5 CSS px, two Float32Arrays swapped each step, a Verlet step next = (2h − previous + 0.3 × L) × 0.993, where L is the isotropic 9-point Laplacian (4 × edges + corners − 20h) / 6 so rings stay round. Step at a fixed 8ms rate (catching up at most 5 steps a frame) so waves travel at the same speed on any display. Disturbances push a Gaussian disc down: the pointer leaves a wake along its path (samples every 1.5 cells, amplitude growing with speed), a click drops a stone (radius 2.6, amplitude 2.2), and when idle a small raindrop falls every 0.65–1.55s. Edges are fixed at zero, so rings reflect.

Rendering (WebGL1): upload the heightfield each frame as a 16-bit value split across a LUMINANCE_ALPHA texture (high byte, low byte — 8 bits alone shows as grid noise in the shading) with LINEAR filtering, so a coarse grid renders smoothly at full resolution. In the fragment shader take central differences for the slope and a Laplacian for curvature. Draw a tile grid on the floor, displaced by the slope (refraction); brighten where the surface curves inward (light focusing) and darken where it spreads; add a specular highlight from a fixed light. Vignette and dither.

Pause entirely offscreen or in a hidden tab. Under reduced motion, place three stones, advance 150 steps and draw one still frame. Colours are a prop [deep, floor, tile, highlight]; a light flag inverts the caustic shading so troughs darken instead of brighten on light grounds.`,
  interaction: "Move across the surface to leave a wake; click or tap to drop a stone. Raindrops fall while you're idle.",
  animation: "Wave equation at 125 steps/s with 0.993 damping; rings take about 3s to die away.",
  a11y: "The canvas is aria-hidden and decorative, with content above it. Reduced motion shows one still frame of settled rings.",
  responsive: "The grid follows the container size at 5px cells; rendering is capped at 1× DPR (0.75× on touch).",
  touchFallback: "Tap to drop a stone; dragging leaves a wake until the browser takes over the scroll.",
  variants: [
    { id: "ink", label: "Ink", prompt: "Colours [#05070b, #0f1724, #2a3a52, #cfe0ff], light=false: dark ink water with pale blue highlights." },
    { id: "pool", label: "Pool", prompt: "Colours [#06363d, #0e6b72, #7fd1c4, #f2fffb], light=false: a teal swimming pool with mint tiles and white highlights." },
    { id: "paper", label: "Paper", prompt: "Colours [#e8e2d6, #f6f2ea, #c9bfae, #ffffff], light=true: water on cream paper, where troughs read as darker shading instead of light; hint text dark at 45%." },
  ],
  preview: { bg: "#05070b", mode: "fill" },
};
