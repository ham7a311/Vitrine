"use client";
import { BloomAlbum, type BloomItem } from "./BloomAlbum";
import { scenes } from "./scenes";

const items: BloomItem[] = [
  { id: "train", title: "Morning train", picture: scenes.train },
  { id: "lake", title: "Mirror lake", picture: scenes.lake },
  { id: "gate", title: "The long gate", picture: scenes.gate },
  { id: "canal", title: "Canal at night", picture: scenes.canal },
  { id: "noodle", title: "Late supper", picture: scenes.noodle },
  { id: "blossom", title: "First blossom", picture: scenes.blossom },
  { id: "neon", title: "Neon street", picture: scenes.neon },
  { id: "dawn", title: "Dawn ridge", picture: scenes.dawn },
];

// The album face: a travel-poster cover, drawn in HTML and SVG.
function Cover() {
  return (
    <div className="bloom-demo-cover" style={{ position: "relative", width: "100%", height: "100%", background: "#f6e3d4", color: "#1d2240", textAlign: "left", fontFamily: "Hanken Grotesk, sans-serif", overflow: "hidden" }}>
      <svg viewBox="0 0 340 340" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <circle cx="196" cy="214" r="92" fill="#e8442f" />
        <path d="M60 236c30-14 60-14 84 0 22-10 44-10 64 0" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".9" />
        <path d="M150 340 214 252h42l62 88Z" fill="#203a78" />
        <path d="M190 262h90l-20-16h-50Z" fill="#162a5a" />
        <rect x="220" y="196" width="16" height="58" fill="#f6e3d4" />
        <path d="M214 196h28l-14-14Z" fill="#162a5a" />
        <path d="M300 40c-20 40-24 90-6 140" stroke="#1d2240" strokeWidth="4" fill="none" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${300 - i * 3} ${60 + i * 18}l-${26 - i}  -${8 - i % 3}`} stroke="#1d2240" strokeWidth="3" strokeLinecap="round" />)}
        <path d="M110 150l8 4 8-4M128 162l6 3 6-3" stroke="#1d2240" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ position: "relative", padding: "18px 20px" }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.16em", fontWeight: 700, color: "#e8442f" }}>FIELD ALBUM · VOL. 02</p>
        <p style={{ margin: "6px 0 0", fontSize: 58, lineHeight: 0.86, fontWeight: 800, letterSpacing: "-0.04em", color: "#e8442f" }}>COAST</p>
        <p style={{ margin: "2px 0 0", fontSize: 34, lineHeight: 0.9, fontWeight: 800, letterSpacing: "-0.03em" }}>LINES</p>
        <p style={{ margin: "10px 0 0", fontSize: 10, lineHeight: 1.5, fontWeight: 700, letterSpacing: "0.06em" }}>EIGHT DAYS.<br />FOUR TOWNS.<br />ONE TRAIN.</p>
      </div>
    </div>
  );
}

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ position: "relative", minHeight: "100%", height: "100%", minWidth: "100%", display: "grid", placeItems: "center", padding: "250px 40px", background: paper ? "#ecebe6" : "#050505", overflow: "hidden" }}>
      <BloomAlbum cover={<Cover />} label="Coast Lines, a field album" items={items} size={280} theme={paper ? "paper" : "night"} />
      <p style={{ position: "absolute", bottom: 24, left: 0, right: 0, margin: 0, textAlign: "center", font: "500 12px/1 'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: paper ? "#5c5a54" : "#9a9a96" }}>Point at the album</p>
    </div>
  );
}
