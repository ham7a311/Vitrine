"use client";
import { BeadCurtain, type CurtainPalette } from "./BeadCurtain";

const LOOKS: Record<string, CurtainPalette> = {
  amber: { ground: "#1d140c", beads: ["#e8a33d", "#c9772a", "#f3c46b", "#8d4f1f"], cord: "rgba(243, 196, 107, 0.35)", ink: "#f7ead6", muted: "#d4bf9f", accent: "#f3c46b", onAccent: "#2a1b0b" },
  jade: { ground: "#f1efe6", beads: ["#2f8a65", "#5fb38d", "#1d5c43", "#9fd2b5"], cord: "rgba(29, 92, 67, 0.35)", ink: "#1b2a22", muted: "#4a5a50", accent: "#1d5c43", onAccent: "#f1efe6" },
  glass: { ground: "#0f2340", beads: ["rgba(170, 210, 255, 0.85)", "rgba(220, 235, 255, 0.85)", "rgba(130, 180, 240, 0.85)"], cord: "rgba(200, 225, 255, 0.3)", ink: "#eef4ff", muted: "#b3c6e2", accent: "#eef4ff", onAccent: "#0f2340", glass: true },
};

export default function Demo({ variant = "amber" }: { variant?: string }) {
  const p = LOOKS[variant] ?? LOOKS.amber;
  return (
    <div style={{ minHeight: "100%", background: p.ground }}>
      <BeadCurtain
        palette={p}
        eyebrow="Behind the curtain"
        title="The back room is open again."
        lead="Twenty seats, a short menu written on the day and a record player that never stops. Walk-ins welcome after nine."
        action={{ label: "Book the back room", href: "#book" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
