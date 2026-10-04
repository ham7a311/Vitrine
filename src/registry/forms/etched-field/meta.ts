import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "etched-field",
  name: "Etched Field",
  category: "forms",
  description: "A text field whose label rises into a notch cut from the top border, with a frost outline that draws in on focus.",
  tags: ["input", "text-field", "form", "floating-label", "validation", "focus"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["EtchedField.tsx", "etched-field.css"],
  dependencies: [],
  prompt: `Design a text input that feels engraved. A 56px field with a hairline cream border and 10px radius. The label sits inside the field like a placeholder; when the field is focused or filled it rises 2.1rem and scales to 78% so it lands on the top border, and a 2px strip of the page colour behind it "cuts" the border so the label appears set into a notch.

On focus the hairline border is replaced by a frost-blue outline that draws itself in from left to right (clip-path inset over 420ms, ease-out-expo) plus a soft 4px halo. A tiny mono mark at the right shows state in more than colour: ✓ when filled, ! when invalid. Invalid turns the border, label, mark and message rose and shows a role=alert message; a hint can sit below in muted text. It is a real <input> with a real <label>, aria-invalid and aria-describedby wiring, and works with browser autofill (the :not(:placeholder-shown) selector floats the label for autofilled values).`,
  interaction: "Focus draws the outline and lifts the label; typing sets the check mark; errors swap in the rose state.",
  animation: "Label rise 280ms ease-out-expo; outline draw 420ms; halo/colour 200–250ms.",
  a11y: "Native input + label association; aria-invalid and aria-describedby; state conveyed by icon as well as colour; error is role=alert. Reduced motion shortens transitions to 1ms.",
  responsive: "Fills its container.",
  preview: { bg: "#0b080d", mode: "fill" },
};
