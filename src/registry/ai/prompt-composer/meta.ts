import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "prompt-composer",
  "name": "Prompt Composer",
  "category": "ai",
  "description": "A chat composer where attached files tuck into its top edge like tabs in a folder \u2014 they rise from behind it when added and sink back when removed. Send turns into stop while the reply streams.",
  "tags": [
    "ai",
    "chat",
    "composer",
    "prompt",
    "attachments",
    "textarea"
  ],
  "traits": [
    "keyboard",
    "click",
    "touch"
  ],
  "source": "original",
  "files": [
    "PromptComposer.tsx",
    "prompt-composer.css"
  ],
  "dependencies": [],
  "prompt": "Design a chat composer (think a calm Claude/ChatGPT-style input) whose attachments are part of the object. The composer body is a 22px-radius surface with a hairline ring and soft shadow; a textarea that grows with its content up to ~8 lines (Enter sends, Shift+Enter breaks); a tools row with a round attach button, a 'Search' toggle chip, a model chip whose label rolls up when it changes, a mic button, and a round ink send button.\n\nAttached files are not chips inside the box: they are tabs standing on the composer's top edge, in the same surface colour, with rounded top corners, a hairline on their top and sides, and small inverse-radius corners (radial-gradient pseudo-elements) so each tab grows out of the edge like a folder tab. Each tab has a coloured three-letter type glyph (PDF / CSV / IMG / </>), a truncated file name and a remove \u00d7. A new tab rises from behind the edge (translateY 100% \u2192 0, 520ms expo-out, staggered 50ms); a removed tab sinks back behind it (360ms ease-in) before leaving the DOM. The tabs row animates its height open, and the body's top-left corner tightens when tabs are present. Files come from the picker, drag-and-drop or paste.\n\nSending clears the text and sinks the tabs; the send button's arrow lifts out and a stop square scales in while a thin accent arc turns around the button until the reply finishes (click it to stop). Ship a warm paper theme (ivory, clay accent) and a night theme.",
  "interaction": "Type and press Enter (Shift+Enter for a new line); attach via +, drag-and-drop or paste; remove a file with its \u00d7; while generating, the send button stops the reply.",
  "animation": "Tabs rise 520ms / sink 360ms from behind the top edge; textarea auto-grows; model label rolls 360ms; send \u2192 stop morph with a 1.1s turning arc.",
  "a11y": "Labelled textarea; tabs are a list with 'Remove file' buttons; icon buttons have labels; model and search chips expose state (aria-pressed / label); 'Generating a reply' is announced. Reduced motion makes every transition instant.",
  "responsive": "Fluid up to 44rem; tabs truncate their names and cap at six.",
  "variants": [
    {
      "id": "paper",
      "label": "Paper"
    },
    {
      "id": "night",
      "label": "Night"
    }
  ],
  "preview": {
    "bg": "#f5f1e8",
    "mode": "fill"
  },
  "touchFallback": "Every control is a real button at 34\u201338px; the file picker works on mobile and pasted images attach.",
  "featured": true
};
