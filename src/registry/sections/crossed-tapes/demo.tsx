"use client";
import { CrossedTapes, type TapePalette } from "./CrossedTapes";

const LOOKS: Record<string, { palette: TapePalette; stripes: boolean }> = {
  caution: { stripes: true, palette: { ground: "#f2efe6", ink: "#111111", muted: "#4a4740", line: "rgba(17, 17, 17, 0.16)", a: "#ffd400", aInk: "#111111", b: "#111111", bInk: "#ffd400" } },
  festival: { stripes: false, palette: { ground: "#1a1033", ink: "#fff7fb", muted: "#cfc3e8", line: "rgba(255, 247, 251, 0.16)", a: "#ff4f8b", aInk: "#1a1033", b: "#21c7b5", bInk: "#1a1033" } },
  mono: { stripes: false, palette: { ground: "#e8e6e1", ink: "#111111", muted: "#4d4b47", line: "rgba(17, 17, 17, 0.16)", a: "#111111", aInk: "#f5f4f0", b: "#f5f4f0", bInk: "#111111" } },
};

export default function Demo({ variant = "caution" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.caution;
  return (
    <div style={{ minHeight: "100%", background: look.palette.ground }}>
      <CrossedTapes
        palette={look.palette}
        stripes={look.stripes}
        words={["Now open", "Warehouse sale", "48 hours only", "Everything must go"]}
        eyebrow="Unit 7 · Dockside Yard"
        title="The big clear-out is on."
        lead="Samples, seconds and last season's stock from twenty makers, all under one roof for one weekend. Bring a bag."
        card={{ title: "Sat & Sun, 10:00–18:00", detail: "Free entry · card only" }}
        primary={{ label: "Get directions", href: "#map" }}
        secondary={{ label: "See the makers", href: "#makers" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
