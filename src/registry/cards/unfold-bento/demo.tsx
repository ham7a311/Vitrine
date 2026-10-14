"use client";
import { UnfoldBento, type UnfoldTile } from "./UnfoldBento";
import { Measure, Plan, Review, Share, Ship, Write } from "./teasers";

const tiles: UnfoldTile[] = [
  { id: "plan", title: "Plan", kicker: "Roadmaps that stay true", color: "#ff8a65", teaser: <Plan />, span: { lg: [1, 2], md: [1, 2] },
    detail: "Lay out the quarter on one board. Dates move when the work moves, so the plan never lies to you.",
    steps: ["Draft goals as cards", "Drag them onto weeks", "Share a read-only link"], cta: { label: "See planning", href: "#plan" } },
  { id: "write", title: "Write", kicker: "Specs with live data", color: "#a394ff", teaser: <Write />, span: { lg: [2, 1], md: [1, 1] },
    detail: "Docs that pull numbers straight from the product, so the spec and the truth never drift apart.",
    steps: ["Type / to embed a chart", "Mention a teammate to ask", "Publish when it's ready"], cta: { label: "Read about docs", href: "#write" } },
  { id: "review", title: "Review", kicker: "One pass, not ten", color: "#61d6b4", teaser: <Review />,
    detail: "Comments, suggestions and approvals in one thread, with a clear yes at the end.", steps: ["Request a review", "Resolve in place", "Approve"] },
  { id: "ship", title: "Ship", kicker: "Fridays welcome", color: "#ffd166", teaser: <Ship />,
    detail: "Every merge previews itself, and a release is one button with an undo.", cta: { label: "How releases work", href: "#ship" } },
  { id: "measure", title: "Measure", kicker: "Know what moved", color: "#72b9ff", teaser: <Measure />, span: { lg: [2, 1], md: [2, 1] },
    detail: "Each release carries its own scorecard, so you can see which change moved which number.", steps: ["Pick a metric", "Tag a release", "Compare the weeks"] },
  { id: "share", title: "Share", kicker: "Bring everyone along", color: "#ff9fc6", teaser: <Share />, span: { lg: [4, 1], md: [2, 1] },
    detail: "Invite the whole company as viewers for free. They see what's shipping without asking in chat.", cta: { label: "Invite your team", href: "#share" } },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", background: paper ? "#f3f0e8" : "#0e0e12" }}>
      <UnfoldBento theme={paper ? "paper" : "night"} eyebrow="Tidewater for product teams" title="Six habits, one place to keep them."
        lede="Pick a tile to open it up. Everything a product team does in a week, from first plan to last number."
        tiles={tiles} onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
