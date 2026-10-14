"use client";
import { ArcadeBreaker, type ArcadePalette } from "./ArcadeBreaker";

const LOOKS: Record<string, ArcadePalette & { intro: string; introInk: string }> = {
  terracotta: { wall: "#9c4528", shade: "#7d341c", ink: "#fff4ea", muted: "#f6dccd", line: "rgba(255, 244, 234, 0.28)", accent: "#fff4ea", onAccent: "#5a2210", intro: "#f4e9df", introInk: "#5a2a18" },
  marble: { wall: "#ece6dc", shade: "#d6cdbf", ink: "#23201b", muted: "#5d574d", line: "rgba(35, 32, 27, 0.2)", accent: "#23201b", onAccent: "#f6f2ea", intro: "#faf8f4", introInk: "#3b362e" },
  dusk: { wall: "#1d2240", shade: "#141830", ink: "#eef0fa", muted: "#b4b9d6", line: "rgba(238, 240, 250, 0.22)", accent: "#f2c46d", onAccent: "#1d1606", intro: "#e9ebf5", introInk: "#1d2240" },
};

export default function Demo({ variant = "terracotta" }: { variant?: string }) {
  const p = LOOKS[variant] ?? LOOKS.terracotta;
  return (
    <div style={{ minHeight: "100%", background: p.wall }}>
      {/* the page above, so there's room to scroll the day by */}
      <div style={{ height: "34vh", minHeight: 200, background: p.intro, color: p.introInk, display: "grid", placeItems: "end center", paddingBottom: 28, fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui', fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        Scroll to watch the day pass ↓
      </div>
      <ArcadeBreaker
        palette={p}
        eyebrow="Casa Albero · Seville"
        title="Long lunches under the old arches."
        lead="Twelve rooms around a courtyard that keeps cool all afternoon. Scroll on and the day moves with you, from first light to the lamps coming on."
        primary={{ label: "Check dates", href: "#dates" }}
        secondary={{ label: "See the rooms", href: "#rooms" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
      <div style={{ height: "60vh" }} aria-hidden="true" />
    </div>
  );
}
