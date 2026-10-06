import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "danger-button",
  name: "Danger Button",
  category: "buttons",
  description: "A destructive action with the right amount of friction: it asks in place with Cancel and Delete, or fills while you hold it, or waits for you to type the name. Then it shows the work, confirms it's done, and offers a few seconds to undo.",
  tags: ["button", "delete", "destructive", "danger", "confirm", "cancel", "undo", "hold to confirm", "type to confirm"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["DangerButton.tsx", "danger-button.css", "danger.ts"],
  dependencies: [],
  prompt:
    "Build a button for deleting a project ('atlas-web'), with confirmation, progress, a done state and an undo window, in the one confirmation style selected below. Inter at 500, 15px.\n\nPalette (light / dark): ink #171717 / #ededed, muted #5f5f5f / #a1a1a1, card #ffffff / #111111, hairline #e3e3e3 / #2a2a2a, red #dc2626 / #e5484d (hover #b91c1c / #f2555a), red wash #fef2f2 / #2a1215, red edge #fecaca / #5c1f24, red text #b91c1c / #ff6369, done green #15803d / #3fb950. Focus rings 2px #2563eb / #6ea8fe.\n\nThe flow as a small state machine: idle → (asked) → working → done → gone. Working shows a 16px red spinner and 'Deleting atlas-web…' for at least 0.9s and until the real work settles. Done shows a green tick that pops in (scale from 0.4 with a slight overshoot), 'Deleted atlas-web' and an 'Undo' pill whose 18px ring drains over 5s; focus moves to Undo. Undo restores and returns focus to the start button; when the ring empties it reads 'atlas-web was deleted' in muted text. Every step is announced in one polite live region.\n\nShow it on a #fafafa panel and a #0a0a0a panel side by side; the demo resets 2.4s after the undo window closes.",
  interaction: "Keyboard works throughout: Escape cancels the question, Space or Enter can be held to confirm, Enter submits the typed name, Tab reaches Undo.",
  animation: "The question opens with a 0.22s wipe, its 2px timer runs out over 6s, the hold fill follows your press frame by frame and drains at twice the speed, the done tick pops. Reduced motion removes the wipe and pop and turns the hold fill into a simple on/off.",
  a11y: "Real buttons and a labelled form. The question is a labelled group and puts focus on Cancel; the undo pill states the seconds left; the hold button has a described hint ('Keep holding to confirm'); one polite status region announces each step.",
  responsive: "Inline forms stay one line (the question text hides under 30rem); the card fills up to 30rem; the two panels stack on narrow screens.",
  touchFallback: "Holding works with a finger (pointer capture, no context menu or scrolling while held).",
  variants: [
    { id: "inline", label: "Inline confirm", prompt: "Inline confirm: the resting button is a quiet red-outlined pill (42px tall, 10px radius, red wash fill, red text, a bin icon, 'Delete project') that fills solid red with white text on hover. Pressing it opens, in the same spot, a card-coloured box with a red edge and a soft shadow: 'Delete atlas-web?', a hairline 'Cancel' and a solid red 'Delete' (both 32px). Focus goes to Cancel. A 2px red line along its bottom runs out over 6s and then the question cancels itself; pointing at the box holds the timer. Escape or Cancel returns to the button." },
    { id: "hold", label: "Hold to confirm", prompt: "Hold to confirm: one 42px button reading 'Hold to delete project' (red text on the red wash, 13.5rem wide). While pressed (pointer, or Space or Enter held), a solid red layer with white text is revealed from the left in step with the hold, filling in 1.2s, and the label reads 'Keep holding…'. Letting go drains it at twice the speed and shows 'Keep holding to confirm' under the button. A full fill confirms. Use pointer capture, no context menu, no touch scrolling while held." },
    { id: "type", label: "Type to confirm", prompt: "Type to confirm: a danger-zone card (up to 30rem, 22px padding, 14px radius, red edge): heading 'Delete this project', a muted sentence of consequences ('This removes atlas-web, its 14 deployments, every domain and all of its environment variables.'), a label 'Type atlas-web to confirm' with the name set as code, a 40px mono input that gets a red edge and a soft red ring on focus, then right-aligned 'Cancel' (clears the field) and a solid red 'Delete this project' that stays disabled until the text matches exactly (ignoring outer spaces). Enter submits. The progress, done and undo states appear inside the card." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [1100, 520] },
  isNew: true,
};
