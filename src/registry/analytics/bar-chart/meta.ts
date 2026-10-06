import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bar-chart",
  name: "Bar Chart",
  category: "analytics",
  description: "Grouped or stacked bars that slide between the two instead of jumping, upright or sideways: rounded data ends, a hairline gap between neighbours, stack totals, a tooltip per bar, arrow-key navigation and a table of the numbers.",
  tags: ["chart", "bar chart", "column chart", "stacked", "grouped", "horizontal", "dashboard", "analytics", "tooltip"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["BarChart.tsx", "bar-chart.css", "bars.ts", "../line-chart/chart.ts"],
  dependencies: [],
  prompt:
    "Build a bar chart card with no chart library: 'Revenue by line' (thousands of OMR, April to September) for three series (Subscriptions, Services, Hardware) over six months.\n\nCard: the chart surface with a 1px hairline ring and 16px corners. Header: the title (16px semibold) and a subtitle in secondary ink; on the right two small segmented controls on a chip background: Grouped / Stacked, and an icon pair for upright or sideways bars (aria-pressed, labelled). A legend of 10px rounded swatches with names in secondary ink.\n\nPlot (250px tall; 280px sideways): hairline gridlines at nice ticks from zero with compact muted tabular labels, a stronger baseline, month labels along the category axis. Bars are absolutely positioned HTML elements whose place comes from four custom properties (position and thickness along the categories, start and end along the values, as percentages), so switching between grouped and stacked just changes the numbers and every bar slides to its new place over 0.5s; turning the chart sideways regrows the bars along their new axis. Grouped: the series side by side in 72% of each band, 2px apart. Stacked: one bar per month 45% of the band wide, segments separated by a 2px surface-coloured gap, and the month total in secondary ink above the stack. Only the data end of a bar (the top, or the right when sideways) is rounded, 4px. On first view the bars grow from the baseline, staggered 45ms by month and 25ms by series.\n\nHover or focus a bar: the others dim to 40% and a tooltip above it shows the month, then the value in semibold tabular figures followed by the series name (and the month total when stacked). Keyboard: one tab stop into the bars (roving tabindex), arrows move by month and by series, Home/End jump to the ends; each bar's accessible name reads 'Jun, Services: 31k of 91k'. A visually hidden table carries every value and total.",
  interaction: "Switch Grouped/Stacked and upright/sideways with the controls; hover or tab into the bars and use the arrow keys.",
  animation: "Bars slide and resize between grouped and stacked over 0.5s, and grow in on first view and when turned sideways; hover dims the rest. Reduced motion keeps only the dimming.",
  a11y: "Every bar is focusable with a full accessible name; a legend names the series and a hidden table carries the numbers, so colour never carries identity alone. Controls use aria-pressed.",
  responsive: "Bars are percentages of the plot, so the chart fills any width; the header controls wrap under the title on narrow screens.",
  touchFallback: "Tapping a bar shows its tooltip; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --brch-base #c3c2b7; --brch-chip #f1f0ec; --brch-focus #2a78d6; --brch-grid #e1e0d9; --brch-ink #0b0b0b; --brch-ink-2 #52514e; --brch-muted #898781; --brch-ring rgb(11 11 11 / 0.1); --brch-s1 #2a78d6; --brch-s2 #eb6834; --brch-s3 #1baf7a; --brch-surface #fcfcfb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --brch-base #383835; --brch-chip #252523; --brch-focus #3987e5; --brch-grid #2c2c2a; --brch-ink #ffffff; --brch-ink-2 #c3c2b7; --brch-muted #898781; --brch-ring rgb(255 255 255 / 0.1); --brch-s1 #3987e5; --brch-s2 #d95926; --brch-s3 #199e70; --brch-surface #1a1a19. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f9f9f7", mode: "fill", frame: [1100, 600] },
  isNew: true,
};
