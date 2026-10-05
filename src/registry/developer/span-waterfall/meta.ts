import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "span-waterfall",
  name: "Span Waterfall",
  category: "developer",
  description: "A request trace as nested bars on one time axis. Collapse what you don't need, follow the critical path (the chain of spans that decided the total time), see failed spans hatched, and open any span for its attributes and self time.",
  tags: ["tracing", "observability", "performance", "waterfall", "developer", "tree"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["SpanWaterfall.tsx", "span-waterfall.css", "trace.ts"],
  dependencies: [],
  prompt:
    "Build a distributed-trace viewer for one request ('GET /docs/field-notes-12', 412 ms across edge, auth, web, api, postgres, redis and storage). Data is a flat list of spans { id, parent, name, service, start, duration, attrs, error }.\n\nComputation: build the tree (children ordered by start), each span's depth, its self time (its duration minus the union of its children's intervals clipped to it), and the critical path: from the root, repeatedly follow the child that finished last.\n\nLayout: a 12px-radius panel in Geist with Geist Mono for names, durations and ticks. Header: the trace id, a summary ('13 spans · 7 services · 412 ms total · critical path 4 spans') and a 'Critical path only' checkbox. Body: a table with a name column (about a third, indented 14px per level, a ▾/▸ caret for spans with children, the name and a muted service tag) and a time lane with five mono ticks and faint full-height gridlines. Each span is a 12px rounded bar placed by start and duration, coloured by service from a six-colour palette, with its duration in small mono after the bar. Critical-path bars are solid with an orange outline; failed spans are hatched red. Rows are 30px with hairline separators; the selected row is tinted. From 52rem a 15rem detail card on the right shows the service, name, duration, self time, start offset, share of the trace and every attribute, plus 'On the critical path: making this faster makes the whole request faster.'",
  interaction:
    "Click a row to select it. The table is a treegrid with one tab stop: ↑/↓ move, → expands or goes to the first child, ← collapses or goes to the parent, Home/End jump. Carets toggle subtrees by pointer. The checkbox hides everything off the critical path.",
  animation: "None beyond row hover and selection tints; the data is the point.",
  a11y: "Rows expose aria-level, aria-expanded and aria-selected; each lane cell is labelled with its start, duration and critical-path or error state, so the timing is available without the bars. The detail card is a polite live region.",
  responsive: "The detail card moves under the table below 52rem; below 34rem the name column narrows and service tags hide.",
  touchFallback: "Tap rows to select and carets to expand.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --swfall-bad #c42d1f; --swfall-bg #fbfbfa; --swfall-card #ffffff; --swfall-crit #e0571f; --swfall-focus #2c5bd2; --swfall-ink #18191c; --swfall-line rgb(24 25 28 / 0.09); --swfall-muted #686c74; --swfall-s0 #4f7cd6; --swfall-s1 #2a9d7a; --swfall-s2 #b8862b; --swfall-s3 #8a5cc4; --swfall-s4 #c45482; --swfall-s5 #4a9bb5; --swfall-sel #eef2fb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --swfall-bad #ff7b6b; --swfall-bg #121315; --swfall-card #18191c; --swfall-crit #ff8a4c; --swfall-focus #8eb0ff; --swfall-ink #e7e8ea; --swfall-line rgb(255 255 255 / 0.08); --swfall-muted #979ba3; --swfall-s0 #7aa2f0; --swfall-s1 #5cc9a5; --swfall-s2 #e3b45a; --swfall-s3 #b494ec; --swfall-s4 #ec86b0; --swfall-s5 #7cc6dc; --swfall-sel #1d2433. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e8e9e6", mode: "fill", frame: [1200, 640] },
  isNew: true,
};
