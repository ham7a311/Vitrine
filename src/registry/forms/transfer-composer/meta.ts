import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "transfer-composer",
  name: "Transfer Composer",
  category: "forms",
  description: "Send money in three honest steps: a big amount with the balance beside it, a review that states the fee and the business-day arrival date, then a receipt with a reference.",
  tags: ["fintech", "payments", "transfer", "banking", "form", "wizard"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["TransferComposer.tsx", "business-days.ts", "transfer-composer.css"],
  dependencies: [],
  prompt:
    "Build a money-transfer flow in a dark, precise fintech style: an #121214 panel with 18px corners and a 1px rgb(255 255 255 / 0.08) inner hairline, text #ededed, muted #8d8d93, Inter with tabular numbers, a periwinkle accent #8b93ff. Across the top, three progress segments (1 Details, 2 Review, 3 Sent): 2px top rules that turn white when done and accent when current.\n\nDetails: 'Send money', then a large borderless amount input (36–52px, 600, tight tracking) after a muted currency symbol on a single underline that turns accent on focus and red when the amount plus fee exceeds the balance. It groups digits as you type and allows two decimals. Under it, '$84,210.55 available in Operating' or the problem. A From select (account, last four, balance) and a To select (recipient, bank, last four) side by side from 34rem. 'How it travels': radio cards for ACH ('1–3 business days · Free') and Wire ('Arrives today · $25.00'); the chosen card gets an accent ring and faint accent fill. An optional memo. A full-width 'Review transfer' button, disabled until valid.\n\nReview: the amount at 36–48px, then a hairline-ruled list of To, From, Method, Arrives (computed by adding business days to today and skipping a configurable weekend, e.g. 'Mon, Oct 5' or 'Tue, Oct 6 – Thu, Oct 8'), Fee, Memo, and a highlighted total; then Edit and 'Send $1,200.00'. Sent: a soft green circle whose tick draws in, '$1,200.00 is on its way', when the recipient should see it, and a monospaced reference.",
  interaction:
    "Enter submits the details step when valid. Send awaits onSend({ from, to, method, amount, fee, memo, arrives }) in minor units; it's disabled while pending, a rejection stays on review with the reason in an alert, and success shows the returned reference. Edit returns to details with everything kept; Make another transfer clears the form. Focus moves to each step's heading.",
  animation: "Each step rises 6px into place; progress rules change colour; the receipt tick draws over 420ms. Reduced motion shows every step and the tick immediately.",
  a11y:
    "Progress is an ordered list with aria-current on the current step. The amount input is labelled with the currency and described by the balance or problem line, and marked aria-invalid. Methods are a fieldset of radios with the exact arrival dates in hidden text. Errors use role=alert; headings take focus as the step changes.",
  responsive: "Selects sit side by side from 34rem; method cards wrap; the amount scales with the container.",
  touchFallback: "Decimal keyboard for the amount; every control is a large tap target.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme: panel #121214, raised #18181b, wells #0e0e10, text #ededed, muted #8d8d93, faint #5b5b61, hairlines rgb(255 255 255 / 0.08) and 0.16, accent #8b93ff with #0b0b0c text, success #6ad8a0, error #ff8a80." },
    { id: "light", label: "Light", prompt: "Light theme: panel #ffffff, raised #f3f3f5, wells #fafafb, text #0c0c0d, muted #66666d, faint #a3a3aa, hairlines rgb(0 0 0 / 0.08) and 0.16, accent #4b53d6 with white text, success #18794e, error #c2322a." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", frame: [760, 860] },
};
