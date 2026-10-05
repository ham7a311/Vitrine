import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sentence-settings",
  name: "Sentence Settings",
  category: "forms",
  description: "Notification preferences written as the sentence they mean. Each underlined word is the current choice; press it and the alternatives open on a hairline under the word. The sentence rewrites itself to stay grammatical, and the only motion is a word changing.",
  tags: ["settings", "preferences", "notifications", "prose", "inline", "select", "typography", "quiet"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["SentenceSettings.tsx", "sentence-settings.css"],
  dependencies: [],
  prompt: `Build a settings form that is one paragraph of prose.

<SentenceSettings fields value onChange sentence theme motion />. fields maps each id to { label, options: [{ value, label }] }. sentence(value, slot) returns the paragraph as JSX and calls slot(id) wherever a choice belongs, so the caller controls the grammar: for example, choosing 'daily' drops 'on Sunday', choosing 'no' summary drops the time, and choosing 'nothing' drops 'by push' and the quiet hours clause.

Set the paragraph in a serif at clamp(1.35rem, 3.6vw, 1.85rem) with 1.55 line-height. Every slot is an inline button showing the current choice, underlined with a dotted 1.5px muted underline that becomes solid ink on hover or while open. It has aria-haspopup=listbox, aria-expanded, aria-controls and an aria-label of 'Field: Value'.

Opening a slot places a small listbox (a span with role=listbox holding role=option spans, since it lives inside a paragraph) absolutely under the word: 1px ring, no blur, no heavy shadow, the sans face, the selected option in ink with a small accent bullet. Focus goes to the selected option. ↑/↓/Home/End move, Enter or Space chooses, Escape or Tab closes, and focus returns to the word. Choosing calls onChange({...value, [id]: option}).

The only animation is a 140ms opacity fade on a word that has just changed (keyed by its value) and a 120ms fade on the listbox. A visually hidden polite live region repeats the full sentence's text whenever the value changes. Paper and Night themes; reduced motion removes both fades.`,
  interaction: "Press any underlined word and choose. Change 'weekly' to 'daily' and 'on Sunday' disappears; choose 'nothing' and the rest of the sentence folds away.",
  animation: "A 140ms fade on the word that changed. Nothing else moves.",
  a11y: "Each choice is a button with a listbox popup, labelled 'Field: Value'. Arrow keys, Home, End, Enter, Space, Escape and Tab behave as in a select; focus returns to the word. A polite live region announces the whole rewritten sentence after each change.",
  responsive: "It is prose: it wraps. The listbox is clamped to the viewport under 420px.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ss-accent #7a3b22; --ss-bg #ffffff; --ss-ink #1b1a17; --ss-line rgb(27 26 23 / 0.14); --ss-muted #77736b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ss-accent #e8b48f; --ss-bg #16171a; --ss-ink #ececea; --ss-line rgb(255 255 255 / 0.2); --ss-muted #8b8d93. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
