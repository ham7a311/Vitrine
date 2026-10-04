import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "depth-dialog",
  name: "Depth Dialog",
  category: "overlays",
  description: "A confirmation dialog in three planes: the page steps back, the object you're deciding about lifts out of its row and docks behind the dialog, and the decision sits in front. Cancel sends it home.",
  tags: ["dialog", "modal", "confirm", "alertdialog", "destructive", "focus trap", "settings"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["DepthDialog.tsx", "depth-dialog.css"],
  dependencies: [],
  prompt: `Build a modal confirmation dialog where depth, not a dark overlay, carries the hierarchy: background → context → decision.

Three planes. (1) The page — any element passed as stageRef — recedes subtly: scale 0.985, translateY 6px, blur 1.5px, saturate 0.8, corners rounding to 18px over 560ms (cubic-bezier(.2,.8,.2,1)), and becomes inert. A light scrim fades in. (2) The context: the row the action came from (anchorRef) fades to 30% as if its content lifted out, and a surface flies from that row's rect to a small card docked behind the top edge of the dialog (Web Animations on translate/width/height, 460ms). The card holds a compact summary — monogram, name, meta line — and fades its content in when the surface lands. It is tucked 14px under the panel so the layering reads physically. (3) The decision panel rises 14px and scales .97 → 1 (380ms, 70ms delay).

Closing tells you what happened. Cancel, Escape or a backdrop click: the panel drops away and the surface flies back into its row, which returns to full opacity as it lands. Confirm: the card and panel leave together, because the object went with the decision.

Production behaviour: role dialog (alertdialog for danger), aria-modal, labelled and described; focus goes to [data-autofocus] or Cancel, Tab is contained, focus is pulled back if it escapes, and it returns to the triggering control on close. onConfirm may return a promise — the button shows a spinner and busy label and cancel is disabled until it settles. confirmDisabled supports type-to-confirm. contained renders inside a positioned parent instead of portalling to body. Paper (ivory, ink) and Night themes. Actions stack full-width below 22rem (container query).`,
  interaction: "Open either Danger zone action. Cancel to watch the project card fly home; confirm to watch it leave with the dialog.",
  animation: "Stage recession 560ms; context flight 460ms in / 400ms home; panel rise 380ms; confirm exit 240ms.",
  a11y: "dialog / alertdialog with aria-modal, aria-labelledby and aria-describedby. The page is inert while open; focus is trapped and restored to the trigger. Escape and backdrop close unless dismissible is false or a confirm is in flight. Reduced motion (media query or motion=\"reduced\") removes the recession, blur and flight: the planes simply fade in.",
  responsive: "Dialog width is min(100%, 28rem) with a 16px gutter; its body scrolls if content is tall. Actions stack below 22rem; the context card truncates.",
  touchFallback: "Tap the scrim to cancel; everything else is a button.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill" },
};
