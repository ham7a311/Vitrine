import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "conflict-resolver",
  name: "Conflict Resolver",
  category: "time",
  description: "Merge two edits of the same record against the version they both started from. Changes only one side made are taken for you and labelled, tags combine as sets, long text merges line by line, and only the places where both sides changed the same thing ask you to choose, with each side's change marked against the original.",
  tags: ["merge", "sync", "conflict", "offline", "versions", "diff", "collaboration"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ConflictResolver.tsx", "conflict-resolver.css", "merge.ts"],
  dependencies: [],
  prompt:
    "Build a three-way merge screen for one record (an article with title, summary, status, tags, publish date and body) after two people edited it from the same starting version: 'Your offline copy' and 'Layla's edit'.\n\nRules: for every field compare base, yours and theirs. Unchanged stays; the same change on both sides is taken; a change on only one side is taken automatically and labelled 'Auto: Layla's edit'; tags merge as sets (additions from both, removals from both); long text merges line by line with diff3, so edits to different lines combine and only overlapping edits become conflicts; any other field changed differently on both sides is a conflict.\n\nLayout: a 14px-radius panel in Inter. Header: '2 conflicts left' in 18px semibold, a muted line with the automatic count and the keys (J K move · M keep yours · T take theirs), and a 4px progress bar that fills green as conflicts are resolved. Then one white card per field: a small uppercase label and a status on the right (muted for auto, amber 'Conflict'); unchanged fields are dimmed. A conflict card has an amber left rule (green once resolved) and three panes: Original (dimmed), Yours (blue label) and Theirs (purple label), where each side reads as its own text with the words it added or changed on a green wash (the dimmed original shows what was there). Under them a radio group of buttons: 'Keep your offline copy', 'Take Layla's edit', 'Keep both' (long text only) and 'Edit', which opens a textarea seeded with yours; the chosen side's pane gets a ring in its colour. In long text, unconflicted lines show as muted context between conflict cards.\n\nFooter: 'Resolve every conflict to save.' and a dark 'Save merged version' button, disabled until nothing is left; saving can fail and keep every choice.",
  interaction:
    "Click a choice or press M / T on a focused conflict card; J and K move between cards. Edit keeps your typing as the resolution. onResolve(merged) receives the complete record; it may reject, in which case the error shows and the choices stay.",
  animation: "Card rules change colour over 200ms and the progress bar eases over 300ms; side rings fade over 160ms. Reduced motion or motion={false} removes them.",
  a11y:
    "Each conflict is a labelled group that can take focus; its choices are a radiogroup of buttons with aria-checked and their shortcut keys declared. Every choice is announced with how many conflicts remain. Added words use ins elements, so they are exposed as insertions and not only by colour.",
  responsive: "Below 40rem the original pane is hidden and yours and theirs stack, each still marked against the original.",
  touchFallback: "Every choice is a button; keyboard shortcuts are optional.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --cres-add rgb(36 140 76 / 0.16); --cres-bad #b3261e; --cres-bg #fbfaf8; --cres-card #ffffff; --cres-ink #1d1c1a; --cres-line rgb(29 28 26 / 0.12); --cres-mine #2457c5; --cres-muted #6b6760; --cres-ok #23704a; --cres-theirs #8a3fb0; --cres-warn #b45309. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --cres-add rgb(90 200 130 / 0.2); --cres-bad #ff8a80; --cres-bg #141416; --cres-card #1b1b1e; --cres-ink #e9e8e4; --cres-line rgb(255 255 255 / 0.1); --cres-mine #86a8ff; --cres-muted #a19d95; --cres-ok #74d3a1; --cres-theirs #d39bf2; --cres-warn #f2b25c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ebe9e4", mode: "fill", frame: [1100, 900] },
  isNew: true,
};
