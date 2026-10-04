import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cohort-retention",
  name: "Cohort Retention",
  category: "analytics",
  description: "Who keeps coming back: a retention triangle of monthly cohorts on one blue ramp that fills in along its diagonal, where pointing at (or arrowing to) a cell lights its row and column and the linked curves show that cohort against the size-weighted average.",
  tags: ["cohort", "retention", "heatmap", "triangle", "sequential", "linked views", "product analytics", "table"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["CohortRetention.tsx", "cohort-retention.css"],
  dependencies: [],
  prompt: `Build a cohort retention view: a real HTML table as the heatmap, linked to a small curve chart.

Table: one row per monthly cohort (label, guest count) and one column per month since first booking (M0…M9), triangular because later cohorts have fewer months (the missing cells are faint empties). border-spacing 2px gives the surface gap between cells (4px radius). Each cell is shaded on the reference sequential blue ramp (13 steps, 100 → 700) by its share, with the percentage printed in ink (white on the darker steps). On first view the cells scale and fade in along the diagonal (45ms × (row + column)).

Interaction: pointer or focus on a cell lights its row and column (row/column headers turn to full ink, other cells desaturate to 35%), outlines the cell, and updates the linked chart and a polite readout ("Mar, month 3: 46% — 371 of 806 guests (+8 pts vs average)"). Cells use roving tabindex; arrow keys move within the triangle. Each cell has a full aria-label.

Linked chart (SVG): every cohort as a faint hairline, the size-weighted average as a dashed ink line, and the focused cohort (default: the best at month 3) in series slot 1 with a dot at the focused month; 0–100% gridlines; a caption legend. Header insight: "Mar's guests held on best — 46% still booking at month 3, against 38% on average." A 0–100% ramp legend under the table. Two columns, stacking under 760px (the table scrolls sideways if needed). Light and dark themes. Reduced motion: no reveal.`,
  interaction: "Point at a cell (or Tab into the table and use the arrows) to light its row and column and compare that cohort with the average.",
  animation: "Diagonal reveal (45ms steps); dimming 150ms; the focused curve fades in 500ms.",
  a11y: "The heatmap is a real table with headers, a caption and per-cell labels; keyboard navigation; the readout is announced politely. Percentages are printed, so colour is never the only channel.",
  responsive: "Two columns on wide screens, stacked under 760px; the table keeps a minimum width and scrolls horizontally inside its card.",
  touchFallback: "Tap a cell to select it.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
