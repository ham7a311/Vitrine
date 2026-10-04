import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "upload-stack",
  name: "Upload Stack",
  category: "forms",
  description: "Uploads sorted by what needs you: failures lift to the top, the files moving now sit in full view, the queue waits behind them as a stack of edges, and finished files settle into a quiet ledger. Files travel down the stack as work progresses.",
  tags: ["upload", "file", "dropzone", "progress", "retry", "queue", "attachments"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["UploadStack.tsx", "upload-stack.css"],
  dependencies: [],
  prompt: `Build a multi-file upload surface where the stack order is the order of attention, not the order files were added.

Groups, top to bottom:
1. Needs attention. Failed files, lifted with an error-tinted edge and shadow. The reason is written in full ('Too large — the limit is 25.0 MB', 'Connection dropped at 62% — retry to resume'), with Retry (where it can help) and Remove, plus Retry all when several failed.
2. Uploading. The files in flight (concurrency 2 by default) as full rows: a type glyph (PNG/PDF/ZIP… tinted by kind), name, 'x MB of y MB', a 3px progress bar and Cancel.
3. The queue, drawn physically behind the active rows. The next file is a recessed row with its name and 'Next · 2.1 MB'; the files behind it are 6px edges, each inset 10px more than the last, so you can see the depth of the stack. A line lists what's waiting.
4. Uploaded. A quiet ledger with a check, name and size — only the last three unless expanded — with a total and Clear.

Moving between groups uses a FLIP (380ms): a queued edge grows into the next row, a finished row glides down into the ledger, and a failure rises to the top. A single hairline meter above the stack shows total bytes sent.

The uploader is injected as (file, report, signal) => Promise, so it works with any backend, and cancelling aborts the signal. It supports drag and drop over the whole surface, a labelled file input, multiple files, and an oversize check before upload. A polite status region announces added, uploaded, failed and cancelled. The demo simulates ~5 MB/s with one file that drops once. Paper and Night themes.`,
  interaction: "Watch the sample batch; retry the failed zip, cancel something, or drop your own files onto the stack.",
  animation: "Files glide between groups with a 380ms FLIP; progress bars fill linearly.",
  a11y: "Real file input with a visible label; every row has named Retry / Remove / Cancel buttons; progress bars expose role=progressbar with values; a status region announces each outcome. Reduced motion removes the gliding and bar easing.",
  responsive: "Rows compress under 420px (percentages hide); names truncate; the error reason wraps in full.",
  touchFallback: "Tap 'browse' to pick files.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
