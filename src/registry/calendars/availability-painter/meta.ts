import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "availability-painter",
  name: "Availability Painter",
  category: "calendars",
  description: "Find a time for several people. Paint the hours you are free across the week; everyone else's free time is already there as depth, and the best time you all share is named the moment it exists.",
  tags: ["calendar", "availability", "group scheduling", "meeting", "week view", "poll", "heatmap"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["AvailabilityPainter.tsx", "availability-painter.css"],
  dependencies: [],
  prompt: `Build a week grid for finding a meeting time among several people. Its one idea: the answer appears while you paint, because everyone else's free time is already drawn as depth.

Data. Times are minutes from midnight in 30-minute cells, 09:00 to 18:00, across five day columns. Each other person has a list of free ranges per day. Your own free cells are the value being edited.

Layout. A card up to 680px wide, 20px radius, hairline border. Header (at least 84px tall, 18px by 22px padding, hairline below): a 12px eyebrow and a 20px semibold answer line, with one optional button on the right. Body: day names across the top at 12px, hour labels (11px, tabular) in a 50px column on the left, and the grid: one column per day with 4px between columns, each column a rounded strip (8px) of cells 20px tall separated by 1px hairlines, with a slightly stronger line at each hour.

Depth. A cell's background is the depth colour mixed into the surface in proportion to how many of the others are free there, from 5% when none are to 48% when all of them are. Your own free time is a bar in a second colour down the left third of the cell, so the depth beneath still reads. A cell where you and every other person are free turns solid green. The best shared run is bracketed by a 3px line in the text colour down both sides.

The answer. Search every column for the longest run of cells where everyone including you is free, at least one hour long, earliest first on a tie. If one exists the header turns pale green and reads "Everyone is free · 4 of 4" over "Thu 19, 15:30–17:00". If not, look for the longest run the others all share: the header reads "The others all share" over that time, with a button "I'm free then" that paints it for you. If there is neither: "No shared time yet" and "Paint the hours you could meet".

Painting. Pointer down on a cell decides the brush from that cell (paint if it was empty, erase if it was painted), and every cell the pointer then crosses takes the same state until release. The grid ignores touch scrolling so a finger can paint.

Keyboard. The grid is one tab stop with a roving tabindex. Arrows move a cell; Space or Enter toggles it; holding Shift with an arrow carries the state of the cell you left onto the one you land on, so a run can be painted or erased by walking. Each cell is a checkbox labelled with the day, the time and how many others are free. The header is announced politely when the answer changes.

Footer: you and each other person with a colour chip and total hours free, and a scale of the depth steps from 0 to all.

Responsive: under 520px of container width the header stacks, the hour column narrows to 42px and the paddings tighten; the five columns always fit. Reduced motion removes the header's colour transition.`,
  interaction: "Drag down a day to paint when you are free; start on a painted cell to erase. The header names the best shared time as soon as one exists.",
  animation: "The header changes colour in 240ms when a shared time appears.",
  a11y: "One tab stop with arrow keys; Space toggles and Shift with an arrow paints; each cell is a labelled checkbox; the answer is announced.",
  responsive: "Five columns at any width; the header stacks under 520px.",
  touchFallback: "Drag a finger to paint, or tap single cells.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --availp-all #16a05a; --availp-all-bg #e4f6ec; --availp-all-ink #0c5a32; --availp-bg #ffffff; --availp-depth #6d5bd0; --availp-ink #18181b; --availp-line #e8e8ec; --availp-mine #f2a516; --availp-soft #6b6b73. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --availp-all #39d98a; --availp-all-bg #10291c; --availp-all-ink #7dedb4; --availp-bg #111114; --availp-depth #9a8cff; --availp-ink #ededf0; --availp-line #26262c; --availp-mine #ffbe3d; --availp-soft #9797a0. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f0f0f3", mode: "fill", height: 680 },
};
