import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "context-lens",
  name: "Context Lens",
  category: "overlays",
  description: "A context menu that is the object opened up, not a box beside it. The row becomes the lens's header and joins the panel through a narrow neck of the same material, and the panel grows out of that neck toward the side with room.",
  tags: ["context menu", "popover", "dropdown", "file list", "actions", "menu", "right-click"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["ContextLens.tsx", "context-lens.css"],
  dependencies: [],
  prompt: `Build a reusable contextual menu primitive whose surface is continuous with the object that opened it.

A render-prop API hands the consumer rowProps (spread on the row: right-click, Shift+F10 and the Menu key open it) and buttonProps (spread on an explicit ⋯ button: aria-haspopup=menu, aria-expanded, aria-controls). While open, the row takes on the lens surface colour and a hairline ring, so it becomes the lens's header — the panel does not repeat the object's name.

The row and panel are joined by a neck: a 48×14 SVG hourglass (M0 0H48C35 0 35 14 48 14H0C13 14 13 0 0 0Z) filled with the surface colour, with its two concave sides stroked in the ring colour. It overlaps both shapes by a pixel so they read as one piece of material. The neck sits at the anchor point — the pointer x for right-click, the button centre for ⋯ — clamped inside the panel.

Placement: below the row if it fits, otherwise above (the stack flips to column-reverse). The panel is clamped 12px from the viewport edges and goes full-width under 480px. It repositions on scroll and resize. Reveal: the neck scales in from the row (150ms), then the panel grows out of it with clip-path inset (240ms), then its contents fade in. Contents: a two-column dl of metadata (owner, modified, size, sharing) and a role=menu list of actions with icon, label and shortcut; danger and disabled (aria-disabled) states.

Keyboard: focus moves to the first enabled item; ArrowUp/Down wrap; Home/End; type-ahead by first letter; Escape closes and returns focus; Tab closes and continues. Outside pointerdown closes. Paper and Night themes.`,
  interaction: "Right-click a file, press Shift+F10 on a focused row, or use its ⋯ button.",
  animation: "Neck 150ms, then a clip-path grow of 240ms toward the free side, then content fades in. Closes with a 140ms fade.",
  a11y: "The trigger has aria-haspopup=menu, aria-expanded and aria-controls. The panel is role=menu, labelled with the object's name and described by its metadata. Roving focus, type-ahead, Escape returns focus, Tab closes. Disabled items use aria-disabled and stay discoverable. Reduced motion shows the lens at once with the neck already in place.",
  responsive: "Clamped 12px from the viewport; full-width under 480px; flips above when there is no room below. Rows show ⋯ permanently on narrow screens.",
  touchFallback: "The ⋯ button is always visible below the sm breakpoint.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f5f4f0", mode: "fill" },
};
