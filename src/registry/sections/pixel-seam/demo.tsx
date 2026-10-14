"use client";
import { PixelSeam, type SeamPalette } from "./PixelSeam";

const LOOKS: Record<string, SeamPalette> = {
  mint: { above: "#f3f1ea", below: "#f3f1ea", ground: "#0d3b2e", ink: "#effaf4", muted: "#a9cdbd", line: "rgba(239, 250, 244, 0.16)", accent: "#8ef0c4", onAccent: "#06281d" },
  ultraviolet: { above: "#0b0b12", below: "#0b0b12", ground: "#3b2bd6", ink: "#ffffff", muted: "#d5d0ff", line: "rgba(255, 255, 255, 0.2)", accent: "#ffe066", onAccent: "#1d1a05" },
  sand: { above: "#1a1916", below: "#1a1916", ground: "#e9dcc4", ink: "#1f1a12", muted: "#5e5442", line: "rgba(31, 26, 18, 0.16)", accent: "#1f1a12", onAccent: "#f6efe0" },
};

export default function Demo({ variant = "mint" }: { variant?: string }) {
  const p = LOOKS[variant] ?? LOOKS.mint;
  return (
    <div style={{ minHeight: "100%", background: p.above }}>
      <div style={{ height: 96 }} aria-hidden="true" />
      <PixelSeam
        palette={p}
        eyebrow="Build 2.4 · shipped"
        title="Ship to every screen from one canvas."
        lead="Bitmill turns one layout into crisp builds for web, phones and the shop TV, then tells you which screens are lagging behind."
        stats={[{ value: 1280, label: "teams shipping weekly" }, { value: 38, suffix: "%", label: "smaller builds since 2.0" }, { value: 4.9, decimals: 1, suffix: "/5", label: "average review" }]}
        primary={{ label: "Try it free", href: "#try" }}
        secondary={{ label: "Read the changelog", href: "#log" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
      <div style={{ height: 96 }} aria-hidden="true" />
    </div>
  );
}
