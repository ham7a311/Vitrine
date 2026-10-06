import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "donut-chart",
  name: "Donut Chart",
  category: "analytics",
  description: "Parts of a whole as a ring with a hairline between parts. Point at a part, or its row in the legend, and it steps out of the ring while the middle shows its value and share; otherwise the middle counts up to the total as the ring draws in.",
  tags: ["chart", "donut", "pie", "ring", "share", "breakdown", "dashboard", "analytics", "legend"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["DonutChart.tsx", "donut-chart.css", "../line-chart/chart.ts"],
  dependencies: [],
  prompt:
    "Build a donut chart card in SVG with no chart library: 'Marketing spend by channel, Q3' with five parts (Search, Social, Email, Events, Partners) in OMR.\n\nCard: the chart surface with a 1px hairline ring and 16px corners, the title at 16px semibold. Beside the ring (wrapping under it on narrow screens), a legend list: each row is a button with a 10px rounded swatch, the name in secondary ink, the value in semibold tabular ink and the share in muted tabular figures, right-aligned.\n\nRing: 220px, outer radius 104 and inner 70, angles from 12 o'clock clockwise, a 0.022-radian gap between parts plus a 1px surface stroke, parts in the fixed categorical order. On first view a mask circle's dash offset sweeps the ring in clockwise over 1s while the middle counts up to the total (ease-out cubic). The middle shows 'Total spend', the total in 24px semibold tabular figures and '5 channels'.\n\nPointing at a part, or hovering or focusing its legend row: the part translates 7px outward along its middle angle (0.3s), the others fade to 35%, the row gets a soft wash, and the middle shows that part's name, value and '38.9% of total spend'. A visually hidden table lists every part, value and share, and the total.",
  interaction: "Hover a part or a legend row, or Tab through the legend rows, to read each part in the middle.",
  animation: "A 1s clockwise draw-in with the total counting up, and a 0.3s step-out on the active part. Reduced motion shows the finished ring and total at once and keeps only the fades.",
  a11y: "The legend rows are buttons whose names give the value and share, and a hidden table carries the same numbers, so no part is identified by colour alone. The SVG is decorative.",
  responsive: "The ring keeps its size; the legend sits beside it on wide screens and below it on narrow ones.",
  touchFallback: "Tapping a legend row or a part shows it in the middle.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --dnut-focus #2a78d6; --dnut-ink #0b0b0b; --dnut-ink-2 #52514e; --dnut-muted #898781; --dnut-ring rgb(11 11 11 / 0.1); --dnut-s1 #2a78d6; --dnut-s2 #eb6834; --dnut-s3 #1baf7a; --dnut-s4 #eda100; --dnut-s5 #e87ba4; --dnut-surface #fcfcfb; --dnut-wash rgb(11 11 11 / 0.04). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --dnut-focus #3987e5; --dnut-ink #ffffff; --dnut-ink-2 #c3c2b7; --dnut-muted #898781; --dnut-ring rgb(255 255 255 / 0.1); --dnut-s1 #3987e5; --dnut-s2 #d95926; --dnut-s3 #199e70; --dnut-s4 #c98500; --dnut-s5 #d55181; --dnut-surface #1a1a19; --dnut-wash rgb(255 255 255 / 0.05). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f9f9f7", mode: "fill", frame: [1000, 560] },
  isNew: true,
};
