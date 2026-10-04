import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "download-tray",
  "name": "Download Tray",
  "category": "micro",
  "description": "The arrow drops into the tray while a ring fills with real progress; when it's done a tick appears and the tray bounces.",
  "tags": [
    "download",
    "progress",
    "button",
    "icon",
    "ring",
    "file",
    "tick",
    "micro-interaction"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "DownloadTray.tsx",
    "download-tray.css"
  ],
  "dependencies": [],
  "prompt": "Build a round download button (56px) with a progress ring. Its icon is an arrow over an open tray. On press, the action is called with a progress callback: while it runs, the arrow repeatedly drops into the tray (translate −6px → 5px, fading in and out, 900ms loop) and a ring around the button (SVG circle, stroke-dashoffset from the circumference) fills with the reported progress. When it resolves, the ring turns green and full, the arrow is replaced by a tick drawing itself in, and the tray does a quick squash-and-stretch bounce from the bottom; after 2.2s it resets. Live progress is announced politely (\"Downloading 40%\", \"Download complete\"). The demo fakes the progress.",
  "interaction": "Click, tap, Space or Enter to start; the button shows progress and confirms when done.",
  "animation": "Arrow drop loop 900ms; ring follows real progress; tick 360ms; tray bounce 520ms; reset after 2.2s.",
  "a11y": "aria-busy while downloading and a label that changes to \"Downloaded\"; progress is announced in a status region. Reduced motion removes the looping drop and bounce.",
  "responsive": "A fixed-size control that sits inline wherever it's placed; nothing depends on screen width.",
  "touchFallback": "Works the same on touch; there's no hover-only behaviour.",
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
    "bg": "#f3f1ec",
    "mode": "fill",
    "height": 420
  },
};
