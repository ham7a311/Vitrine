"use client";
import { TornPaper, type PaperPalette } from "./TornPaper";

const LOOKS: Record<string, PaperPalette> = {
  kraft: { above: "#2a221b", paper: "#c9a677", core: "#ead6b6", ink: "#2a1c0f", muted: "#4f3c26", accent: "#2a1c0f", onAccent: "#f4e6cc", note: "#fff6c9", noteInk: "#3a2f12" },
  newsprint: { above: "#1c1c1c", paper: "#efeae0", core: "#ffffff", ink: "#161616", muted: "#4e4b45", accent: "#c8321f", onAccent: "#fff7f2", note: "#ffe066", noteInk: "#2b2306" },
  blueprint: { above: "#f2efe8", paper: "#1f4e8c", core: "#5d86c0", ink: "#f4f8ff", muted: "#c6d6ef", accent: "#f4f8ff", onAccent: "#163a6b", note: "#f4f8ff", noteInk: "#163a6b" },
};

export default function Demo({ variant = "kraft" }: { variant?: string }) {
  const p = LOOKS[variant] ?? LOOKS.kraft;
  return (
    <div style={{ minHeight: "100%", background: p.above, paddingTop: 72 }}>
      <TornPaper
        palette={p}
        eyebrow="Issue 14 · out now"
        title="Slow news, printed on Sundays."
        note="Still smells of ink. We checked."
        lead="The Fieldnote collects one week of local stories, recipes and the crossword into a single paper edition, delivered before breakfast."
        primary={{ label: "Subscribe for £4 a month", href: "#subscribe" }}
        secondary={{ label: "Read a sample", href: "#sample" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
