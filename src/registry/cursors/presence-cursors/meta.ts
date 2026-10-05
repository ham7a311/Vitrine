import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "presence-cursors",
  name: "Presence Cursors",
  category: "cursors",
  description: "Other people, in the room. Collaborators' cursors move like hands — curved paths, a little overshoot, a settle, a faint tremor at rest — and act on the board: selecting a note in their colour, dragging it, typing in a bubble at their cursor. Press / to say something at yours.",
  tags: ["cursor", "multiplayer", "presence", "collaboration", "cursor chat", "realtime", "board", "figjam"],
  traits: ["cursor", "keyboard", "ambient"],
  source: "original",
  files: ["PresenceCursors.tsx", "presence-cursors.css"],
  dependencies: [],
  prompt: `Build a multiplayer presence layer: a wrapper that draws collaborators' cursors over a board and lets the local user post cursor-chat messages.

People: { id, name, color, script, offset? } where a script is a looping list of steps { to, dwell, act?, text? }. A target is either { pid, fx?, fy? } — an element in the board marked data-pid (or data-home, a fixed placeholder for returning something exactly) at a fraction of its box, defaulting to a seeded point in the middle third, because people point at words — or { x, y } as fractions of the host. Acts on arrival: select (the element gets data-by, --by colour and data-by-name, drawn as a 2px outline with the name tag on its corner), deselect, grab (select and carry: the element's translate follows the cursor's movement), drop, chat (type text into a bubble).

Motion, per person, in one rAF loop (paused offscreen and when the tab is hidden): each move is a cubic Bézier from the current point to the target, bowed to one side by up to a fifth of its length, with duration 260 + 170·log₂(1 + d/30) ms (Fitts-like) and ease-in-out-cubic. The drawn cursor follows that path through a spring (k 210, ζ 0.7), which adds the small overshoot and settle of a real hand. While resting it carries a sub-pixel tremor (two sines). Cursor: a 20px arrow in the person's colour with a white keyline (paint-order stroke) and a name pill. Chat bubble: under the pill, typed at 55ms per character with a blinking caret, held for 2.6s, then released; the person's status reads Editing, Moving a note, Typing or Viewing.

You: press / while the pointer is over the board (or focus is inside it) to open a labelled input at your pointer, or the centre from the keyboard. Enter posts a bubble in your colour that fades after 3.6s; Escape or blur cancels. A "Say something /" button opens the same input for touch and keyboard users. An avatar stack lists everyone with their status as visually hidden text. Coordinates are host-local and corrected for scaled hosts. Paper and Night boards.`,
  interaction: "Watch Maryam select, Yousef drag a note across and back, and Aisha type. Press / (or the Say something button) to post a message at your cursor.",
  animation: "Bézier paths with Fitts-like timing through a spring (k 210, ζ 0.7); tremor at rest; chat types at 55ms per character; selection outline 160ms; your bubble fades after 3.6s.",
  a11y: "The cursors are aria-hidden decoration; the avatar list names everyone with what they're doing. Cursor chat is a labelled text input reachable by keyboard (/ or the button), Enter posts and Escape cancels. Reduced motion jumps cursors between rest points and shows messages whole, with no glide, tremor or caret.",
  responsive: "Targets are elements and fractions, re-measured on every move, so scripts keep working as the columns stack on phones.",
  touchFallback: "The collaborators keep moving; the Say something button opens cursor chat without a keyboard shortcut.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --presence-cursors-bg #f6f5f1; --presence-cursors-chip #ffffff; --presence-cursors-ink #1d1c19; --presence-cursors-line rgb(0 0 0 / 0.1); --presence-cursors-ring #f6f5f1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --presence-cursors-bg #131416; --presence-cursors-chip #1d1e22; --presence-cursors-ink #eeece7; --presence-cursors-line rgb(255 255 255 / 0.1); --presence-cursors-ring #131416. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f5f1", mode: "fill" },
};
