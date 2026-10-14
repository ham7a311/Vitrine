import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "till-receipt",
  name: "Till Receipt",
  category: "pricing",
  description: "Build a plan on the left and the receipt prints on the right: every choice feeds a new line out of the till with dotted leaders, the total rolls to its new figure digit by digit, and switching to yearly billing prints a fresh receipt with the saving on it — barcode and tear-off edge included.",
  tags: ["pricing", "calculator", "receipt", "plans", "add-ons", "billing", "checkout", "saas", "playful"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["TillReceipt.tsx", "till-receipt.css", "bill.ts"],
  dependencies: [],
  prompt:
    "Build a pricing builder whose summary is a printed till receipt. Props: shop, plans [{id, name, blurb, seat (pence per seat per month), included (minimum seats)}], addons [{id, name, price (pence), perSeat}], annualOff (0.2), cta, onCheckout and theme.\n\nMaths (a pure function, in whole pence): seats are at least the plan's included seats; a line for the plan (\"3 × £19.00\"), a line per chosen add-on (per-seat ones multiplied, with a detail line), the subtotal, a yearly saving of annualOff when billed yearly, the monthly total, and the yearly charge. Money formats as £1,234.50 with a real minus sign for the saving.\n\nLeft column: \"Build your plan\" — plans as radio cards (the input visually hidden, the checked card on a pale highlight with an outline, focus shown on the card), a seats stepper (− output + with labelled buttons, the minus disabled at the plan's minimum), add-on checkboxes with their prices, and a Monthly / Yearly −20% segmented radiogroup.\n\nRight column, the till: a dark slot bar the paper feeds out of, and the receipt in monospace on warm paper with a soft shadow and a zigzag tear along the bottom (a conic-gradient mask). It has the shop name spaced out in capitals, \"Quote · billed yearly\", dashed rules, the lines with dotted leaders to right-aligned amounts, the subtotal, the yearly saving in green, a large total whose digits roll (each digit a column of 0–9 translated by its value, 520ms) with \"/ month\", the yearly charge, a decorative barcode and a small footer line. Each line prints in when it appears — revealed from the top with a 5px drop (420ms, staggered 90ms) — and switching the billing re-keys the paper so a whole new receipt feeds down out of the slot (820ms). A checkout button sits under it, and a polite live region reads the new total.\n\nTwo themes, paper and night (the receipt stays paper-white in both). Below 720px the columns stack. Reduced motion removes the feeding, printing and rolling.",
  interaction: "Pick a plan, change seats, tick add-ons and switch billing; the receipt updates as you go.",
  animation: "Lines print in 420ms, 90ms apart; the total's digits roll in 520ms; a billing switch feeds a new receipt in 820ms. Reduced motion updates instantly.",
  a11y: "Real radios, checkboxes and buttons with labels; the seat count and the total are announced politely; the receipt is a labelled region with real text, and the rolling digits are hidden behind a plain-text copy.",
  responsive: "Two columns from 720px; stacked below, with the receipt under the builder.",
  touchFallback: "Every control is a normal tap target.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --tr-accent #1c1a16; --tr-accent-ink #f8f5ee; --tr-bg #f3efe6; --tr-ink #1c1a16; --tr-line rgba(28, 26, 22, 0.12); --tr-muted #6a655b; --tr-panel #ffffff; --tr-paper #fffdf8; --tr-paper-ink #24221d; --tr-paper-muted #6e695e; --tr-pick #fff6dc; --tr-pick-line #c79a2a; --tr-save #157a45; --tr-slot #2a2722. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --tr-accent #f1d27a; --tr-accent-ink #1d1708; --tr-bg #121214; --tr-ink #f1efea; --tr-line rgba(255, 255, 255, 0.1); --tr-muted #a09c93; --tr-panel #1b1b1f; --tr-paper #fbf8f0; --tr-paper-ink #24221d; --tr-paper-muted #6e695e; --tr-pick #2a2516; --tr-pick-line #f1d27a; --tr-save #157a45; --tr-slot #050506. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e9e4d8", mode: "center", height: 720 },
};
