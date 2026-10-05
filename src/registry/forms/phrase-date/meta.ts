import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "phrase-date",
  name: "Phrase Date",
  category: "forms",
  description: "A date field you write in words: “next fri”, “in 2 weeks”, “12 mar”. A line reads back what it understood, in full, before you commit, and a month grid agrees with the text in both directions.",
  tags: ["date", "date picker", "calendar", "natural language", "input", "form", "datepicker", "deadline"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["PhraseDate.tsx", "parse.ts", "phrase-date.css"],
  dependencies: [],
  prompt: `Build a date input that is faster to type than to click, and that never leaves you guessing how it was understood.

The field: a mono caps label, then a borderless input in a 22px display serif over a 1px rule that darkens on focus, with a 44px calendar button at its end. Under it, a status line reads the input back: empty, "Write it the way you'd say it."; understood, "Reads as Friday 16 October" with the date in ink (and the year added when it is not this year or is more than 150 days away); a day before the minimum, "That day has passed."; unreadable (after blur or Enter), "I can't read that yet. Try “next fri” or “12 mar”." in the danger colour with aria-invalid.

The reader is a pure function of (text, today). It accepts: today, tomorrow; a weekday or its three-letter form ("fri" is the next one, today included; "next fri" is that day in the week after this one, with weeks running Monday to Sunday); "in 3 days", "in 2 weeks", "a month" (clamping, so 31 Jan plus a month is 28 Feb); "12 mar", "12th of march", "mar 12", "12 march 2027" (without a year, the next time it comes round); "16/10", "16/10/2026" (day first); ISO dates. It validates real dates, so 31 feb is null, not 3 March.

Committing: Enter, or leaving the field, replaces the text with a canonical "Fri 16 Oct 2026" and calls onChange. Escape restores the committed text.

The grid: the calendar button (or ArrowDown in the field) folds open a panel below (grid-template-rows 0fr to 1fr, 280ms), not a floating popover, so nothing is clipped or portalled. It always shows six rows of seven so it never changes height. It follows the text: whatever you type that parses moves the grid to that month and rings that day (1.5px accent); the committed day is filled with ink; today has a dot; days before min are struck through and aria-disabled. role=grid with roving tabindex, arrows ±1 and ±7, PageUp and PageDown by month (Shift for a year), Home and End for the week, Enter or Space to pick, Escape to close and return focus to the field. Paper and Night themes.`,
  interaction: "Type a date in words and watch the line read it back; press Enter to commit. Open the grid with the button or ArrowDown and move with the arrow keys.",
  animation: "Grid folds open in 280ms; the reading and the month fade in over 200ms.",
  a11y: "A labelled input described by the reading line, which is a status region; invalid input sets aria-invalid. The month grid is a role=grid with roving tabindex, full arrow, Page and Home/End support, dated accessible names for every day, and aria-disabled for blocked days. Escape closes it and returns focus. Reduced motion removes the fold and fades.",
  responsive: "Fills its container up to 22rem; the grid cells keep a 36px minimum.",
  touchFallback: "Typing works on any keyboard; the calendar button opens the grid for tapping, with 36px cells and a 44px toggle.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 640 },
  isNew: true,
};
