import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "context-meter",
  "name": "Context Meter",
  "category": "ai",
  "description": "How full the model's context window is, and with what: one bar split by instructions, files, conversation and tools, warning near the limit and squeezing on compact.",
  "tags": [
    "ai",
    "context",
    "tokens",
    "llm",
    "meter",
    "usage",
    "progress",
    "chat"
  ],
  "traits": [
    "click",
    "hover",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "ContextMeter.tsx",
    "context-meter.css"
  ],
  "dependencies": [],
  "prompt": "Build a context-window meter for an AI chat. One 14px pill track shows the window (200k tokens) with segments for what's using it — Instructions, Files, Conversation, Tool results — each in a fixed series colour from a colour-blind-checked palette, separated by 2px gaps, widths animating (650ms, ease-out) whenever they change. A thin tick marks 90%. Above it: the used total as a large tabular number over the limit, and a percentage that turns amber past 75% and red past 90%, where the track also gets a slow pulsing red ring. Hovering a segment (or its legend row) dims the others and the hint line explains it (\"Files: 38.4k tokens (34% of what's used)\"); otherwise the hint describes the state (\"Plenty of room\", \"Getting full…\", \"Almost full — compact to keep going\"). Buttons add a file or a long reply; Compact squeezes the bar (a quick vertical squash with desaturation) and replaces the conversation with a summary about 8% of its size and trims tool results. The track is a role=\"meter\" with a full text value.",
  "interaction": "Hover segments or legend rows to see what's using the context; add a file or a long reply, then Compact to summarise.",
  "animation": "Segment widths 650ms; compact squash 650ms; warning ring pulses every 1.6s past 90%.",
  "a11y": "The bar is role=\"meter\" with aria-valuenow/max and a valuetext listing every segment; the hint is a polite live region; the legend repeats every colour with its label. Reduced motion removes the transitions and pulse.",
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
