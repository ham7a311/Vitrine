import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "undo-tree",
  name: "Undo Tree",
  category: "time",
  description: "Undo that never throws your work away. Every state is drawn as a node on a branching line: change something after undoing and the old future becomes a pencil-grey branch instead of disappearing. Hover any step to preview it, click to restore it, and watch the current-state ring travel the branches to get there.",
  tags: ["undo", "history", "versions", "editor", "branching", "time travel", "hook"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["UndoTree.tsx", "undo-tree.css", "tree.ts"],
  dependencies: [],
  prompt:
    "Build branching undo history for an editor, as a hook plus a view. The hook keeps a tree, not a stack: undo moves to the parent, a change made after undoing becomes a new child (the old future survives as a sibling branch), redo follows whichever child you most recently came back from, and repeated commits with the same label within 900ms merge (so typing a word is one step). It exposes value, commit(value, label), undo, redo, goTo(id), canUndo and canRedo.\n\nThe view is a 12px-radius white panel with a hairline border, in Geist and Geist Mono. A header row reads 'Headline history' with '9 states · 3 branches' in mono on the right. Below, a scrolling list (340px max) where every state is a 34px row: on the left an SVG lane diagram, on the right a mono step number, the step's label ('Title case', 'Typed', 'Shorten') and, on the current row, a filled accent 'Now' pill; dead-end branch tips get an outlined 'Branch end' pill.\n\nLane diagram: rows run in the order states were created, top to bottom. A node's first child continues straight down its lane; any later child opens a new lane 22px to the right, joined by a line that drops half a row, curves right with 8px corners and drops into its lane. Nodes are 5px circles. The path from the first state to the current one is inked in the accent blue (filled nodes, blue lines, darker row text); every other branch is pencil grey with hollow nodes. A 9px accent ring marks the current state.\n\nUnder the list a preview strip says 'Hover a step to preview it'; hovering or focusing a row shows that state's content there ('Step 4 · click or Enter to restore') via a renderPreview prop. In the demo it sits beside a headline editor with Title case, Sentence case and Shorten actions and Undo/Redo buttons, seeded with two branches.",
  interaction:
    "Click a row (or press Enter on it) to restore that state; onSelect(id) is wired to goTo. The list is a tree: ↑ goes to the parent, ↓ to the remembered child, ←/→ to sibling branches, Home to the start and End back to the current state; moving focus previews the state. In the demo editor ⌘/Ctrl+Z undoes and ⇧⌘Z or Ctrl+Y redoes.",
  animation:
    "On every restore, undo or redo the current-state ring travels the actual route, up to the nearest shared step and down the other branch, in up to 900ms with cubic-bezier(.2,.8,.2,1). A new branch draws its connecting line over 360ms. Previews fade up 3px. With reduced motion or motion={false}, the ring jumps and lines appear complete.",
  a11y:
    "The rows form a role='tree' of treeitems with aria-level, aria-selected and aria-current on the present state, one tab stop and the arrow model above. The SVG is decorative. Restores are announced ('Restored step 4: Shorten.'). The preview is visual; the restored text itself is the accessible result.",
  responsive: "The panel fills its column and the list scrolls vertically past 340px; the lane diagram's width grows with the number of branches and labels truncate with an ellipsis.",
  touchFallback: "Tap a row to restore it. Hover previews are a bonus, since the restored state is visible immediately and can be undone.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --utree-accent #2457d6; --utree-bg #ffffff; --utree-ink #16181d; --utree-line rgb(22 24 29 / 0.1); --utree-muted #6a707c; --utree-pencil #b9bdc6; --utree-row #f2f5fd. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --utree-accent #7ea3ff; --utree-bg #121417; --utree-ink #e8eaee; --utree-line rgb(255 255 255 / 0.09); --utree-muted #8c93a0; --utree-pencil #474c56; --utree-row #1a1f2b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#eef0f4", mode: "fill", frame: [1000, 700] },
};
