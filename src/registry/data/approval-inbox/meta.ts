import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "approval-inbox",
  name: "Approval Inbox",
  category: "data",
  description: "Spend requests waiting on you, one at a time: policy notes flagged, A or D to decide, the decision held behind a draining Undo before it's sent, and any failure returned to the top of the inbox.",
  tags: ["fintech", "approvals", "inbox", "keyboard", "workflow", "undo"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["ApprovalInbox.tsx", "approval-inbox.css"],
  dependencies: [],
  prompt:
    "Build an approvals inbox in a dark, precise fintech style: one #121214 panel with 16px corners and a 1px rgb(255 255 255 / 0.08) inner hairline, text #ededed, muted #8d8d93, Inter with tabular numbers, a periwinkle accent #8b93ff, amber #f5a524 for policy notes. From a 44rem container it splits into a list (left, hairline divider) and a detail pane; below that, one pane at a time with a '← All requests' back button.\n\nList: 'Waiting on you' with a count pill, then 60px rows: a 34px initials avatar, requester and a muted 'Reimbursement · Flights to the Salalah workshop', the amount right-aligned, and an amber dot when there are policy notes. The selected row is raised with a 2px accent bar on its left. A faint keyboard legend at the bottom: J K move · A approve · D decline · Z undo.\n\nDetail: kind and team, the title, the amount at 30–40px 600, the requester with a relative time ('42 minutes ago' via Intl.RelativeTimeFormat, computed after mount), their note as a quiet quote with a left rule, and policy notes as amber-tinted rows with dots. Footer: 'Decline' (neutral) and a wider accent 'Approve'. Decline first opens an optional reason textarea ('Tell Layla why') with Cancel and a red-tinted 'Decline request'. Deciding removes the request at once and selects the next; a dark-on-light toast at the bottom says 'Approved · Layla Al-Harthy' with Undo and a 2px accent bar draining over the undo window.",
  interaction:
    "Decisions are held: onDecide(id, decision, note) runs only when the undo window closes (or when another decision or unmount flushes it), so Undo needs no server call. If onDecide rejects, the request returns to the top with an explanation. Keys: J/K move, A approves, D opens the decline reason, ⌘/Ctrl+Enter confirms it, Escape cancels it, Z undoes; keys are ignored while typing.",
  animation: "Rows tint over 120ms; the decline form and toast rise into place; the undo bar drains linearly (in steps with reduced motion, where the other movements are removed).",
  a11y:
    "List and detail are labelled sections; the selected row has aria-current; policy dots have spoken labels; the detail heading takes focus when a request is opened on narrow screens; every decision, undo and failure is announced in a polite live region; buttons expose their shortcut keys.",
  responsive: "Two panes from 44rem; below that the list and the detail swap, with a back button and no keyboard legend.",
  touchFallback: "Tap a request to open it, then use the buttons; Undo is a tap target in the toast.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme: panel #121214, raised #18181b, wells #0e0e10, text #ededed, muted #8d8d93, faint #5b5b61, hairlines rgb(255 255 255 / 0.08) and 0.16, accent #8b93ff with #0b0b0c text, amber #f5a524, decline red #ff8a80; the toast is light text inverted (#ededed background, panel-coloured text)." },
    { id: "light", label: "Light", prompt: "Light theme: panel #ffffff, raised #f3f3f5, wells #fafafb, text #0c0c0d, muted #66666d, faint #a3a3aa, hairlines rgb(0 0 0 / 0.08) and 0.16, accent #4b53d6 with white text, amber #b26b00, decline red #c2322a; the toast is a near-black bar with white text." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", frame: [1100, 700] },
  isNew: true,
};
