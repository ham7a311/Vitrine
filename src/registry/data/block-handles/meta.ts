import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "block-handles",
  name: "Block Handles",
  category: "data",
  description: "Document blocks with a quiet gutter: + inserts a block below, and the ⋮⋮ handle drags it, with a blue line showing where it will land. Keyboard users pick it up and walk it with the arrows.",
  tags: ["reorder", "drag and drop", "blocks", "editor", "list", "sortable"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["BlockHandles.tsx", "block-handles.css"],
  dependencies: [],
  prompt:
    "Build a reorderable list of document blocks in a calm document style (white page, ink #37352f, Inter 16px/1.5). Blocks are a heading (20px, 600), plain paragraphs and to-dos with native checkboxes (checked ones go faint and struck through). Each row is a grid: a 52px gutter then the content. The gutter holds two small ghost buttons, a + (15px stroke icon) and a 6-dot ⋮⋮ handle (10×16px), both faint grey and invisible until the row is hovered or focused; they get an 8% ink background on hover. On touch screens the gutter stays at 60% opacity.\n\nDragging the handle lifts the row: it follows the pointer vertically with a white background, a hairline-ring shadow and 92% opacity, while every other gutter hides. A 3px rounded blue line (#2383e2 at 70%) appears in the gap where the block will land, starting after the gutter. On release, the order changes and every block slides from its old position to its new one in 220ms (FLIP). The + inserts an empty line below with a borderless input ('Write something, Enter to keep it'); Enter keeps it, Escape or leaving it empty removes it.",
  interaction:
    "Pointer: press the handle and move at least 4px to start a drag (pointer capture, touch-action none); the drop gap is the count of other blocks whose midpoint is above the pointer. Keyboard: focus a handle and press Space or Enter to pick the block up (aria-pressed, a pale blue row), ↑/↓ move it one place at a time, Space drops it and Escape returns it to where it started. onChange receives the new array.",
  animation:
    "Reordering uses FLIP via element.animate: rows slide 220ms with cubic-bezier(.2,.8,.2,1). The gutter fades in over 120ms. Reduced motion skips the slide and fades.",
  a11y:
    "An ordered list labelled 'Blocks'. Each handle is a button named 'Move “…”, position 3 of 6', described by hidden instructions, with aria-pressed while picked up. An assertive live region announces pick-up, each new position, the drop and cancellations. Focus is kept on the handle while it moves through the DOM.",
  responsive: "The gutter narrows to 46px in containers under 24rem; text wraps anywhere, so long words never push the row wider than the column.",
  touchFallback: "The gutter is always faintly visible on touch, the handle can be dragged with a finger, and the + is a normal tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #37352f, muted #787774, faint #a5a29a, hover rgb(55 53 47 / 0.08), drop line and focus #2383e2, picked row rgb(35 131 226 / 0.1), lift shadow 0 0 0 1px rgb(15 15 15 / 0.05), 0 4px 12px rgb(15 15 15 / 0.1)." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #191919, ink #e3e2e0, muted #9b9a97, faint #6f6e69, hover rgb(255 255 255 / 0.07), drop line and focus #529cca, picked row rgb(82 156 202 / 0.16), lift shadow with a white 8% ring and a deep black blur." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [900, 600] },
};
