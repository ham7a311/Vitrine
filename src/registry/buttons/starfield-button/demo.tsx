"use client";
import { StarfieldButton } from "./StarfieldButton";

const LOOKS = {
  night: { ground: "#080a1c", palette: { star: "#f4f1ff", bright: "#ffd88a", line: "rgba(214, 206, 255, 0.5)", face: "#141846", label: "#f4f1ff" }, text: "Join the waitlist" },
  dusk: { ground: "#1c0f24", palette: { star: "#ffe9f4", bright: "#ff9fd0", line: "rgba(255, 190, 225, 0.5)", face: "#3a1846", label: "#fff1f8" }, text: "Book a night tour" },
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const l = LOOKS[variant as keyof typeof LOOKS] ?? LOOKS.night;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: `radial-gradient(70% 60% at 50% 40%, ${l.palette.face}, ${l.ground})` }}>
      <StarfieldButton palette={l.palette}>{l.text}</StarfieldButton>
    </div>
  );
}
