import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "attachment-tray",
  "name": "Attachment Tray",
  "category": "ai",
  "description": "File uploads where progress closes a ring around each file's glyph \u2014 when the ring meets itself it becomes a seal. Failures stay put with a retry, and removed files fold out of the list.",
  "tags": [
    "ai",
    "upload",
    "files",
    "progress",
    "attachments",
    "dropzone"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "AttachmentTray.tsx",
    "attachment-tray.css"
  ],
  "dependencies": [],
  "prompt": "Build an upload tray for chat attachments. Each file row has a 44px badge: a type glyph (PDF / CSV / IMG / </>, colour-coded) inside a thin track ring, with the progress drawn as a ring around it (pathLength=1, stroke-dashoffset = 1 \u2212 progress). When the ring closes the file is 'sealed': the ring thins and turns green and a small check seal springs onto its lower-right edge (overshoot). A failed upload turns its ring rose where it stopped, nudges the glyph, says 'Upload interrupted' and offers Retry, which resumes from that point.\n\nBeside the badge: the name (truncated) and a tabular mono readout ('1.2 MB of 4.8 MB' while uploading, just the size when done), a percentage, and a remove \u00d7. Removed rows fold out of the list (grid-template-rows 1fr \u2192 0fr + fade) instead of vanishing. The header shows 'Attachments 2/4'. The tray only lights up (accent ring + soft halo) while files are dragged over it; the drop area below says 'Release to attach' at that moment. Transport is simulated with uneven speed in the demo. Paper and night themes.",
  "interaction": "Drop files on the tray or use Add files / the drop area; remove with \u00d7; retry a failed upload.",
  "animation": "Ring progress per frame; seal springs in (420ms overshoot) and the ring thins on completion; rows fold out over 420ms; the tray glows while dragging.",
  "a11y": "Real buttons with labels; each completion or failure is announced through a status line; progress is also shown as text. Reduced motion keeps progress but removes springs and folds.",
  "responsive": "Fluid up to 30rem; file names truncate.",
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
  "touchFallback": "Add files opens the native picker; every control is a tap-sized button."
};
