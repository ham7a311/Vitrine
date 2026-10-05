import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "plain-consent",
  name: "Plain Consent",
  category: "overlays",
  description: "Cookie consent without the tricks: reject and accept are the same size and weight, side by side, with a ledger of exactly what each category stores, for how long and who sets it. Once chosen, the card folds into a tab, so changing your mind is one click.",
  tags: ["cookies", "consent", "privacy", "gdpr", "banner", "preferences", "dialog", "legal"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["PlainConsent.tsx", "plain-consent.css"],
  dependencies: [],
  prompt: `Build a cookie consent notice that a regulator and a reader would both call fair.

The card sits at the bottom-left of the viewport (or of a positioned parent when contained), 25rem wide at most, with a 12px radius, a 1px ring and a soft shadow. It is a labelled region, not a modal: the page behind stays usable, there is no scrim and no focus trap. Mono caps eyebrow "Cookies"; a 24px serif heading "What this site keeps on your device"; one plain sentence saying how many things are essential and how many need a yes.

Two buttons of identical size, weight and style, side by side: "Reject non-essential" and "Accept all". Both are 44px high with a 1px ink inset ring and fill with ink on hover. Neither is coloured, enlarged or placed to look like the default.

Beneath them a text button "See exactly what each one does" (chevron rotates) folds a ledger open (grid-template-rows 0fr to 1fr, 320ms). Each category is a row: its name in a serif and either "Always on" (essential ones) or a real switch (a native checkbox with role=switch, 44px hit area, 34 by 20px track); a sentence about what it stores and why; and two small facts, "Lasts" and "Set by". A "Save these choices" button, same style, closes the ledger.

After any decision: persist the choices in localStorage inside try/catch (read after mount so server and client agree; nothing animates until read), call onChange, and fold the card away (fade and 8px drop, 320ms) while a pill tab fades in at the same corner reading "Cookie choices · 2 of 3 optional on". Focus moves to the tab. Pressing the tab reopens the card and focuses its heading. The hidden side is inert and aria-hidden. Paper and Night themes.`,
  interaction: "Choose Accept or Reject (or open the ledger and set each one), then press the tab left in the corner to change your mind.",
  animation: "Ledger folds in 320ms; the card fades and drops 8px in 320ms while the tab rises in after a 120ms delay; switches slide 200ms.",
  a11y: "A labelled region (not a modal) with no trap; switches are native checkboxes with role=switch, named by their category and described by what it stores. The ledger is a real list with a description list per row. The folded-away side is inert and aria-hidden, and focus moves to the control that appears. Reduced motion makes every change instant.",
  responsive: "Width is min(25rem, 100% - 32px) so it fits any screen; on short screens the card scrolls inside itself.",
  touchFallback: "Every control is 44px; nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 560, frame: [760, 520] },
  isNew: true,
};
