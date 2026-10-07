import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "transaction-ledger",
  name: "Transaction Ledger",
  category: "data",
  description: "Account activity grouped by day with each day's net total: money in is marked, pending and missing-receipt items say so, and any row opens in place for details and a memo.",
  tags: ["fintech", "transactions", "banking", "ledger", "table", "activity"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["TransactionLedger.tsx", "transaction-ledger.css"],
  dependencies: [],
  prompt:
    "Build an account activity ledger in a dark, precise fintech style: a #121214 panel with a 1px rgb(255 255 255 / 0.07) inner hairline and 16px corners, text #ededed, muted #8d8d93, Inter with tabular numbers, one periwinkle accent #8b93ff, credits in soft green #6ad8a0.\n\nToolbar: a recessed segmented filter (All, Card, Transfers, Pending) as toggle buttons, and a search well with a 15px magnifier that matches merchant, category, memo and card digits. Below, entries sorted newest first and grouped by calendar day in a given time zone; each group has a sticky header with the day ('Today', 'Yesterday' via Intl.RelativeTimeFormat, otherwise 'Sun, Oct 4') and the day's net total on the right ('+$12,500.00').\n\nRows are full-width buttons with 10px corners that tint on hover: a 36px rounded monogram square tinted by the merchant name (⇄ for transfers, % for fees), the merchant and a muted sub-line ('Software · •1907' or 'Transfer · Incoming ACH'), a hairline 'Pending' pill, an amber '!' dot for a card purchase without a receipt, and the amount right-aligned (credits green with '+'). Opening a row reveals, indented under the name, a grid of Time, Card or Method, Status ('Pending, usually posts in 1–2 days') and Receipt (amber when missing), then a memo field with Save. Under 30rem, the pending and receipt marks hide and amounts sit beside the name.",
  interaction:
    "Filters and search narrow the list (an empty state offers Clear filters). Rows toggle open with click or Enter; j/k or ↑/↓ move focus between rows. Memo saves on Enter or Save through onMemo; a rejection keeps the typed text and says so.",
  animation: "Row tint fades over 120ms; details slide down 4px as they appear. Reduced motion removes both.",
  a11y:
    "Each day is a section labelled by its heading; rows are buttons with aria-expanded and aria-controls; the missing-receipt mark has a label; the result count is announced politely; memo results use role=status.",
  responsive: "The toolbar wraps; under 30rem the row grid collapses to monogram, name and amount, and details lose their indent.",
  touchFallback: "Rows are 56px tap targets; nothing depends on hover.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme: panel #121214, raised rows #18181b, wells #0e0e10, text #ededed, muted #8d8d93, faint #5b5b61, hairlines rgb(255 255 255 / 0.07) and 0.14, accent #8b93ff, credit #6ad8a0, warning #f5a524, error #ff8a80; monograms at 30% lightness with pale text." },
    { id: "light", label: "Light", prompt: "Light theme: panel #ffffff, raised rows #f5f5f6, wells #fafafb, text #0c0c0d, muted #66666d, faint #a3a3aa, hairlines rgb(0 0 0 / 0.07) and 0.14, accent #4b53d6, credit #18794e, warning #b26b00, error #c2322a; monograms at 92% lightness with deep text." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", frame: [880, 760] },
};
