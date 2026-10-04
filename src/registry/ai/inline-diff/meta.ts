import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "inline-diff",
  name: "Inline Diff",
  category: "ai",
  description: "An AI code edit proposed inside the file: new lines type in under the ones they replace, and accepting folds the old lines away so what's left simply looks like code.",
  tags: ["ai", "code", "diff", "editor", "review", "developer-tools"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["InlineDiff.tsx", "inline-diff.css"],
  dependencies: [],
  prompt: `Build an AI-editor inline diff in a dark IDE style (#141414 panel, 12px radius, a single file tab, Geist Mono 13px/1.7). Above the code, the instruction sits in a soft accent-tinted strip with a ✦ and a '+4 −1' stat.

The proposal is interleaved into the file: the replaced line gets a red tint, a − sign and a faint strike-through; the new lines appear beneath it one at a time (every 420ms), each folding open (grid-template-rows 0fr → 1fr) and 'typing' in via a stepped clip-path reveal, on a green tint with + signs. A footer shows 'Writing edit…' with a spinner, then Reject (⌘⌫) and Accept (⌘↵) buttons with key hints. Accept folds the deleted rows closed (480ms) and fades the green tint and + signs away so the additions become ordinary code; line numbers renumber. Reject folds the additions closed and un-strikes the original. A tiny regex highlighter colours keywords, strings, numbers and operators. 'Propose again' replays. The panel is focusable and handles the shortcuts.`,
  interaction: "Watch the edit being written, then Accept/Reject with the buttons or ⌘↵ / ⌘⌫ while the editor is focused.",
  animation: "Rows fold 480ms expo-out; additions type in with an 18-step clip reveal every 420ms; tints fade 400–700ms after a decision.",
  a11y: "The editor is a focusable region with a label and keyboard shortcuts; decisions are real buttons; status changes are announced. Reduced motion shows the full proposal immediately and switches states instantly.",
  responsive: "Fluid up to 40rem; long lines scroll horizontally inside the code area.",
  touchFallback: "The buttons cover everything the shortcuts do.",
  preview: { bg: "#0a0a0a", mode: "fill" },
};
