import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "fold-sheet",
  name: "Fold Sheet",
  category: "overlays",
  description: "A side or bottom sheet that swings open on its edge like a page instead of sliding in like a drawer. Content becomes legible as the surface comes square, and on a phone dragging the handle folds it back under your finger.",
  tags: ["sheet", "drawer", "bottom sheet", "filters", "panel", "modal", "drag"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["FoldSheet.tsx", "fold-sheet.css"],
  dependencies: [],
  prompt: `Build a modal sheet whose physical idea is a hinge. The panel starts folded flat against its anchored edge (rotateY(±84deg) about that edge for side sheets, rotateX(84deg) about the bottom edge for bottom sheets, perspective 1400px set on a hinge wrapper) and swings square to the viewer over 420ms (cubic-bezier(.22,.9,.24,1)). A crease — a gradient shade gathered at the hinge — fades out as the surface flattens. Content does not slide: each body section fades in, in reading order, once the surface is roughly half open, so information arrives as it becomes legible. Closing folds it back onto the edge (300ms ease-in).

side="auto" resolves to right at 640px and wider (container width when contained), bottom below. Bottom sheets get a grab handle: dragging maps finger distance to fold angle via θ = acos(1 − dy/h), so the top edge stays under the finger while the sheet folds away; past ~50° release closes it, otherwise it swings flat again. Tapping the handle (it is a real button, "Close sheet") also closes.

Once open it is an ordinary panel: sticky header with title, description and close; a scrolling body with overscroll containment; a sticky footer for actions. Native modal semantics: role dialog, aria-modal, labelled/described, siblings made inert, focus moved to the panel and trapped, restored on close; Escape and scrim click close. Paper and Night themes.`,
  interaction: "Open Filters. On a narrow screen, drag the handle down to fold the sheet away.",
  animation: "Unfold 420ms with a fading crease; sections fade in 45ms apart from ~190ms; fold closed 300ms; drag follows the finger with a 360ms settle.",
  a11y: "role=dialog, aria-modal, labelled by its title and described by its summary. Everything outside is inert; focus is trapped and restored. Escape, the close button, the scrim and the handle button all close. Reduced motion replaces the fold with a 16px fade-in from the edge and removes the crease.",
  responsive: "Right sheet (min(100% − 24px, 25rem)) from 640px; bottom sheet at 88% height below. Body scrolls; header and footer stay put.",
  touchFallback: "Drag the handle to fold the sheet away, or tap the scrim.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --fs-crease rgb(40 30 10 / 0.34); --fs-ink #1c1b18; --fs-line rgb(28 27 24 / 0.09); --fs-muted #6d6a62; --fs-scrim rgb(24 20 14 / 0.26); --fs-surface #fbfaf7. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --fs-crease rgb(0 0 0 / 0.7); --fs-ink #ebebe8; --fs-line rgb(255 255 255 / 0.08); --fs-muted #8e9096; --fs-scrim rgb(0 0 0 / 0.5); --fs-surface #18191c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
