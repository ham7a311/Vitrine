import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stay-range",
  name: "Stay Range",
  category: "calendars",
  description: "Pick check-in and check-out as one ribbon that wraps across the weeks. The rules are drawn on the calendar: once you choose a check-in, nights under the minimum are ringed and everything past the next booking closes, with nights and price totalled live.",
  tags: ["calendar", "date range", "date picker", "booking", "hotel", "check-in", "check-out", "travel"],
  traits: ["click", "hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["StayRange.tsx", "stay-range.css"],
  dependencies: [],
  prompt: `Build a two-month date-range picker for booking a stay. Its one idea: the booking rules are visible on the calendar, so no choice ends in an error message.

Data. Dates are "YYYY-MM-DD" strings handled in UTC with Date and Intl only. Inputs: the nights already booked, today, a minimum number of nights, and a function giving the price of a night. A stay from A to B covers the nights A up to but not including B, so a stay may end on a booked day.

Layout. A card up to 720px wide, 22px padding, 22px radius, hairline border. Header: "Check-in" and "Check-out" fields (11px label over a 16px semibold date, or "Add date"), joined by an arrow; the field being chosen has a 2px accent underline. On the right, two 34px round buttons page the months. Two months side by side with a 28px gap, each with a centred month name, single-letter Monday-first weekdays, and a 7-column grid of 40px-tall cells with 3px between rows and none between columns. Each cell holds its number in a 36px circle.

The ribbon. Check-in and check-out are solid accent circles. Between them a band in a pale accent tint fills each cell edge to edge, starting at the centre of the check-in cell and ending at the centre of the check-out cell. At the end of a week row the band closes with a 20px rounded end and reopens with one on the next row, so it reads as one ribbon that wraps. While only a check-in is chosen, the band to the day under the pointer (or the focused day) is drawn as two dashed accent lines instead of a fill.

The rules, once a check-in is chosen: days sooner than the minimum stay get a dotted ring and cannot be chosen; the first booked night after check-in is the last possible check-out; every day beyond it fades to 55% and cannot be chosen. Booked nights always show a diagonal hatch and struck-through number; past days are faint. A small key under the footer names the three marks.

Choosing. First click sets check-in. A later valid day sets check-out. Clicking on or before check-in, or clicking again when a range exists, starts a new check-in. Escape or the Clear link clears.

Footer, above a hairline: with nothing chosen, "Choose a check-in" and the minimum; with a check-in, the running nights count for the hovered day, or the latest possible check-out; with a full range, the total at 18px semibold, "for N nights", and the average per night. On the right, Clear and a 44px accent Reserve button, disabled until the range is complete.

Keyboard: the calendar is one tab stop; arrows move a day or a week, Home and End go to the ends of the week, Page Up and Page Down move four weeks, and the months page when focus leaves them. Each day's label gives the date and either its price, "check-in", "check-out", or why it is closed. The footer sentence is announced politely.

Responsive: under 560px of container width show one month and stack the footer. Reduced motion removes transitions.`,
  interaction: "Click a check-in, then move across the calendar: the dashed ribbon follows, closed days explain themselves, and the price totals when you click a check-out.",
  animation: "Colour changes only, 120ms.",
  a11y: "One tab stop with arrow-key movement; every day is labelled with its date and price or the reason it is closed; the summary is announced; Escape clears.",
  responsive: "Two months, or one under 560px with the footer stacked.",
  touchFallback: "Two taps choose the range; the preview that follows the pointer is an extra, not a requirement.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --stayr-accent #b4532a; --stayr-accent-ink #ffffff; --stayr-bg #fffdf9; --stayr-faint #c9c3bb; --stayr-hatch #e4ddd2; --stayr-ink #1c1917; --stayr-line #ebe6dd; --stayr-ribbon #f6e2d6; --stayr-soft #78716c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --stayr-accent #f0935f; --stayr-accent-ink #1d0f07; --stayr-bg #141211; --stayr-faint #4d4741; --stayr-hatch #2c2825; --stayr-ink #f2ede7; --stayr-line #292523; --stayr-ribbon #3a2418; --stayr-soft #a39b92. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3eee6", mode: "fill", height: 640 },
};
