import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "undo-ribbon",
  name: "Undo Ribbon",
  category: "feedback",
  description: "Undo that happens where the action did. A removed row collapses into a thin ribbon in its own place, and a hairline drains toward the Undo button: the time left runs out into the one control that can save it.",
  tags: ["undo", "toast", "snackbar", "delete", "archive", "inbox", "list", "timer"],
  traits: ["click", "hover", "keyboard", "touch"],
  source: "original",
  files: ["UndoRibbon.tsx", "undo-ribbon.css"],
  dependencies: [],
  prompt: `Replace the corner toast with feedback that is spatially attached to the action.

useUndoable(items, { onCommit }) holds the list plus a map of pending removals ({ kind, message, announce, at }). It exposes remove, undo and commit, plus scopeProps for the list container: ⌘Z / Ctrl+Z inside it undoes the most recent removal.

UndoSlot wraps each row. When its item becomes pending, the row is replaced in place by a 44px ribbon, and the slot's height animates from the row's measured height to the ribbon's (Web Animations, 340ms). The ribbon is a dark ink band (a light band on dark themes) holding a kind glyph (trash, archive, check), a truncated message with the object's name in bold, and an amber Undo button with a ⌘Z hint.

A 1.5px hairline along its bottom scales from 1 to 0 with transform-origin on the right, so the remaining time drains toward the Undo button. The hairline animation is the timer: its finished promise expires the ribbon, and pause()/play() hold it while the pointer is over the ribbon, while the Undo button has keyboard focus (:focus-visible only, so a mouse click never freezes it), or while the tab is hidden.

On expiry the slot animates to 0 height and commits. On undo the slot grows back to the row's height and the row fades in. If the removed row had focus, focus moves to Undo; if the ribbon has focus when it expires, focus goes to the list rather than <body>.

UndoInsert is the same ribbon unrolling under the control that caused a bulk action (for example 'Mark all read'). An inbox demo includes Archive and Delete counters. Paper and Night themes.`,
  interaction: "Archive or delete a message, or mark all read. Hover the ribbon to hold its timer, press Undo or ⌘Z, or let it run out.",
  animation: "Row → ribbon height morph 340ms; hairline drains linearly over 6s; collapse 300ms; undo regrows 360ms, with the row fading in over 260ms.",
  a11y: "A polite status region announces what happened and how long Undo is available. Focus moves to Undo when the removed row held it. Keyboard focus on Undo holds the timer indefinitely, which satisfies timing-adjustable guidance. ⌘Z works anywhere in the list. Reduced motion removes the height tweens and the draining line, and shows a stepped seconds countdown instead.",
  responsive: "The ribbon truncates its message. The ⌘Z hint is hidden on touch and narrow screens, and row actions stay visible on touch.",
  touchFallback: "Row actions are always visible below the sm breakpoint; tap Undo.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ur-accent #ffd27a; --ur-bg #1d1c19; --ur-ink #f5f3ee; --ur-line #f5f3ee; --ur-muted rgb(245 243 238 / 0.58). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ur-accent #8a4b00; --ur-bg #ecebe7; --ur-ink #161618; --ur-line #161618; --ur-muted rgb(22 22 24 / 0.55). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f2ed", mode: "fill" },
};
