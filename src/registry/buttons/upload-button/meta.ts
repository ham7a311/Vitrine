import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "upload-button",
  name: "Upload Button",
  category: "buttons",
  description: "Click or drop a file and the control becomes its own progress: the file's name, a live percentage and a cancel cross, then a green tick, or a plain reason it failed with Retry. As a compact button, a wide drop target, or a round photo picker.",
  tags: ["upload", "file", "drag and drop", "dropzone", "progress", "avatar", "button", "attachment"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["UploadButton.tsx", "upload-button.css", "upload.ts"],
  dependencies: [],
  promptAllow: ["button"],
  prompt:
    "Build a file upload control, in the one form selected below, that turns itself into the upload's progress. Inter at 500, 15px.\n\nPalette (light / dark): ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, card #ffffff / #141414, hairline #e2e2e2 / #2b2b2b, dashes #c9c9c9 / #3d3d3d, solid button #111111 with white text / #ededed with #0a0a0a text, accent #2563eb / #6ea8fe with a wash of #eff4ff / #101b2e, track #ececec / #262626, done #15803d / #3fb950, error #c81e1e / #ff6369.\n\nBehaviour: a hidden <input type=file> opened by a real button; dropping a file anywhere on the control works too (the drag state is shown). Check the file against accept and a size limit first and say why in plain words if it's refused ('That file is 31 MB; the limit is 20 MB.'). Uploading takes an upload(file, progress, signal) function; the default simulates a believable transfer (uneven but always forward, 1.1–4.2s by size) and fails when the browser is offline. Cancel aborts it. A failure shows the reason and 'Retry', which sends the same file again. Long names are shortened in the middle, keeping the extension. Progress is announced in quarters in a polite live region, with the start, the end, cancelling and errors.\n\nShow it on a #f6f6f5 panel and a #0a0a0a panel side by side.",
  interaction: "Click (or Enter/Space) to choose a file, or drop one on it. While uploading, the cross cancels. When done, the follow-up action picks again or resets; when it fails, Retry resends.",
  animation: "Progress follows the transfer frame by frame; the bar widens out of the button in 0.25s; the tick pops; dragging lifts the cloud. Reduced motion keeps the progress but drops the entrances and lifts.",
  a11y: "Real buttons; the hidden input is out of the tab order. Progress is a progressbar with its value; the cancel cross is labelled with the file name; errors are text, not just colour; progress is announced in quarters.",
  responsive: "The bar is at most 20rem (86vw on phones); the drop target fills up to 28rem; the panels stack on narrow screens.",
  touchFallback: "Tapping opens the system file or photo picker; drag and drop is an extra, not a requirement.",
  variants: [
    { id: "button", label: "Button", prompt: "Button: a 44px solid button with 12px corners, an up-arrow-into-tray icon (it lifts 2px on hover) and 'Upload file'. Once a file is chosen it becomes a 20rem card-coloured bar with a hairline: a document icon, the name (ellipsis), the percentage in tabular figures and a 28px round cross; a pale accent wash fills it from the left as the progress. Done: a green tick, the name and a 'Replace' text button." },
    { id: "drop", label: "Drop pill", prompt: "Drop pill: a 104px-tall card with a 1.5px dashed edge and 16px corners: a 52px rounded square with a cloud-and-arrow icon, 'Drop a file here or browse' (browse underlined in the accent) and 'PDF, PNG or JPG, up to 20 MB' in muted 13px. Dragging over it turns the edge solid accent, washes it pale and lifts the icon 4px ('Drop to upload'). During the upload the card shows a document tile, the shortened name, 'x MB of y MB', a 4px accent progress bar, the percentage and a cancel cross; done turns the bar green, shows a tick and 'Upload another'." },
    { id: "avatar", label: "Avatar", prompt: "Avatar: a 96px round picker with a camera icon on a faint disc inside a dashed 2.5px ring, captioned 'Add a photo' / 'JPG or PNG, up to 8 MB'. Images only. The chosen photo appears dimmed at once (an object URL) while the ring fills in the accent around it with the percentage in the middle and 'Uploading…' / 'Cancel' beside it. Done: the photo at full strength, a green full ring, a small pen badge, 'Photo updated' with a tick and 'Remove'. A refused or failed upload turns the ring red." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [1100, 520] },
  isNew: true,
};
