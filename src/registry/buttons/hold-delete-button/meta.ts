import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "hold-delete-button",
  name: "Hold to Delete",
  category: "buttons",
  description: "No dialog: the button itself is the confirmation. A red fill grows across it while you hold it and drains if you let go, and only a full hold deletes. Then it shows the work, confirms it's done, and offers a few seconds to undo.",
  tags: ["button", "delete", "destructive", "hold to confirm", "press and hold", "long press", "danger", "undo"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["HoldDeleteButton.tsx", "hold-delete-button.css", "danger.ts"],
  dependencies: [],
  prompt:
    "Build a 'hold to delete' button for a project ('atlas-web'): the press itself is the confirmation. Inter at 500, 15px.\n\nPalette (light / dark): ink #171717 / #ededed, muted #5f5f5f / #a1a1a1, card #ffffff / #111111, hairline #e3e3e3 / #2a2a2a, red #dc2626 / #e5484d (hover #b91c1c / #f2555a), red wash #fef2f2 / #2a1215, red edge #fecaca / #5c1f24, red text #b91c1c / #ff6369, done green #15803d / #3fb950. Focus rings 2px #2563eb / #6ea8fe.\n\nThe button is 42px tall, at least 13.5rem wide, 10px radius, red text on the red wash with a red-edged hairline, a bin icon and 'Hold to delete project'. While pressed (pointer, or Space or Enter held) a solid red layer with white text is revealed from the left in step with the hold, filling in 1.2s, and the label reads 'Keep holding…'. Letting go drains it at twice the speed and shows 'Keep holding to confirm' under the button. A full fill confirms. Use pointer capture, no context menu, and no touch scrolling while held. With reduced motion the fill is simply on while held.\n\nThe flow is a small state machine: idle → working → done → gone. Working shows a 16px red spinner and 'Deleting atlas-web…' for at least 0.9s and until the real work settles. Done shows a green tick that pops in (scale from 0.4 with a slight overshoot), 'Deleted atlas-web' and an 'Undo' pill whose 18px ring drains over 5s; focus moves to Undo. Undo restores and returns focus to the start control; when the ring empties it reads 'atlas-web was deleted' in muted text. Every step is announced in one polite live region.\n\nShow it centred on a #fafafa / #0a0a0a page; the demo resets 2.4s after the undo window closes.",
  interaction: "Press and hold with a mouse, finger, or Space or Enter; release early to cancel; Tab reaches Undo afterwards.",
  animation: "The fill follows your press frame by frame and drains at twice the speed; the done tick pops. Reduced motion turns the fill into a simple on/off and removes the pop.",
  a11y: "A native button with a described hint ('Keep holding to confirm'); keyboard holding works with Space or Enter; the undo pill states the seconds left; one polite status region announces each step.",
  responsive: "A fixed-height button that keeps its width; nothing wraps.",
  touchFallback: "Holding works with a finger (pointer capture, no context menu, no scrolling while held).",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --hdlb-card #ffffff; --hdlb-edge #e3e3e3; --hdlb-field #ffffff; --hdlb-focus #2563eb; --hdlb-ink #171717; --hdlb-ok #15803d; --hdlb-red #dc2626; --hdlb-red-edge #fecaca; --hdlb-red-hover #b91c1c; --hdlb-red-ink #b91c1c; --hdlb-red-wash #fef2f2; --hdlb-soft #5f5f5f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --hdlb-card #111111; --hdlb-edge #2a2a2a; --hdlb-field #0a0a0a; --hdlb-focus #6ea8fe; --hdlb-ink #ededed; --hdlb-ok #3fb950; --hdlb-red #e5484d; --hdlb-red-edge #5c1f24; --hdlb-red-hover #f2555a; --hdlb-red-ink #ff6369; --hdlb-red-wash #2a1215; --hdlb-soft #a1a1a1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [900, 420] },
  isNew: true,
};
