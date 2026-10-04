import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "progressive-form",
  name: "Progressive Form",
  category: "forms",
  description: "One question at a time, with every answer written into a sentence above the field: pencilled in as you type, inked when you continue. When the last blank is filled, the sentence is the review.",
  tags: ["form", "onboarding", "multi-step", "wizard", "validation", "review", "signup"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["ProgressiveForm.tsx", "progressive-form.css"],
  dependencies: [],
  prompt: `Build a multi-step form that never shows a wall of fields and never looks like a wizard.

Above one live question sits a sentence composed by the consumer through template(slot), for example: "I'm {name} from {org}, a team of {size}, and we'd like to start on {plan} from {start}." It is set in a large editorial serif (Instrument Serif, clamp(1.55rem, 4.6vw, 2.15rem)).

Each slot has four states:
- blank: a 3.4em dotted rule.
- the current blank: a solid accent rule that breathes gently.
- pencil: as you type, the value appears in the slot in muted italic, so the sentence writes itself.
- ink: on Continue the words darken to full ink while an accent underline draws in from the left (520ms). Inked words are buttons that take you back to that question.

Progress shows as 'Step 2 of 5' plus a row of small ticks that fill as answers are inked. Steps are typed: text, email, number (a stepper with − / + buttons and arrow keys, min/max), choice (radio cards, including a disabled 'Enterprise — talk to sales') and date. Each can have a validate function and a summary function that formats how the value reads in the sentence.

Validation runs on Continue:
- an inline error in role=alert
- aria-invalid and aria-describedby on the field
- the slot turns red and dashed
- focus stays in the field

Enter continues; Back returns. After an edit from the review, Continue returns straight to the review. When everything is inked, the field is replaced by 'Does that read right?' and a definition list of every answer, each with Edit, then Create workspace. That shows a busy spinner and then a success line in the accent.

Question changes are a calm 8px rise and fade; focus moves to the new field. Paper and Night themes.`,
  interaction: "Answer each question and press Enter. Click any inked word in the sentence to change it.",
  animation: "Ink-in 520ms (colour, then an underline draws); question swap 360ms fade and rise; the current blank breathes over 1.6s.",
  a11y: "Real labels and legends, aria-invalid plus aria-describedby for errors and hints, and a role=alert error. The progress text is aria-live. Inked words are labelled buttons ('Plan: Pro. Edit'); blanks announce 'not yet answered'. Focus moves to each new question and to the review heading. Reduced motion removes the rise, the ink animation and the breathing blank.",
  responsive: "The sentence wraps naturally: answers flow inline, so a long name wraps like the words around it. Choices reflow with auto-fit, and the review list stacks labels on narrow screens.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#fbfaf6", mode: "fill" },
};
