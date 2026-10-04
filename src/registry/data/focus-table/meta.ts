import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "focus-table",
  name: "Focus Table",
  category: "data",
  description: "A data table with depth of field: the row you're on stays sharp while the rows around it fade by distance, and the grid itself stays put. Sortable, selectable, expandable, and on phones it becomes compact records instead of a sideways scroll.",
  tags: ["table", "data grid", "sort", "select", "expand", "deployments", "keyboard", "responsive"],
  traits: ["hover", "keyboard", "click", "touch"],
  source: "original",
  files: ["FocusTable.tsx", "focus-table.css"],
  dependencies: [],
  prompt: `Build a production data table whose central idea is depth of field. When a row is hovered or keyboard-focused, every other row's content fades by its distance from it: ±1 row to 78% opacity, ±2 to 64%, everything else to 55%. The opacity is applied to an inner cell wrapper through a per-row CSS variable, so grid lines, borders and row backgrounds stay at full strength and the table's structure never blurs. The column header under the pointer lifts (full ink plus a 2px underline) so a single cell can be read crosshair-style. At rest everything is in focus. It is a static rule with 180ms opacity transitions, so it works identically without animation.

Features:
- Columns are declared with render, an optional comparator, align, width and priority.
- Sortable headers are buttons with aria-sort, cycling asc → desc → none; rows reorder with a Web Animations FLIP.
- A checkbox column has a select-all header with an indeterminate state; shift-click selects ranges.
- Selecting turns the caption bar into a tinted selection bar ('3 selected · Redeploy · Cancel builds · Clear').
- Keyboard: a treegrid with roving focus on rows. ↑/↓, Home/End and PageUp/PageDown move; Space selects; Shift+↑/↓ extends the selection; Enter/→ expands; ← collapses; Escape clears the selection.
- Expansion is a grid-template-rows 0fr→1fr fold under the row (here a build-log excerpt and actions).
- Loading draws placeholder rows at the real row height with static bars, not a shimmer. Empty and error states sit inside the table, the error with Retry.

Below 640px of container width (a ResizeObserver, not the viewport), rows render as compact records: the primary column as the headline with a status badge, secondary columns as one muted line, and meta columns revealed with the expansion. Sorting moves to a select. The depth-of-field falloff still applies. Paper and Night themes.`,
  interaction: "Hover or arrow through rows. Click a header to sort, Space or the checkbox to select (Shift for a range), Enter or a click to expand.",
  animation: "180ms opacity falloff; 320ms FLIP on sort; 320ms fold for expansion.",
  a11y: "A treegrid with aria-sort, aria-selected, aria-expanded and aria-multiselectable, plus a labelled row for each record and roving tabindex. The selection bar is a polite live region, and errors use role=alert. Reduced motion removes the transitions; the falloff stays because it carries information, not motion.",
  responsive: "A container-width switch to compact records under 640px, with no horizontal scrolling. Sort becomes a select.",
  touchFallback: "Tap a record to expand it and tap its checkbox to select. The falloff follows the last tapped record.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
