import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "spend-controls",
  name: "Spend Controls",
  category: "forms",
  description: "A card's limit written as a sentence you can check — amount, reset period and allowed merchants — with a meter showing how much of the new limit is already spent before you save.",
  tags: ["fintech", "limits", "banking", "form", "card controls", "settings"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["SpendControls.tsx", "spend-controls.css"],
  dependencies: [],
  prompt:
    "Build a card spend-limit editor in a dark, precise fintech style: a #121214 panel with a 1px rgb(255 255 255 / 0.08) inner hairline and 16px corners, text #ededed, muted #8d8d93, Inter with tabular numbers, one periwinkle accent #8b93ff. Header: 'Spend controls' and 'Software · •••• 1907'.\n\nA 'Limit' field: a large amount input (26–32px, 600 weight) after a muted currency symbol, inside a 12px-radius well that gains an accent ring on focus and a red ring when the amount isn't above zero; it shows grouped digits on blur and raw digits while editing. Under it, preset pills ($500, $2,000, $5,000). A 'Resets' segmented control of real radio buttons (Per purchase, Daily, Monthly, Total) in a recessed track; the chosen segment is raised. 'Merchants' as toggle pills: 'Any merchant' plus categories, pressed pills invert to solid with a ✓.\n\nA summary well restates the rule as one sentence, joined with Intl.ListFormat: 'Software can spend up to $3,000.00 per month on Software and Travel.' Unless the period is per purchase, a 6px meter shows spend so far against the new limit with '$1,240.00 spent this month · $1,760.00 left'; when the limit is lower than what's already spent, the meter and text turn amber: 'purchases will be declined until next month.' Footer: a status line ('Unsaved changes', 'Saved. The new limit applies to the next purchase.', or an error), a quiet Discard, and an accent 'Save limit' button that's disabled until something changed.",
  interaction:
    "Every change updates the sentence and meter immediately. Save awaits onSave(rule) with limit in minor units; it's disabled while saving or unchanged, a rejection keeps the edits and says nothing changed, and Discard restores the last saved rule.",
  animation: "Pills, segments and the meter ease over 140–320ms. Reduced motion removes the transitions.",
  a11y:
    "The amount input is labelled and described by the live sentence; reset periods are a fieldset of radios; merchant pills are toggle buttons with aria-pressed; status messages use role=status. Focus rings use the accent.",
  responsive: "The segmented control becomes two rows under 26rem; pills wrap.",
  touchFallback: "Decimal keyboard on phones; every control is a tap target.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme: panel #121214, raised #18181b, field wells #0e0e10, text #ededed, muted #8d8d93, faint #5b5b61, hairlines rgb(255 255 255 / 0.08) and 0.16, accent #8b93ff with #0b0b0c text, warning #f5a524, error #ff8a80." },
    { id: "light", label: "Light", prompt: "Light theme: panel #ffffff, raised #f3f3f5, field wells #fafafb, text #0c0c0d, muted #66666d, faint #a3a3aa, hairlines rgb(0 0 0 / 0.08) and 0.16, accent #4b53d6 with white text, warning #b26b00, error #c2322a." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", frame: [760, 780] },
};
