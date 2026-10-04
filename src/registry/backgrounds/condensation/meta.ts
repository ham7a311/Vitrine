import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "condensation",
  name: "Condensation",
  category: "backgrounds",
  description: "A misted window over blurred lights: drops gather, run down the glass and clear a trail that slowly fogs over, and your pointer wipes a streak you can see through.",
  tags: ["background", "rain", "glass", "window", "canvas", "weather", "night", "atmosphere"],
  traits: ["canvas", "cursor", "touch", "ambient"],
  source: "original",
  files: ["Condensation.tsx"],
  dependencies: [],
  prompt:
    "Paint a window in Canvas 2D. Behind it, a scene of out-of-focus lights: a three-stop gradient and soft radial bokeh discs, denser and larger toward the street. Render that scene twice from one base canvas: a lightly blurred 'clear glass' copy and a heavily blurred 'fogged glass' copy with a pale haze and thousands of tiny condensation beads. Blur by drawing small and scaling back up, so it works without canvas filters.\n\nA mask canvas records where the glass is clear. Each frame: draw the fogged copy, then the clear copy through the mask (destination-in), then the drops. The mask fades a little every frame (destination-out), so cleared glass mists over again in about nine seconds.\n\nDrops appear at random, sit still and gather moisture; once heavy enough they let go and run down with acceleration and a slight sideways wobble, clearing a trail behind them, leaving tiny droplets in it and swallowing the still drops they pass (combining radii). Each drop is a lens: clipped to an ellipse, it shows a wider patch of the clear scene flipped upside down, with a dark rim and a small highlight. Moving the pointer (or dragging on touch) wipes a soft 24px streak. Cap DPR at 1.5, pause offscreen; reduced motion shows a still pane that can still be wiped.",
  interaction: "Move the pointer over the glass to wipe it clear; on touch, drag. Cleared glass mists over again.",
  animation: "Drops run with gravity and wobble; trails and wipes re-mist over about 9s. Everything runs on one requestAnimationFrame loop paused offscreen.",
  a11y: "Decorative canvas (aria-hidden); anything placed on it stays real text. Reduced motion stops the rain and the re-misting; wiping still works because it only moves when you do.",
  responsive: "Regenerates the scene and drops for its size on resize; drop and light counts scale with area.",
  touchFallback: "Drag a finger across the glass to wipe it; vertical page scrolling still works.",
  variants: [
    { id: "night", label: "City at night", prompt: "scene=\"night\": a city at night behind the glass — sky gradient #0a0e1d → #1a1530 → #2a1a2a, bokeh lights in amber, coral, warm white and teal (#ffb45c, #ff6a4d, #fff0d2, #5fc8d6, #ffd27a, #ff8f6b) with a city skyline, haze rgba(190,200,222,.16), beads at 22% white. Overlay type in cream." },
    { id: "morning", label: "Morning", prompt: "scene=\"morning\": a garden in soft daylight behind the glass — pale sage-grey sky (#c9d6df → #dfe4dc → #b9c7b1), lights in whites and greens (#ffffff, #e8f0d8, #9fb88f, #6f8f72, #f6e7c8, #c4d7e6), no city, a brighter haze rgba(240,244,246,.3) and 50% white beads. Overlay type in dark green-black (#1d2620)." },
  ],
  preview: { bg: "#0a0e1d", mode: "fill" },
};
