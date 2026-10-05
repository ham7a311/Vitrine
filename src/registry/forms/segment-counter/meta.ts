import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "segment-counter",
  name: "Segment Counter",
  category: "forms",
  description: "A text-message field that shows how the message will really be billed: where it splits into parts, which characters cost double, and which single character (often a curly apostrophe) switched the whole message to the 70-character encoding, with a one-click fix.",
  tags: ["sms", "character count", "textarea", "messaging", "limits", "form"],
  traits: ["keyboard"],
  source: "original",
  files: ["SegmentCounter.tsx", "segment-counter.css", "sms.ts"],
  dependencies: [],
  prompt:
    "Build a text-message composer that explains SMS billing instead of showing a bare '142/160'. Rules: messages use the 7-bit GSM alphabet (160 characters in one part, 153 per part once split) unless any character falls outside it, in which case the whole message becomes UCS-2 (70, or 67 per part, emoji counting two); a few GSM characters (€ [ ] { } ^ ~ \\ |) cost two. Parts never split a two-unit character.\n\nSurface: a 14px-radius white card in Inter with an uppercase field label. The field is a mono 14px textarea on a soft grey well with 24px lines; behind it a pixel-aligned overlay repeats the text so marks can sit under the real characters: a character that forced UCS-2 gets a red wash and red outline, a double-cost character a mustard underline, and where a new part begins a 2px green bar with a tiny 'Part 2' tag floats above the line. The textarea's own text is transparent with a visible caret, so typing, selection and spellcheck stay native.\n\nBelow: one bar per part ('Part 1 153/153', filled green in proportion, red-tinted under UCS-2), a status line '2 messages · GSM-7 · 193 characters · 113 left in this part' with an optional cost per recipient, and notes: 'One character (“’”) moved this message to UCS-2, so each part holds 70 characters instead of 160' with a 'Use plain quotes and dashes' button when every culprit has a safe replacement, '€ counts as two characters', and a warning when the message exceeds the allowed number of parts.",
  interaction: "Type normally; marks and counts update on every keystroke. The fix button replaces curly quotes, long dashes, ellipses and non-breaking spaces with GSM equivalents. onChange(text, parts) reports each edit.",
  animation: "Part bars fill over 200ms; the field border turns accent on focus over 140ms. Reduced motion removes both.",
  a11y: "The textarea has a real label and is described by the status line and the notes, so screen-reader users hear the count, the encoding and why it changed. The overlay is aria-hidden; nothing is conveyed by its colours alone.",
  responsive: "The field and part bars fill their container; part bars wrap.",
  touchFallback: "Works with any on-screen keyboard; emoji from the keyboard show the encoding switch immediately.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e8e8e4", mode: "center", frame: [900, 560] },
  isNew: true,
};
