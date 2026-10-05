import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ripple-rim-card",
  name: "Ripple Rim Card",
  category: "cards",
  description: "A file drop zone whose dashed rim leans in toward the file you're dragging, and sends a wave both ways round the card from the exact spot you let go.",
  tags: ["card", "upload", "drop zone", "file", "svg", "border", "wave"],
  traits: ["cursor", "click", "keyboard", "touch"],
  source: "original",
  files: ["RippleRimCard.tsx", "ripple-rim-card.css"],
  dependencies: [],
  prompt:
    "Build a file drop zone whose border is a live SVG path. Measure the zone with a ResizeObserver and sample its rounded rectangle (18px corners) every ~4px, keeping each point's outward normal. Draw the path from those points, filled with the surface colour and stroked as a 1.5px dash (7 6).\n\nWhile a file is dragged over, track the pointer (smoothed) and pull nearby rim points inward along their normals by up to 9px with a gaussian falloff (σ 80px), so the edge leans toward the file; the dashes tighten to 7 3, the stroke turns to the accent and the face tints. On drop, find the rim point nearest the drop and send a damped wave both ways round the perimeter from it: a gaussian packet times a cosine, amplitude 8px decaying with τ 0.7s, meeting on the far side after ~0.8s. Choosing a file with the picker starts the wave from where you clicked (top centre from the keyboard).\n\nThe zone is a real button that opens the file input. Added files settle in underneath as rows with a type tile, the name, size and an upload bar that fills, then 'Uploaded' in green. Files over the size limit are refused with a sentence saying what to do. All animation runs in one requestAnimationFrame loop that stops when the rim is at rest.",
  interaction: "Drag a file over to make the rim lean toward it; drop it to send a wave round the card. Click or press Enter to choose a file instead.",
  animation: "Lean follows the pointer with ~70ms smoothing; the wave decays over ~1.8s; rows slide in 520ms and the upload bar fills over 1.3s.",
  a11y: "The zone is a button described by its hint and any error; the hidden input is out of the tab order. Errors use role=alert, and a polite live region announces added and removed files. Each row has a labelled remove button that returns focus to the zone. Reduced motion keeps the rim still.",
  responsive: "Full width up to 34rem; file names truncate with an ellipsis.",
  touchFallback: "Tap to open the file picker; the wave starts from where you tapped.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rrc-bad #f08a7a; --rrc-face #141217; --rrc-hot #b9cce4; --rrc-ink #efe8dc; --rrc-line rgb(239 232 220 / 0.1); --rrc-muted #9c96a1; --rrc-ok #7fd1a8; --rrc-rim rgb(239 232 220 / 0.32); --rrc-row #18161c; --rrc-tint #1a1d24. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rrc-bad #b3412e; --rrc-face #fffdf8; --rrc-hot #2f5fd0; --rrc-ink #1b1a17; --rrc-line rgb(27 26 23 / 0.1); --rrc-muted #6f6a62; --rrc-ok #1f7a4d; --rrc-rim rgb(27 26 23 / 0.3); --rrc-row #ffffff; --rrc-tint #f1f4fb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
