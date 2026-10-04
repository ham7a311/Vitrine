import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "wet-ink",
  name: "Wet Ink",
  category: "feedback",
  description: "Autosave you can see. Words written since the last confirmed save are wet ink, a little bluer and glossy; when the server confirms, they dry in the order they were written. What failed to save stays wet, so what is at risk is never a guess.",
  tags: ["autosave", "editor", "sync", "offline", "draft", "save state", "notes", "textarea"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["WetInk.tsx", "wet-ink.css"],
  dependencies: [],
  prompt: `Build a text editor whose save state is drawn in the text itself.

<WetInk value save label delay theme motion rows />. save(text) is async: resolve to dry the ink, throw to keep it wet.

Render the text twice: a transparent <textarea> absolutely positioned over a mirror <div> that draws the same string with identical font, padding and wrapping (white-space: pre-wrap, overflow-wrap: break-word), and the textarea's height is set from the mirror's offsetHeight. The mirror cuts the text into runs and colours each: dry, wet, failed or drying.

Track wet spans as { start, end, rev, at }. On every input, diff the old and new string by common prefix and suffix, then rebase the spans: spans before the edit stay, spans after it shift by the length delta, spans it cuts are split around it, and the inserted range becomes a new wet span; touching spans merge. Increment a revision each edit.

Debounce delay ms (900) after the last keystroke, then call save with a snapshot at revision R. On success, spans with rev <= R leave the wet list and are drawn as 'drying': a 700ms colour and gloss transition from wet to dry, with each stroke delayed 90ms after the previous one in the order it was written; spans written after R stay wet and trigger another save. On failure, spans with rev <= R stay wet, gain a dotted red underline, and the status line says '3 edits not saved' with a Retry button.

Wet is the ink colour shifted to a blue (#1f3f95) with text-shadow: 0 1px 0 rgb(255 255 255 / .9) for gloss; dry is the normal warm ink. The status line beneath (role=status, aria-live=polite) always says the same thing in words: Writing…, Saving…, All changes saved · 12:41, or N edits not saved, with a coloured dot. Wetness is never the only signal. Paper and Night themes; reduced motion removes the drying transition and the pulse.`,
  interaction: "Type: your new words are wet blue ink. Stop, and after a moment they dry. Switch to Offline or Fail next save and they stay wet, underlined, with a Retry.",
  animation: "Ink dries over 700ms, oldest strokes first (90ms apart); the saving dot pulses.",
  a11y: "A real labelled textarea sits above a decorative mirror. The status line is a polite live region that always states the save state in words, including how many edits are unsaved; colour and gloss are additive. Retry is a button and returns focus to the field. Reduced motion removes the drying transition.",
  responsive: "Fluid width; type and padding step down under 480px.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
