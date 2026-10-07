import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "query-cell",
  name: "Query Cell",
  category: "data",
  description: "A notebook SQL cell with a hard-edged frame: highlighted SQL, ⌘/Ctrl + Enter to run, a status strip with rows and milliseconds, typed result columns, and errors that mark their line.",
  tags: ["sql", "editor", "notebook", "query", "developer", "table"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["QueryCell.tsx", "sql.ts", "query-cell.css"],
  dependencies: [],
  prompt:
    "Build a SQL notebook cell in a playful-technical, diagrammatic style: warm off-white page #f4efea, white cell, ink #383838, 2px solid ink borders on everything, 2px corners, and a flat 4px 4px 0 hard shadow (no blur). Labels, buttons and numbers use DM Mono uppercase; body text is Inter light.\n\nHeader row (2px rule under it): a small sky-blue #6fc2ff 'SQL' tag with an ink border and the cell name, then a yellow #ffde00 'RUN' button with a play glyph (and a white 'CANCEL' beside it while running). Buttons lift on hover: translate(−2px, −2px) with a 2px hard shadow; pressing removes the lift. Editor: a 44px line-number gutter and a code area where a transparent, non-wrapping textarea sits exactly over a highlighted <pre> (same DM Mono 14px/22px and padding), scrolled together; keywords blue #2160a8, functions teal #0f7f72, strings orange #b8540f, numbers purple #8c3fb0, comments grey italic. A 2px inset sky outline marks focus.\n\nA status strip in the page colour under a 2px rule: '⌘ ↵ to run', then 'Running · 230 ms' with a small spinner and a live millisecond count, then '412 rows · 38 ms' with a teal square, or 'Error on line 2' in rust. Errors add a pale coral panel with the engine's message in mono and highlight the failing line number in the gutter with a coral edge. Results: a scrollable table up to 20rem tall with a sticky header; each header shows the column name and a tiny bordered type tag (VARCHAR, BIGINT); numeric columns right-align with tabular numbers and locale grouping; NULL shows faint italic.",
  interaction:
    "⌘/Ctrl + Enter or Run calls run(sql, signal); Cancel or Escape aborts the signal and shows 'Cancelled'. Results and errors from the last run replace each other; a thrown error with a numeric line marks that line. Only the first maxRows rows render, with a note. Tab is left alone so keyboard users can leave the editor.",
  animation: "Buttons lift 2px on hover over 120ms; the spinner turns while running. Reduced motion slows the spinner and removes the lift transition.",
  a11y:
    "The textarea is labelled with the cell name and the run shortcut, described by the status line (role=status), and marked aria-invalid after an error. The error message is a role=alert. The result region is focusable and labelled with its row count; headers are scoped columns.",
  responsive: "The editor and results scroll horizontally rather than wrapping SQL; under 30rem the gutter narrows.",
  touchFallback: "Run and Cancel are buttons; the editor is a normal textarea on touch keyboards.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #f4efea, cell #ffffff, ink, borders and hard shadow #383838, muted #6f6a64, faint #a39e97, faint rules rgb(56 56 56 / 0.14), run yellow #ffde00, sky #6fc2ff, teal #16aa98, coral #ff9538, error panel #ffe1d6 with text #b33a12." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #1f1f1f, cell #2a2927, ink and borders #f4efea with a #000000 hard shadow, muted #b9b2a9, faint #7d776f, error panel #3d2a22 with text #ffb391; syntax keywords #7fb8ff, functions #4fd1bf, strings #ffb27a, numbers #d39cf2, comments #847e76; the yellow run button and sky tag keep their colours with ink text." },
  ],
  preview: { bg: "#f4efea", mode: "fill", frame: [1000, 700] },
};
