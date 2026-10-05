import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "trace-404",
  name: "Trace 404",
  category: "feedback",
  description: "A not-found page that traces the address hop by hop, shows exactly where it stopped answering, and offers the real routes under the last good hop.",
  tags: ["404", "not found", "error page", "recovery", "routes", "developer"],
  traits: ["keyboard"],
  source: "original",
  files: ["Trace404.tsx", "trace.ts", "trace-404.css"],
  dependencies: [],
  prompt:
    "Build a not-found page that presents the missing address as a route trace. Normalise the requested path (lowercase, no query, hash or trailing slash), split it into segments and walk them as hops: hop 01 is the host, then /pricing, /pricing/team and so on. A hop answers when it is a known route or a parent of known routes; stop at the first hop that does not. Offer the known routes exactly one level below the last good hop, sorted by how many leading characters they share with the missing segment, up to five.\n\nLayout: a 68rem two-column grid (copy left, trace panel right) that stacks below a 52rem container width. Left: a mono 11px uppercase eyebrow '404 · Route trace', a 30–46px Geist headline 'The trail goes cold after /pricing.' with the path in mono and a 2px green underline, a muted lede naming the requested path and the last hop that answered, then a dark filled 44px button 'Back to Pricing' and an outline 'Trace again' button. Right: a hairline-bordered panel with 'GET masar.app/pricing/team/annual' in mono, then an ordered list of hop rows (number, a 9px node dot, path, a lowercase label, a status). Answered hops show a green dot and tick; the failing hop shows a hollow orange-red ring, a struck-through path, 'no route' and three asterisks. Dashed hairlines separate rows. Below, 'From hop 02, these answer:' lists label + mono path links with a trailing arrow, then a small uppercase home link. Collapse the label and path columns under 26rem.",
  interaction:
    "Links go to the last good hop and to the real routes below it; an hrefFor prop maps each path to a link (the demo maps them to local fragments so nothing navigates). 'Trace again' replays the trace and calls onRetrace, for example to log the miss.",
  animation:
    "Hop rows rise 6px and fade in one after another, 160ms apart, with an expo-out curve. The failing hop's three probes blink in turn three times, then settle, which reads as a timeout. Reduced motion shows the finished trace at once.",
  a11y:
    "A section labelled by its heading, an ordered list labelled 'Route trace', and visually hidden status text ('answered', 'did not answer') beside the decorative ticks and asterisks. The suggestions are a labelled nav. Native links and buttons with visible focus rings; ids are unique per instance.",
  responsive:
    "Container queries: two columns from 52rem, stacked below; hop labels and suggestion paths hide under 26rem so the path never overflows. Long paths truncate with an ellipsis inside the hop row and wrap in the request line.",
  touchFallback: "Everything is a tap target of at least 40px; nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Paper theme: page #f3f1ec, panel #fbfaf7, ink #1c1b18, muted #6b675e, faint #a8a398, hairlines rgb(28 27 24 / 0.12), answered green #2f7a4a, failing hop #c2410c, focus ring #2f5bd3." },
    { id: "night", label: "Night", prompt: "Night theme: page #101113, panel #16171a, ink #ebe9e4, muted #9a978f, faint #5d5b56, hairlines rgb(235 233 228 / 0.1), answered green #6cc28a, failing hop #ff8a4c, focus ring #8fb0ff." },
  ],
  preview: { bg: "#f3f1ec", mode: "page", frame: [1280, 800] },
  isNew: true,
};
