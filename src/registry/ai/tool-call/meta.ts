import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "tool-call",
  "name": "Tool Call",
  "category": "ai",
  "description": "An assistant's tool use shown as it happens: each call is a card with its arguments, a shimmering status while it runs, and a collapsible result.",
  "tags": [
    "ai",
    "agent",
    "tools",
    "function calling",
    "llm",
    "status",
    "chat",
    "json"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "ToolCall.tsx",
    "tool-call.css"
  ],
  "dependencies": [],
  "prompt": "Build a timeline of an assistant calling tools. Each step is a card that appears when its call starts (fade and rise 6px): a small status square — a spinner while running, a green tick when done — the function name in mono accent with its arguments inline as key: \"value\" pairs (ellipsised if long), and on the right a status that shimmers (\"Running…\", a moving gradient clipped to the text) and then becomes the result summary (\"6 flights\", \"Held until 15:42\"). Calls run in sequence, each with its own duration. Finished cards expand (aria-expanded, grid-template-rows 0fr → 1fr, chevron rotates) to show the full arguments as pretty JSON and any detail lines. When the last call finishes, the assistant's answer fades in below, and the footer reports \"3 tool calls · 3.9s\" with a Run again button. On narrow screens the status column hides.",
  "interaction": "Calls run on their own; expand a finished call to see its arguments and details, or run the whole sequence again.",
  "animation": "Card entry 420ms; spinner 700ms; shimmer 1.4s; expand 320ms; answer fade 400ms.",
  "a11y": "An ordered list of calls; each header is a button with aria-expanded once it's done. The final answer is announced politely. Reduced motion shows every call finished.",
  "responsive": "A card up to about 40rem wide that fills narrower screens; dense rows and side columns stack on phones.",
  "touchFallback": "Everything is tap-driven; hover hints have tap or focus equivalents.",
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
    "bg": "#efede8",
    "mode": "fill",
    "height": 620
  },
};
