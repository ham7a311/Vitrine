"use client";
import { ReactionPill } from "./ReactionPill";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "160px 24px 80px", background: paper ? "#f2f1ec" : "#000" }}>
      <div style={{ width: "min(100%, 460px)", padding: "22px 24px", borderRadius: 20, background: paper ? "#fff" : "#101011", boxShadow: paper ? "inset 0 0 0 1px rgba(20,20,18,.08)" : "inset 0 0 0 1px rgba(255,255,255,.07)", color: paper ? "#151513" : "#f2f2f0", fontFamily: "Hanken Grotesk, sans-serif" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Ines Varga</p>
        <p style={{ margin: "6px 0 22px", lineHeight: 1.55, color: paper ? "#5c5a54" : "#a5a5a0" }}>We shipped the new tide maps today — offline, and about four times faster to load.</p>
        <ReactionPill theme={paper ? "paper" : "night"} counts={{ like: 96, cheer: 21, love: 11 }} onChange={() => new Promise((ok) => setTimeout(ok, 400))} />
      </div>
    </div>
  );
}
