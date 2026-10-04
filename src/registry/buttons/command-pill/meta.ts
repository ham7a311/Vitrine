import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "command-pill",
  "name": "Command Pill",
  "category": "buttons",
  "description": "An install command you can copy: the pill types itself once on arrival, and clicking lifts the command out as the word Copied rises in behind it.",
  "tags": [
    "button",
    "copy",
    "terminal",
    "install",
    "developer",
    "clipboard"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "CommandPill.tsx",
    "command-pill.css"
  ],
  "dependencies": [],
  "prompt": "Build a copyable install-command pill: a 46px dark rounded rectangle with a muted prompt glyph ($), the command in Geist Mono, and a small copy well on the right. When it first scrolls 60% into view, the command types itself once (38ms per character) with a block caret; the untyped remainder is reserved as invisible text so the pill never changes width.\n\nClicking copies to the clipboard: the command lifts up and out of a one-line window while 'Copied to clipboard' rises into its place in green (480ms expo-out), and the copy glyph shrinks away as a green check scales in; after 1.6s it all settles back. Hover strengthens the hairline; press compresses to 0.985.",
  "interaction": "Click (or Enter/Space) to copy; the confirmation replaces the command for 1.6s.",
  "animation": "One-time typing on first view; 480ms vertical exchange of command and confirmation; icon morph 380ms.",
  "a11y": "A button labelled 'Copy command: \u2026'; the visual text is aria-hidden; 'Copied' is announced. Reduced motion skips typing and makes the exchange instant.",
  "responsive": "Shrinks to its container; long commands clip inside the window.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Tap to copy."
};
