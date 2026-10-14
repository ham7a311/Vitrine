"use client";
import { TileBreaker, type BreakerPalette } from "./TileBreaker";
import type { Motif } from "./motifs";

const LOOKS: Record<string, { palette: BreakerPalette; motif: Motif }> = {
  paper: { motif: "wave", palette: { ground: "#efe9df", tile: "#b0441f", onTile: "#fbf7f0", ink: "#1d1712", muted: "#5e554c", line: "rgba(29, 23, 18, 0.14)" } },
  night: { motif: "arch", palette: { ground: "#0f1012", tile: "#c6f432", onTile: "#10130a", ink: "#f3f3ee", muted: "#a3a49c", line: "rgba(243, 243, 238, 0.12)" } },
  sea: { motif: "step", palette: { ground: "#e3ebe9", tile: "#0f5c5a", onTile: "#f1f7f6", ink: "#0d1f1e", muted: "#4a5c5a", line: "rgba(13, 31, 30, 0.14)" } },
};

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.paper;
  return (
    <div style={{ minHeight: "100%", background: look.palette.ground }}>
      <TileBreaker
        motif={look.motif}
        palette={look.palette}
        eyebrow="Studio floor"
        title="One desk for the team and the tools that help it."
        lead="Briefs, threads and drafts sit side by side, so handoffs stop getting lost between apps. Fennel keeps every decision a click away from the work it shaped."
        primary={{ label: "Open a workspace", href: "#start" }}
        secondary={{ label: "Book a walkthrough", href: "#tour" }}
        points={["Every channel in one queue", "History that follows the thread", "Handoffs without re-explaining"]}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
