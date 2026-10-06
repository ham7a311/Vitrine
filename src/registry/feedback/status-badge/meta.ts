import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "status-badge",
  name: "Status Badge",
  category: "feedback",
  description: "Small, quiet status pills for the states a product shows all day: live, online, away, busy, offline, confirmed, pending, cancelled, warning, failed, beta and new. Each has its own mark and word, so colour is never the only signal.",
  tags: ["badge", "status", "pill", "tag", "live", "online", "presence", "confirmed", "pending", "warning", "chip"],
  traits: ["ambient"],
  source: "original",
  files: ["StatusBadge.tsx", "status-badge.css", "status.ts"],
  dependencies: [],
  promptAllow: ["soft", "solid", "dot"],
  prompt:
    "Build a status badge (a span) for twelve states, in the one look selected below, at two sizes: 24px tall (12.5px Inter 500, 12px mark) and 20px (11.5px, 10px mark), fully rounded, a 6px gap between the mark and the word.\n\nStates, tone and mark: Live (red, a dot with a copy that pings out to 2.4× and fades every 1.6s), Online (green, a solid 7px dot), Away (amber, a crescent), Busy (red, a dot with a short bar cut through it), Offline (grey, a hollow ring), Confirmed (green, a tick), Pending (blue, a 10px spinner, 0.9s a turn), Cancelled (grey, a cross), Warning (amber, a triangle with a stroke and dot), Failed (red, a cross), Beta (violet, a four-point spark), New (blue, the spark). The word can be overridden ('Processing' for pending).\n\nTones (light / dark), strong ink then soft fill then hairline: red #c4161c #fdecec #f6c1c2 / #ff8a8d #2c1214 #5a2226; green #13703a #e7f6ec #b6e2c4 / #6fdc93 #0f2416 #1f4a2c; amber #935f00 #fdf3dc #f1d697 / #f8c45c #2a1f08 #574117; grey #5c5f66 #f0f1f3 #d9dbe0 / #b3b6bd #1d1e21 #34363b; blue #1d4fd8 #e9f0ff #bfd0fb / #8db3ff #0f1b33 #23396a; violet #6b2fd6 #f2ecff #d6c5fa / #c4a6ff #1d1430 #3d2b66. All pass 4.5:1 for the word on its fill.\n\nShow all twelve, then a short order list (name, time, a small badge) on a white panel and a #0b0b0c panel side by side.",
  interaction: "None; badges are labels. Put them next to the thing they describe.",
  animation: "Only Live pings and Pending spins; reduced motion stops the ping and slows the spinner.",
  a11y: "The word is real text and the mark is aria-hidden, so the state reads the same without colour. If a status changes live, wrap it in a polite live region.",
  responsive: "Badges wrap in rows and never wrap their own text.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "soft", label: "Soft", prompt: "Soft: the tone's pale fill with a 1px inset hairline in the tone and the word and mark in the tone's strong ink." },
    { id: "outline", label: "Outline", prompt: "Outline: a transparent pill with only the 1px inset tone hairline; the word and mark in the strong ink." },
    { id: "solid", label: "Solid", prompt: "Solid: filled with the saturated tone (red #dc2626 / #e5484d, green #15803d / #238636, amber #f5a524, grey #5c5f66 / #4a4d54, blue #2563eb / #2f6bff, violet #7c3aed / #7c4dff) with white text, except amber, which takes near-black #241700. No hairline." },
    { id: "dot", label: "Dot", prompt: "Dot: no pill and no padding; just the mark in the tone's strong colour and the word in plain body text (13.5px, 400) beside it, as in a presence list." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1100, 520] },
  isNew: true,
};
