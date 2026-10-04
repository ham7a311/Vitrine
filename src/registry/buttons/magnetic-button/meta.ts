import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "magnetic-button",
  "name": "Magnetic Button",
  "category": "buttons",
  "description": "A button with a pull: as the pointer comes near the pill leans toward it, the label leans further, and on leaving it springs back with a little overshoot.",
  "tags": [
    "button",
    "magnetic",
    "cursor",
    "spring",
    "cta",
    "hover",
    "physics",
    "pill"
  ],
  "traits": [
    "cursor",
    "hover",
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "MagneticButton.tsx",
    "magnetic-button.css"
  ],
  "dependencies": [],
  "prompt": "Build a pill button (56px; solid colours from --bg and --fg, plus a ghost style with a hairline ring) that is magnetic. A window pointermove listener measures the pointer's offset from the button's centre; within a reach of 140px plus half the button's size, the target offset is that vector × 0.32 × (1 − d/reach)^0.6, so the pull is strongest close in and fades smoothly. The pill's translate follows the target on a spring (velocity += (target − x)·0.16, ×0.74 damping per frame), so letting go springs back with a small overshoot; the label translates a further 40% of the same offset for parallax. A soft white radial light (120px) sits under the pointer inside the pill and its strength and the drop shadow's depth grow with the pull. Press scales to 0.96. The loop runs only while the spring is moving, and the effect is off on touch and under reduced motion.",
  "interaction": "Bring the pointer near and the button leans toward it; press to click.",
  "animation": "Spring stiffness 0.16, damping 0.74; press 180ms.",
  "a11y": "A normal button; the magnetism is pointer-only and removed under reduced motion and on touch, so keyboard and touch use is unaffected.",
  "responsive": "Sized by its label; works at any width.",
  "touchFallback": "Taps work normally; pointer-only effects are skipped on touch.",
  "variants": [
    {
      "id": "night",
      "label": "Night"
    },
    {
      "id": "paper",
      "label": "Paper"
    }
  ],
  "preview": {
    "bg": "#0d0d0f",
    "mode": "center"
  },
};
