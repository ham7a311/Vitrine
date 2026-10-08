import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "drop-upload-button",
  name: "Upload Drop Zone",
  category: "buttons",
  description: "A wide dashed target for files: drop one on it or click to browse. Dragging over it lifts the cloud and turns the edge solid; once a file is chosen it becomes a file card with a progress bar, then a tick, or a plain reason it failed with Retry.",
  tags: ["upload", "file", "dropzone", "drag and drop", "progress", "browse", "attachment", "retry"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["UploadDropZone.tsx", "drop-upload-button.css", "upload.ts"],
  dependencies: [],
  prompt:
    "Build a file drop zone that turns itself into the upload's progress. Inter at 500, 15px.\n\nPalette (light / dark): ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, card #ffffff / #141414, hairline #e2e2e2 / #2b2b2b, dashes #c9c9c9 / #3d3d3d, solid button #111111 with white text / #ededed with #0a0a0a text, accent #2563eb / #6ea8fe with a wash of #eff4ff / #101b2e, track #ececec / #262626, done #15803d / #3fb950, error #c81e1e / #ff6369.\n\nIdle: a card up to 28rem wide and at least 104px tall with a 1.5px dashed edge and 16px corners: a 52px rounded square with a cloud-and-arrow icon, 'Drop a file here or browse' (browse underlined in the accent) and 'PDF, PNG or JPG, up to 20 MB' in muted 13px. Dragging over it turns the edge solid accent, washes it pale and lifts the icon 4px ('Drop to upload'). During the upload it becomes a card with a document tile, the shortened name, 'x MB of y MB', a 4px accent progress bar, the percentage and a cancel cross; done turns the bar green, shows a tick and 'Upload another'.\n\nBehaviour: a hidden <input type=file> opened by a real button; dropping a file on the control works too (with a visible drag state). Check the file against accept and a size limit first and say why in plain words if it's refused ('That file is 31 MB; the limit is 20 MB.'). Uploading takes an upload(file, progress, signal) function; the default simulates a believable transfer (uneven but always forward, 1.1–4.2s by size) and fails when the browser is offline. Cancel aborts it. A failure shows the reason and 'Retry', which sends the same file again. Long names are shortened in the middle, keeping the extension. Progress is announced in quarters in a polite live region, along with the start, the end, cancelling and errors.\n\nShow it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "Click (or Enter/Space) to browse, or drop a file on it. While uploading, the cross cancels. When done, 'Upload another' resets; when it fails, Retry resends.",
  animation: "Progress follows the transfer frame by frame; dragging lifts the cloud 4px; the tick pops. Reduced motion keeps the progress but drops the entrances and lifts.",
  a11y: "Real buttons; the hidden input is out of the tab order. Progress is a progressbar with its value; the cancel cross is labelled with the file name; errors are text, not just colour; progress is announced in quarters.",
  responsive: "The zone fills its container up to 28rem.",
  touchFallback: "Tapping opens the system file or photo picker; drag and drop is an extra, not a requirement.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --dzub-accent #2563eb; --dzub-bad #c81e1e; --dzub-btn #111111; --dzub-btn-ink #ffffff; --dzub-card #ffffff; --dzub-dash #c9c9c9; --dzub-edge #e2e2e2; --dzub-focus #2563eb; --dzub-ink #111111; --dzub-ok #15803d; --dzub-soft #6b6b6b; --dzub-track #ececec; --dzub-wash #eff4ff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --dzub-accent #6ea8fe; --dzub-bad #ff6369; --dzub-btn #ededed; --dzub-btn-ink #0a0a0a; --dzub-card #141414; --dzub-dash #3d3d3d; --dzub-edge #2b2b2b; --dzub-focus #6ea8fe; --dzub-ink #ededed; --dzub-ok #3fb950; --dzub-soft #a0a0a0; --dzub-track #262626; --dzub-wash #101b2e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 420] },
};
