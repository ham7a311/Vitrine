import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "avatar-upload-button",
  name: "Avatar Upload",
  category: "buttons",
  description: "A round photo picker whose ring is the progress. The chosen photo shows at once, dimmed, while the ring fills around it; then a full green ring, a small pen badge and 'Photo updated', or a red ring and a plain reason with Retry.",
  tags: ["upload", "avatar", "photo", "profile picture", "image", "progress", "ring", "camera"],
  traits: ["click", "keyboard", "touch", "hover"],
  source: "original",
  files: ["AvatarUpload.tsx", "avatar-upload-button.css", "upload.ts"],
  dependencies: [],
  prompt:
    "Build a round profile-photo picker whose ring is the upload's progress. Inter at 500, 15px.\n\nPalette (light / dark): ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, card #ffffff / #141414, hairline #e2e2e2 / #2b2b2b, dashes #c9c9c9 / #3d3d3d, solid button #111111 with white text / #ededed with #0a0a0a text, accent #2563eb / #6ea8fe with a wash of #eff4ff / #101b2e, track #ececec / #262626, done #15803d / #3fb950, error #c81e1e / #ff6369.\n\nIdle: a 96px round picker with a camera icon on a faint 84px disc inside a dashed 2.5px ring, captioned 'Add a photo' / 'JPG or PNG, up to 8 MB'; hover or a drag over it washes the disc in the accent. Images only. The chosen photo appears dimmed at once (an object URL) while the ring fills in the accent around it, clockwise from 12 o'clock, with the percentage in the middle and 'Uploading…' / 'Cancel' beside it. Done: the photo at full strength, a full green ring, a small pen badge (28px, ringed in the card colour), 'Photo updated' with a tick and 'Remove'. A refused or failed upload turns the ring red and shows the reason with Retry.\n\nBehaviour: a hidden <input type=file> opened by a real button; dropping a file on the control works too (with a visible drag state). Check the file against accept and a size limit first and say why in plain words if it's refused ('That file is 31 MB; the limit is 20 MB.'). Uploading takes an upload(file, progress, signal) function; the default simulates a believable transfer (uneven but always forward, 1.1–4.2s by size) and fails when the browser is offline. Cancel aborts it. A failure shows the reason and 'Retry', which sends the same file again. Long names are shortened in the middle, keeping the extension. Progress is announced in quarters in a polite live region, along with the start, the end, cancelling and errors.\n\nShow it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "Click (or Enter/Space) to choose a photo, or drop one on the circle. While uploading, Cancel stops it. When done, clicking the circle changes the photo and Remove clears it; when it fails, Retry resends.",
  animation: "The ring fills frame by frame as the transfer progresses. Reduced motion keeps the progress.",
  a11y: "A real button named for its state ('Add a photo', 'Uploading photo, 40 percent', 'Change photo'); the hidden input is out of the tab order; errors are text, not just colour; progress is announced in quarters.",
  responsive: "The picker keeps its 96px size with its caption beside it.",
  touchFallback: "Tapping opens the system photo picker; drag and drop is an extra, not a requirement.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --avub-accent #2563eb; --avub-bad #c81e1e; --avub-btn #111111; --avub-btn-ink #ffffff; --avub-card #ffffff; --avub-dash #c9c9c9; --avub-edge #e2e2e2; --avub-focus #2563eb; --avub-ink #111111; --avub-ok #15803d; --avub-soft #6b6b6b; --avub-track #ececec; --avub-wash #eff4ff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --avub-accent #6ea8fe; --avub-bad #ff6369; --avub-btn #ededed; --avub-btn-ink #0a0a0a; --avub-card #141414; --avub-dash #3d3d3d; --avub-edge #2b2b2b; --avub-focus #6ea8fe; --avub-ink #ededed; --avub-ok #3fb950; --avub-soft #a0a0a0; --avub-track #262626; --avub-wash #101b2e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 420] },
  isNew: true,
};
