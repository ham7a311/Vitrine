import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "upload-button",
  name: "Upload Button",
  category: "buttons",
  description: "Click or drop a file and the button becomes its own progress: the file's name, a live percentage and a cancel cross, then a green tick, or a plain reason it failed with Retry.",
  tags: ["upload", "file", "progress", "button", "attachment", "drag and drop", "cancel", "retry"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["UploadButton.tsx", "upload-button.css", "upload.ts"],
  dependencies: [],
  prompt:
    "Build a file upload button that turns itself into the upload's progress. Inter at 500, 15px.\n\nPalette (light / dark): ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, card #ffffff / #141414, hairline #e2e2e2 / #2b2b2b, dashes #c9c9c9 / #3d3d3d, solid button #111111 with white text / #ededed with #0a0a0a text, accent #2563eb / #6ea8fe with a wash of #eff4ff / #101b2e, track #ececec / #262626, done #15803d / #3fb950, error #c81e1e / #ff6369.\n\nIdle: a 44px solid button with 12px corners, an up-arrow-into-tray icon (it lifts 2px on hover) and 'Upload file'. Dragging a file over it adds a 3px accent ring and reads 'Drop to upload'. Once a file is chosen it becomes a 20rem bar (card colour, hairline, 12px corners) that widens out of the button in 0.25s: a document icon, the name (ellipsis), the percentage in tabular figures and a 28px round cross; a pale accent wash fills it from the left as the progress. Done: a green tick that pops in, the name and a 'Replace' text button.\n\nBehaviour: a hidden <input type=file> opened by a real button; dropping a file on the control works too (with a visible drag state). Check the file against accept and a size limit first and say why in plain words if it's refused ('That file is 31 MB; the limit is 20 MB.'). Uploading takes an upload(file, progress, signal) function; the default simulates a believable transfer (uneven but always forward, 1.1–4.2s by size) and fails when the browser is offline. Cancel aborts it. A failure shows the reason and 'Retry', which sends the same file again. Long names are shortened in the middle, keeping the extension. Progress is announced in quarters in a polite live region, along with the start, the end, cancelling and errors.\n\nShow it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "Click (or Enter/Space) to choose a file, or drop one on the button. While uploading, the cross cancels. When done, Replace picks again; when it fails, Retry resends.",
  animation: "Progress follows the transfer frame by frame; the bar widens out of the button in 0.25s; the tick pops. Reduced motion keeps the progress but drops the entrances and lifts.",
  a11y: "Real buttons; the hidden input is out of the tab order. Progress is a progressbar with its value; the cancel cross is labelled with the file name; errors are text, not just colour; progress is announced in quarters.",
  responsive: "The bar is at most 20rem (86vw on phones).",
  touchFallback: "Tapping opens the system file or photo picker; drag and drop is an extra, not a requirement.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --upl-accent #2563eb; --upl-bad #c81e1e; --upl-btn #111111; --upl-btn-ink #ffffff; --upl-card #ffffff; --upl-dash #c9c9c9; --upl-edge #e2e2e2; --upl-focus #2563eb; --upl-ink #111111; --upl-ok #15803d; --upl-soft #6b6b6b; --upl-track #ececec; --upl-wash #eff4ff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --upl-accent #6ea8fe; --upl-bad #ff6369; --upl-btn #ededed; --upl-btn-ink #0a0a0a; --upl-card #141414; --upl-dash #3d3d3d; --upl-edge #2b2b2b; --upl-focus #6ea8fe; --upl-ink #ededed; --upl-ok #3fb950; --upl-soft #a0a0a0; --upl-track #262626; --upl-wash #101b2e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 420] },
};
