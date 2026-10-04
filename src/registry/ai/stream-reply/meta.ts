import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "stream-reply",
  "name": "Stream Reply",
  "category": "ai",
  "description": "An assistant answer arriving token by token: words settle in from a soft blur, code types with highlighting in place, and you can stop and regenerate.",
  "tags": [
    "ai",
    "chat",
    "streaming",
    "llm",
    "message",
    "code",
    "tokens",
    "assistant"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "StreamReply.tsx",
    "stream-reply.css"
  ],
  "dependencies": [],
  "prompt": "Build an assistant reply that streams in token by token. Content is structured blocks — paragraphs, a list, and a code block whose code is a list of pre-highlighted runs (keyword, string, function, number, comment) — tokenised into words for prose and 4-character chunks for code, so highlighting is correct from the first character. A timer reveals tokens at about 38 per second with natural burstiness (occasionally two at once, jittered gaps); each new token settles in from opacity 0 and a 5px blur over 420ms instead of popping. A soft glowing caret (accent block with a halo, breathing) rides the end of the newest token; the assistant avatar (a conic gradient) turns slowly while it writes. A footer shows \"Writing · 41 tok/s\" with a pulse dot and a Stop button; stopping freezes the text exactly where it is (\"Stopped\"), and Regenerate replays it. Under reduced motion the whole answer appears at once.",
  "interaction": "Watch the answer stream in; press Stop to freeze it mid-sentence, then Regenerate to stream it again.",
  "animation": "~38 tokens/s with jitter; each token 420ms blur-in; caret and pulse breathe at 900ms; avatar turns while writing.",
  "a11y": "The streaming text isn't announced token by token (aria-live off); a hidden line announces when the response completes or stops. Stop and Regenerate are real buttons. Reduced motion shows the full answer immediately.",
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
