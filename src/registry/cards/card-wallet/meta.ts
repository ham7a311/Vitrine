import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "card-wallet",
  name: "Card Wallet",
  category: "cards",
  description: "Virtual cards as a small physical stack: the chosen card sits in front, its details stay masked until asked for and hide again on a visible countdown, and a frozen card is hatched like a voided cheque.",
  tags: ["fintech", "virtual card", "banking", "wallet", "security", "dashboard"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["CardWallet.tsx", "card-wallet.css"],
  dependencies: [],
  prompt:
    "Build a virtual-card wallet in a dark, precise fintech style: near-black page #0b0b0c, panels #121214, hairlines rgb(255 255 255 / 0.08), text #ededed and muted #8d8d93, Inter with tabular numbers, one restrained periwinkle accent #8b93ff. Two columns from 46rem (stack and list left, details right), one below.\n\nThe stack: up to four flat card faces (credit-card ratio 1.586, 14px corners, a 1px inner highlight and a soft drop shadow) share one grid cell. The selected card is in front; each card behind is lifted 14px, scaled down 5% and darkened 12% per step, so the stack reads as depth, and every face transitions between positions over 420ms because the DOM order never changes (z-index follows the selection). Faces are solid colours (graphite, ink blue, plum, moss, sand) with the nickname, a small 'VIRTUAL' label, a translucent chip, '•••• 4821' and the expiry. A frozen card gets a fine 135° hatch over its face and a 'FROZEN' pill. Under the stack, a radio list of cards: a 22×15 colour swatch, nickname, '•••• 1907 · Frozen', and spend this month.\n\nThe details panel: nickname and holder, '$13,420.50 of $15,000.00 this month' over a 6px meter (amber above 85%), then a hairline grid of Card number (full width), Expires and CVC, masked until 'Show details'. Revealed values blur in, each gets a Copy button, and the button becomes 'Hide details' with a 16px ring that drains over 30 seconds before the details mask themselves again. Beside it a 'Freeze card' switch.",
  interaction:
    "Show details awaits reveal(id) (your server, after any step-up); it's disabled while pending and for frozen cards, and failures show a message. Details re-mask on the countdown, on Hide, or when another card is chosen. The freeze switch flips immediately, calls onFreeze, and rolls back with an explanation if it rejects. Copy confirms only after the clipboard accepts.",
  animation:
    "Faces move between stack positions over 420ms; revealed numbers fade in from a 3px blur; the countdown ring drains linearly; the switch thumb slides in 200ms. Reduced motion keeps the stack static and removes the blur and slides.",
  a11y:
    "The stack is decorative (aria-hidden); a fieldset of real radio buttons chooses the card. The details are a section labelled by the nickname; spend is a meter with a spoken value; Freeze is a role=switch with aria-checked; the countdown is described in hidden text and the status line announces failures.",
  responsive: "Side by side from a 46rem container, stacked below; the card number on the face scales with the container.",
  touchFallback: "Everything is a tap target; nothing depends on hover.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme: page #0b0b0c, panels #121214, raised rows #18181b, text #ededed, muted #8d8d93, faint #5b5b61, hairlines rgb(255 255 255 / 0.08) and 0.16 for stronger ones, accent #8b93ff, warning amber #f5a524, error #ff8a80. Card faces: graphite #1f1f23, ink #1a2554, plum #3b2049, moss #22382b, sand #ddd3c3 with dark text." },
    { id: "light", label: "Light", prompt: "Light theme: page #f6f6f7, panels #ffffff, raised rows #f3f3f5, text #0c0c0d, muted #66666d, faint #a3a3aa, hairlines rgb(0 0 0 / 0.08) and 0.16, accent #4b53d6, warning #b26b00, error #c2322a; card faces keep the same solid colours." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", frame: [1100, 700] },
};
