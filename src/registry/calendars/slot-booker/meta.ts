import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "slot-booker",
  name: "Slot Booker",
  category: "calendars",
  description: "Book an appointment without guessing. Every day in the month shows how open it is as a small stack of ticks before you click it, and each time is given in your own time zone with the host's beside it.",
  tags: ["calendar", "booking", "appointment", "scheduling", "time slots", "time zone", "date picker"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["SlotBooker.tsx", "slot-booker.css"],
  dependencies: [],
  prompt: `Build an appointment booker in two panes: a month on the left, the chosen day's times on the right. Its one idea: each day shows how open it is before it is clicked.

Data. Open start times arrive as instants. Group them by the calendar day they fall on in the visitor's time zone (Intl.DateTimeFormat with timeZone), not the host's. Use Intl and Date only, no date library. Days before today, and days with no times, cannot be chosen.

Month pane (24px padding). Header: a 12px muted line "host · 30 min", a 20px semibold title, and on the right a previous button, the month name (118px wide, centred) and a next button; the buttons are 32px with a 10px radius and a hairline, and previous is disabled in the current month. Below, a Monday-first row of weekday names at 11px, then a 7-column grid with 4px gaps. A day cell is a 46px-tall button with a 12px radius: the date number, and beside it a stack of four ticks, each 7 × 3px with 2px between. Ticks fill from the bottom in the accent colour: one tick for 1–2 open times, two for 3–4, three for 5–6, four for 7 or more; the rest stay hairline grey. Closed days show a faint number and no stack. The selected day gets a pale accent wash and a 1px accent border. Under the grid, a legend: a full stack and "Taller stacks have more times open".

Times pane (tinted panel, 24px padding, hairline on its left). Before a day is chosen: "Pick a day", the next open day named in full, and a button that shows its times. With a day chosen: the full date at 16px semibold, a 12px line naming the time zone, then the times in a two-column grid of 48px buttons, each with the visitor's time in bold and the host's time and city beneath at 11px (omit when both zones match). The chosen time takes the accent border and wash. A footer row, divided by a hairline, repeats the chosen range ("10:30–11:00, London time") and holds a 44px accent Confirm button, disabled until a time is chosen. After confirming: a round accent tick, the date, the range at 22px, a one-line note and a "Pick another time" button.

Keyboard. The grid is one tab stop with a roving tabindex: arrows move a day or a week, Home and End go to the ends of the week, Page Up and Page Down change month, and moving past the edge of the month turns the page and keeps focus. Enter or Space chooses the day. Every day's label reads the full date and how many times are open. The chosen range and the confirmation are announced politely.

Responsive: under 620px of container width the panes stack, the header wraps, and in each day the ticks become a row of four dots under the number. Reduced motion removes the colour transitions.`,
  interaction: "Click a day with a tall stack, pick a time, confirm. Arrow keys walk the month; Page Up and Page Down change it.",
  animation: "Colour changes only, 140ms.",
  a11y: "One tab stop for the month with arrow-key movement; each day is labelled with its date and how many times are open; the chosen range and the confirmation are announced.",
  responsive: "Two panes side by side; under 620px they stack and the tick stacks become rows of dots.",
  touchFallback: "Everything is a tap; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --slotb-accent #1f5fd6; --slotb-accent-ink #ffffff; --slotb-bg #ffffff; --slotb-faint #b9b8b4; --slotb-ink #17171a; --slotb-line #e7e5e0; --slotb-panel #f6f5f2; --slotb-soft #6a6a70; --slotb-wash #e9f0fd. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --slotb-accent #7da7ff; --slotb-accent-ink #0b1220; --slotb-bg #121214; --slotb-faint #4a4a51; --slotb-ink #ededf0; --slotb-line #27272b; --slotb-panel #19191c; --slotb-soft #9a9aa2; --slotb-wash #17213a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f1efea", mode: "fill", height: 640 },
};
