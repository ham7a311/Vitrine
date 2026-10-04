import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ticket-card",
  name: "Ticket Card",
  category: "cards",
  description: "An event ticket with a perforated stub that loosens on hover and tears away when you click it.",
  tags: ["card", "ticket", "event", "interactive", "click", "paper"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["TicketCard.tsx", "ticket-card.css"],
  dependencies: [],
  prompt: `Design a printed event ticket rendered as two paper pieces: a main body and a narrow stub. Both are warm off-white with a soft corner highlight and a grounded drop shadow. The body holds a mono date/time kicker, a serif event title, a muted venue line, and a dashed rule above a row of seat details (row, seat, gate) in mono. Two semicircular notches, cut in the page colour, bite into the top and bottom edge where the pieces meet; a column of punched holes (a repeating radial-gradient) forms the perforation down the stub's left edge.

The stub is a button. On hover or focus it lifts along its perforation (rotate 4°, nudge 4px) and a tiny "tear ↗" hint fades in. On click it tears away — it rotates 17°, drops 46px, and fades to 25% (700ms, ease-out-expo) — the body squares off its right corners and shifts 6px, the notches disappear, and the stub label changes to "Detached". The stub carries a vertical "Admit one" label, a barcode built from a repeating gradient, and the ticket code.`,
  interaction: "Hover/focus loosens the stub; click/Enter/Space tears it off (one-way).",
  animation: "Stub lift and tear 700ms ease-out-expo; body settle 700ms; fade 500ms.",
  a11y: "The stub is a real button with aria-pressed and a label that states its action, then its state. Decorative perforation and barcode are aria-hidden.",
  responsive: "Fluid up to 34rem; the stub narrows in small containers.",
  touchFallback: "Tapping tears the stub; there's no hover-only content.",
  preview: { bg: "#0b080d", mode: "fill", frame: [640, 480] },
};
