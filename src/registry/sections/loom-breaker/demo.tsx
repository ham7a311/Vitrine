"use client";
import { LoomBreaker, type LoomPalette } from "./LoomBreaker";
import type { Weave } from "./weave";

const LOOKS: Record<string, { weave: Weave; palette: LoomPalette }> = {
  indigo: { weave: "plain", palette: { ground: "#eef0f4", warp: ["#1f3a6b", "#2c4f8c"], weft: ["#e9e2d3", "#c7d4ea"], ink: "#111a2c", muted: "#4b5568", line: "rgba(17, 26, 44, 0.14)", accent: "#1f3a6b", onAccent: "#f4f6fb" } },
  madras: { weave: "twill", palette: { ground: "#fbf3e4", warp: ["#b8321f", "#e8a21e"], weft: ["#1e6b52", "#f4e3c1"], ink: "#2a140c", muted: "#6b5345", line: "rgba(42, 20, 12, 0.14)", accent: "#b8321f", onAccent: "#fff6ea" } },
  linen: { weave: "basket", palette: { ground: "#16150f", warp: ["#d9cfb8", "#a99e86"], weft: ["#4a4636", "#7a7259"], ink: "#f2eee3", muted: "#b5ae9c", line: "rgba(242, 238, 227, 0.14)", accent: "#e7dcc1", onAccent: "#1a180f" } },
};

export default function Demo({ variant = "indigo" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.indigo;
  return (
    <div style={{ minHeight: "100%", background: look.palette.ground }}>
      <LoomBreaker
        weave={look.weave}
        palette={look.palette}
        eyebrow="Made to order"
        title="Cloth woven to your measure, not off a roll."
        lead="Pick a yarn, a weave and a width. Warp & Wren sets up a loom for your order and ships the length you need, finished at both ends."
        primary={{ label: "Start an order", href: "#order" }}
        secondary={{ label: "Request swatches", href: "#swatches" }}
        points={["Undyed, natural and indigo yarns", "Widths from 40 to 150 cm", "Woven and finished in eleven days"]}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
