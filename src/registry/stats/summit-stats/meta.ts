import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "summit-stats",
  name: "Summit Stats",
  category: "stats",
  description: "Progress towards a goal drawn as a climb. The figure so far stands on a ridge that rises to the goal at a snow-capped summit; milestones are flags planted along the way — filled once passed — with their story on hover or focus; and a climber walks the trail up to today when the section comes into view.",
  tags: ["stats", "goal", "progress", "fundraising", "milestones", "mountain", "svg", "illustration", "scroll", "kpi"],
  traits: ["scroll", "hover", "keyboard"],
  source: "original",
  isNew: true,
  files: ["SummitStats.tsx", "summit-stats.css", "summit.ts"],
  dependencies: [],
  prompt:
    "Build progress towards a goal as a mountain climb. Props: title, value, goal, checkpoints [{at, label, date}], format, note, seed, theme and className.\n\nRidge (pure functions): a seeded ridge of points from the base (0, 0) to the summit (1, 1): an eased rise (x^1.35) with four Gaussian bumps and dips for false summits, clamped below the summit until the last point; the ridge's height at any x by interpolation; progress as value / goal clamped to 0–1; and the part of the ridge up to a given x.\n\nHeader: the title small and muted, the value large and tabular, \"of £250k\" and a percentage chip in the accent, and a note line.\n\nScene (SVG, 270px tall, width from a ResizeObserver with inline-size containment so the drawing never widens the card): a paler far range behind, the mountain filled with a vertical rock gradient and continuing off to the right, a snow cap clipped above a jagged snow line, a dashed trail along the whole ridge and the walked part solid in the accent up to the current value. Each checkpoint is a small flag planted on the ridge at its own progress — filled in the accent once passed, outlined otherwise — and the summit has a dark flag marked \"Goal\". A climber (a dot with a soft halo) rides the walked path with CSS offset-path; when the section scrolls into view (or at once if it's already on screen) the walked line draws in and the climber walks up to today over 1.7s. Without offset-path support or with reduced motion, a still dot marks today.\n\nEach flag has an invisible button over it (labelled with the milestone, amount and date) that shows a dark tooltip — amount, label, date — on hover or focus. Two themes, paper (warm stone and sand) and night (slate and moonlit snow).",
  interaction: "Point at or tab to a flag to read that milestone.",
  animation: "The trail draws in and the climber walks up over 1.7s on scroll-in. Reduced motion shows the climb finished.",
  a11y: "The scene is an image with a summary of the progress and milestones; each flag is a labelled button with a tooltip, so milestones are reachable by keyboard.",
  responsive: "The mountain is redrawn for any width; the header wraps.",
  touchFallback: "Tap a flag to read it.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sm-accent #d4572a; --sm-bg #f6efe4; --sm-far #d9cbb4; --sm-flag #23211d; --sm-ink #23211d; --sm-line rgba(35, 33, 29, 0.12); --sm-muted #615b51; --sm-rock-foot #c2b29a; --sm-rock-top #8a7a66; --sm-snow #fbf8f2; --sm-tip #23211d; --sm-tip-ink #f6efe4; --sm-trail rgba(35, 33, 29, 0.35). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sm-accent #ffb454; --sm-bg #10141f; --sm-far #1f2740; --sm-flag #eef1f8; --sm-ink #eef1f8; --sm-line rgba(238, 241, 248, 0.1); --sm-muted #a4abbd; --sm-rock-foot #1b2236; --sm-rock-top #3a4566; --sm-snow #dfe7f7; --sm-tip #eef1f8; --sm-tip-ink #10141f; --sm-trail rgba(238, 241, 248, 0.3). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ebe3d5", mode: "center", height: 520 },
};
