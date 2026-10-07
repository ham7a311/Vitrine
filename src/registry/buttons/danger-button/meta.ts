import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "danger-button",
  name: "Danger Button",
  category: "buttons",
  description: "A destructive action that asks in place: the button opens into a short question with a safe Cancel and a red Delete, which gives up by itself after a few seconds. Then it shows the work, confirms it's done, and offers a few seconds to undo.",
  tags: ["button", "delete", "destructive", "danger", "confirm", "cancel", "undo", "inline"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["DangerButton.tsx", "danger-button.css", "danger.ts"],
  dependencies: [],
  prompt:
    "Build a button for deleting a project ('atlas-web') that asks for confirmation in place, with progress, a done state and an undo window. Inter at 500, 15px.\n\nPalette (light / dark): ink #171717 / #ededed, muted #5f5f5f / #a1a1a1, card #ffffff / #111111, hairline #e3e3e3 / #2a2a2a, red #dc2626 / #e5484d (hover #b91c1c / #f2555a), red wash #fef2f2 / #2a1215, red edge #fecaca / #5c1f24, red text #b91c1c / #ff6369, done green #15803d / #3fb950. Focus rings 2px #2563eb / #6ea8fe.\n\nResting: a quiet red-outlined pill (42px tall, 10px radius, red wash fill, red text, a bin icon, 'Delete project') that fills solid red with white text on hover. Pressing it opens, in the same spot, a card-coloured box with a red edge and a soft shadow (a 0.22s wipe): 'Delete atlas-web?', a hairline 'Cancel' and a solid red 'Delete' (both 32px). Focus goes to Cancel. A 2px red line along its bottom runs out over 6s and then the question cancels itself; pointing at the box holds the timer. Escape or Cancel returns to the button and its focus.\n\nThe flow is a small state machine: idle → working → done → gone. Working shows a 16px red spinner and 'Deleting atlas-web…' for at least 0.9s and until the real work settles. Done shows a green tick that pops in (scale from 0.4 with a slight overshoot), 'Deleted atlas-web' and an 'Undo' pill whose 18px ring drains over 5s; focus moves to Undo. Undo restores and returns focus to the start control; when the ring empties it reads 'atlas-web was deleted' in muted text. Every step is announced in one polite live region.\n\nShow it centred on a #fafafa / #0a0a0a page; the demo resets 2.4s after the undo window closes.",
  interaction: "Escape cancels the question; Tab reaches Cancel, Delete and then Undo; Enter and Space press the focused button.",
  animation: "The question opens with a 0.22s wipe and its 2px timer runs out over 6s; the done tick pops. Reduced motion removes the wipe, the pop and the entrance.",
  a11y: "Real buttons. The question is a labelled group that puts focus on the safe answer; the undo pill states the seconds left; one polite status region announces each step.",
  responsive: "The question stays on one line (its text hides under 30rem); the buttons never wrap.",
  touchFallback: "Every control is a normal button; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --dgr-card #ffffff; --dgr-edge #e3e3e3; --dgr-field #ffffff; --dgr-focus #2563eb; --dgr-ink #171717; --dgr-ok #15803d; --dgr-red #dc2626; --dgr-red-edge #fecaca; --dgr-red-hover #b91c1c; --dgr-red-ink #b91c1c; --dgr-red-wash #fef2f2; --dgr-soft #5f5f5f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --dgr-card #111111; --dgr-edge #2a2a2a; --dgr-field #0a0a0a; --dgr-focus #6ea8fe; --dgr-ink #ededed; --dgr-ok #3fb950; --dgr-red #e5484d; --dgr-red-edge #5c1f24; --dgr-red-hover #f2555a; --dgr-red-ink #ff6369; --dgr-red-wash #2a1215; --dgr-soft #a1a1a1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [900, 420] },
};
