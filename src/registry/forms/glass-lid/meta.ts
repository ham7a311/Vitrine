import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-lid",
  name: "Glass Lid",
  category: "forms",
  description: "Read-only settings kept under a pane of glass. Edit lifts the lid on its top edge and the values become fields in place; Save lowers it. A section someone else manages keeps its lid shut and says who holds the key.",
  tags: ["settings", "form", "edit", "read-only", "view mode", "billing", "locked", "admin"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["GlassLid.tsx", "glass-lid.css"],
  dependencies: [],
  prompt: `Build a settings section with a read mode and an edit mode, where the difference is a physical one: in read mode the values sit under glass.

<GlassLid title description fields={[{ id, label, value, type?, hint?, required? }]} onSave lockedBy? theme motion />. It is a <form> with a header (title, description, and an Edit button or, when lockedBy is set, a small lock and "Managed by …"). Below the header is the case: a definition list of label/value rows separated by hairlines, and over it an absolutely positioned pane.

The pane is restrained glass, not frosted blur: a 1px frost-blue inset edge, a 1px white top bevel, a faint vertical tint, and one skewed reflection band inside it. It has pointer-events: none, so values can still be selected and copied.

Edit hinges the pane on its top edge: the case has perspective: 1100px (origin at the top), and the pane goes from rotateX(0) to rotateX(-89deg) over 640ms, so it swings back on its hinge and recedes to a foreshortened sliver above the rows, like the propped lid of a display case. At the same time each value becomes an input in exactly the same place (same 34px line box), and focus moves to the first field. A footer with Cancel and Save appears. Save is disabled until something has changed.

Save calls onSave(values): while it runs the fields are disabled and the button reads "Saving…". If it resolves, the lid lowers and focus returns to Edit; if it throws, the lid stays open and the message shows in a role=alert line. Escape or Cancel discards and lowers the lid.

Below 480px, rows stack label over value. Reduced motion (the media query, or motion="reduced") skips the hinge and fades the pane out. Paper and Night themes.`,
  interaction: "Press Edit to lift the lid and edit in place; Save or Cancel lowers it. Escape cancels. The locked card can't be opened.",
  animation: "The lid hinges on its top edge, rotateX 0 → -89° in 640ms on an ease-out, and lowers the same way. Nothing else moves.",
  a11y: "A real <form> with labelled inputs; focus goes to the first field on edit and back to Edit on close. A status region announces editing, saved and discarded. Errors use role=alert. The pane is aria-hidden and never blocks pointer or text selection. Locked sections say who manages them, in text.",
  responsive: "Rows stack below 480px; the lid scales with the case.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --gl-accent #1b1a17; --gl-bg #ffffff; --gl-error #b42318; --gl-field #faf9f6; --gl-frost #9fb6d3; --gl-frost-deep #4e6d93; --gl-glass rgb(185 204 228 / 0.1); --gl-ink #1b1a17; --gl-line rgb(27 26 23 / 0.09); --gl-muted #77736b; --gl-on-accent #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --gl-accent #ececea; --gl-bg #16171a; --gl-error #f0766e; --gl-field #1c1d21; --gl-frost #b9cce4; --gl-frost-deep #8fa9cb; --gl-glass rgb(185 204 228 / 0.06); --gl-ink #ececea; --gl-line rgb(255 255 255 / 0.08); --gl-muted #8b8d93; --gl-on-accent #16171a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
