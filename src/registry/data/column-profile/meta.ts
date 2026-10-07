import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "column-profile",
  name: "Column Profile",
  category: "data",
  description: "Every column of a table summarised on its own hard-edged card: nulls, distinct values, and the shape of what's there — a histogram you can read bin by bin, the top values, or a true/false split.",
  tags: ["data profiling", "histogram", "table", "schema", "statistics", "developer"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["ColumnProfile.tsx", "profile.ts", "column-profile.css"],
  dependencies: [],
  prompt:
    "Build a table profiler in a playful-technical, diagrammatic style: warm off-white page #f4efea, white cards, ink #383838, 2px ink borders, 2px corners, flat 4px 4px 0 hard shadows, DM Mono for names, labels and numbers, Inter light elsewhere. Compute everything from rows: per column the row count, nulls (null, missing, empty or NaN), distinct values, and for numbers and ISO dates min, max, mean and a 14-bin equal-width histogram (the last bin includes the max; a constant column is one bin); for text the five most common values; for booleans a true/false count.\n\nHeader: the table name in 18–22px DM Mono, '400 rows · 6 columns' in small uppercase, and a 'SORT' select (Table order, Most nulls, Most distinct). A responsive grid of cards (min 15rem): the column name with a bordered kind tag coloured by type (number sky #6fc2ff, date teal #16aa98, text coral #ff9538, boolean yellow #ffde00); a stat row of tiny uppercase labels over DM Mono values (Nulls as a percentage, rust when over 10%; Distinct; Mean for numbers). Numbers and dates show a 64px histogram of bordered bars in the kind colour on a 2px baseline; hovering or arrowing to a bar turns it ink and the readout under the axis changes from min…max to '12.5 – 18.0 · 34 rows' (dates as '3 Sept'). Text shows top values as rows with a 40% kind-colour bar behind each, sized to the most common. Booleans show a 34px bordered split bar: yellow 'TRUE 248' and neutral 'FALSE 152' in proportion.",
  interaction:
    "Hover a bar, or focus the chart and use ←/→/Home/End, to read each bin; leaving clears the readout. Changing the sort reorders the cards, which glide to their new positions.",
  animation: "Cards FLIP to new positions over 380ms using offsetLeft/Top; bars change colour over 100ms. Reduced motion re-sorts in place.",
  a11y:
    "The section is labelled with the table name; each card's statistics are a description list. Histograms are focusable groups with an instruction label and a polite live readout; top values are an ordered list; the boolean split is an image with a 'N true, N false' label.",
  responsive: "Cards reflow from several columns to one; long names and values truncate with an ellipsis.",
  touchFallback: "Tap a bar to read it; the min and max labels are always visible.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #f4efea, cards #ffffff, ink, borders and hard shadows #383838, muted #6f6a64, faint #a39e97, rules rgb(56 56 56 / 0.14), boolean false track #ece6df, warning #b33a12; kind colours sky #6fc2ff, teal #16aa98, coral #ff9538, yellow #ffde00." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #1f1f1f, cards #2a2927, ink and borders #f4efea with #000000 hard shadows, muted #b9b2a9, faint #7d776f, rules rgb(244 239 234 / 0.14), boolean false track #3a3835, warning #ffb391; kind colours unchanged with ink text on tags." },
  ],
  preview: { bg: "#f4efea", mode: "fill", frame: [1100, 760] },
};
