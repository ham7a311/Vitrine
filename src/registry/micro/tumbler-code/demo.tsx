"use client";
import { TumblerCode } from "./TumblerCode";

// Simulated check: 482915 is the right code; anything else points at its first wrong digit.
const RIGHT = "482915";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 24, background: paper ? "#f2f1ec" : "#050505", fontFamily: "Hanken Grotesk, sans-serif" }}>
      <div style={{ display: "grid", gap: 18 }}>
        <TumblerCode theme={paper ? "paper" : "night"} label="Enter the 6-digit code we sent to ines@example.com"
          onComplete={(code) => new Promise((ok) => setTimeout(() => {
            if (code === RIGHT) ok({ ok: true });
            else ok({ ok: false, at: [...code].findIndex((c, i) => c !== RIGHT[i]), reason: "That digit doesn't match. Re-enter from there." });
          }, 650))} />
        <p style={{ margin: 0, fontSize: 12, fontFamily: "JetBrains Mono, monospace", letterSpacing: ".08em", textTransform: "uppercase", color: paper ? "#5c5a54" : "#9c9c97" }}>Simulated · the right code is 482915</p>
      </div>
    </div>
  );
}
