import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "type-delete-button",
  name: "Type to Delete",
  category: "buttons",
  description: "A danger-zone card for the things you can't take lightly: the delete button stays off until you type the exact name. Then it shows the work, confirms it's done, and offers a few seconds to undo.",
  tags: ["button", "delete", "destructive", "type to confirm", "danger zone", "confirm", "form", "undo"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["TypeDeleteButton.tsx", "type-delete-button.css", "danger.ts"],
  dependencies: [],
  prompt:
    "Build a danger-zone card for deleting a project ('atlas-web') where the delete button only turns on once the name is typed exactly. Inter at 500, 15px.\n\nPalette (light / dark): ink #171717 / #ededed, muted #5f5f5f / #a1a1a1, card #ffffff / #111111, hairline #e3e3e3 / #2a2a2a, red #dc2626 / #e5484d (hover #b91c1c / #f2555a), red wash #fef2f2 / #2a1215, red edge #fecaca / #5c1f24, red text #b91c1c / #ff6369, done green #15803d / #3fb950. Focus rings 2px #2563eb / #6ea8fe.\n\nCard: up to 30rem, 22px padding, 14px radius, a red-edged hairline. Heading 'Delete this project' (17px semibold), a muted sentence of consequences ('This removes atlas-web, its 14 deployments, every domain and all of its environment variables.'), a label 'Type atlas-web to confirm' with the name set as code, and a 40px mono input that gets a red edge and a soft red ring on focus. Right-aligned: a hairline 'Cancel' (clears the field) and a solid red 'Delete this project' with a bin icon that stays disabled until the text matches exactly, ignoring outer spaces. Enter submits.\n\nThe flow is a small state machine: idle → working → done → gone. Working shows a 16px red spinner and 'Deleting atlas-web…' for at least 0.9s and until the real work settles. Done shows a green tick that pops in (scale from 0.4 with a slight overshoot), 'Deleted atlas-web' and an 'Undo' pill whose 18px ring drains over 5s; focus moves to Undo. Undo restores and returns focus to the name field; when the ring empties it reads 'atlas-web was deleted' in muted text. Every step is announced in one polite live region. The progress, done and undo states appear inside the card.\n\nShow it centred on a #fafafa / #0a0a0a page; the demo resets 2.4s after the undo window closes.",
  interaction: "Type the name; Enter or the button deletes; Cancel clears the field; Tab reaches Undo afterwards.",
  animation: "The input's focus ring eases in over 0.15s and the done tick pops. Reduced motion removes the pop and the entrance.",
  a11y: "A labelled form and field with a described hint (the button turns on when the name matches exactly); disabled uses the native attribute; the undo pill states the seconds left; one polite status region announces each step.",
  responsive: "The card fills its container up to 30rem.",
  touchFallback: "Every control is a normal form control; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --tdlb-card #ffffff; --tdlb-edge #e3e3e3; --tdlb-field #ffffff; --tdlb-focus #2563eb; --tdlb-ink #171717; --tdlb-ok #15803d; --tdlb-red #dc2626; --tdlb-red-edge #fecaca; --tdlb-red-hover #b91c1c; --tdlb-red-ink #b91c1c; --tdlb-red-wash #fef2f2; --tdlb-soft #5f5f5f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --tdlb-card #111111; --tdlb-edge #2a2a2a; --tdlb-field #0a0a0a; --tdlb-focus #6ea8fe; --tdlb-ink #ededed; --tdlb-ok #3fb950; --tdlb-red #e5484d; --tdlb-red-edge #5c1f24; --tdlb-red-hover #f2555a; --tdlb-red-ink #ff6369; --tdlb-red-wash #2a1215; --tdlb-soft #a1a1a1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [900, 420] },
  isNew: true,
};
