"use client";

import { useId } from "react";
import { Loupe } from "./Loupe";

type Pal = { bg: string; ink: string; muted: string; sea: string; seaLine: string; land: string; contour: string; road: string; casing: string; accent: string; souq: string };
const PAPER: Pal = { bg: "#f3eee2", ink: "#2a2620", muted: "#857c6b", sea: "#dfe8e6", seaLine: "#9db6b2", land: "#f3eee2", contour: "#c9b99b", road: "#ffffff", casing: "#b9ad97", accent: "#b23a2e", souq: "#d8cbb2" };
const NIGHT: Pal = { bg: "#121310", ink: "#ece6d8", muted: "#8b8676", sea: "#0f1a1c", seaLine: "#2c4a4c", land: "#121310", contour: "#3a3628", road: "#d9d1bf", casing: "#121310", accent: "#f0a36a", souq: "#2a2820" };

/** A closed, slightly irregular ring — a contour around a hilltop. */
function ring(cx: number, cy: number, r: number, seed: number, sx = 1.25) {
  let d = "";
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const k = 1 + 0.13 * Math.sin(3 * t + seed) + 0.07 * Math.sin(5 * t + seed * 2.3) + 0.04 * Math.sin(9 * t - seed);
    const x = cx + Math.cos(t) * r * k * sx, y = cy + Math.sin(t) * r * k;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}

const COAST = "M0 196 C70 188 120 176 170 182 S260 214 320 206 S420 160 480 168 S560 214 620 208 S720 170 800 176";
const HILLS = [
  { x: 120, y: 360, n: 8, s: 1.1 },
  { x: 610, y: 340, n: 9, s: 2.4 },
  { x: 380, y: 470, n: 6, s: 4.1 },
];
const POIS = [
  { x: 300, y: 236, t: "Muttrah Souq", a: "start" },
  { x: 214, y: 214, t: "Fish Market", a: "end" },
  { x: 470, y: 196, t: "Bait Al Baranda", a: "start" },
  { x: 598, y: 228, t: "Muttrah Fort", a: "start" },
  { x: 708, y: 214, t: "Riyam Park", a: "middle" },
  { x: 92, y: 150, t: "Port Sultan Qaboos", a: "start" },
];

function Sheet({ p }: { p: Pal }) {
  // The loupe renders this twice, so ids are per copy.
  const id = useId().replace(/:/g, "");
  return (
    <div className="flex h-full min-h-[600px] w-full flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row" style={{ background: p.bg, color: p.ink, fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <figure className="min-w-0 flex-[1.7]">
        <figcaption className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: p.muted }}>Sheet 7 · Muttrah, Muscat</span>
          <span className="font-mono text-[9px]" style={{ color: p.muted }}>23°37′N 58°34′E</span>
        </figcaption>
        <svg viewBox="0 0 800 520" className="mt-3 block h-auto w-full rounded-lg" style={{ background: p.land, boxShadow: `0 0 0 1px ${p.casing}55` }} role="img" aria-label="Map of Muttrah: the corniche runs along the bay from the port past the souq to the fort and Riyam Park.">
          <defs>
            <clipPath id={`${id}-land`}>
              <path d={`${COAST} L800 520 L0 520 Z`} />
            </clipPath>
          </defs>
          {/* Sea, with depth lines easing away from the shore */}
          <path d={`${COAST} L800 0 L0 0 Z`} fill={p.sea} />
          {[14, 30, 50, 74, 102].map((o, i) => (
            <path key={o} d={COAST} transform={`translate(0 ${-o})`} fill="none" stroke={p.seaLine} strokeWidth="0.6" strokeDasharray={i % 2 ? "2 3" : "none"} opacity={0.75 - i * 0.12} />
          ))}
          <text x="560" y="64" fontSize="13" fontStyle="italic" fill={p.seaLine} letterSpacing="5" fontFamily="Instrument Serif, Georgia, serif">GULF OF OMAN</text>
          <text x="600" y="80" fontSize="5.5" fill={p.seaLine} letterSpacing="1">depths in metres · 5 · 10 · 20 · 30</text>

          {/* Hills: contours every 20 m, a spot height on each top */}
          <g clipPath={`url(#${id}-land)`}>
            {HILLS.map((h) =>
              Array.from({ length: h.n }, (_, i) => (
                <path key={`${h.x}-${i}`} d={ring(h.x, h.y, 14 + i * 15, h.s + i * 0.31)} fill="none" stroke={p.contour} strokeWidth={i % 4 === 3 ? 1.1 : 0.55} />
              )),
            )}
            {HILLS.map((h, i) => (
              <g key={h.x}>
                <circle cx={h.x} cy={h.y} r="1.4" fill={p.ink} />
                <text x={h.x + 4} y={h.y - 3} fontSize="6" fill={p.muted}>{[268, 341, 192][i]}</text>
              </g>
            ))}
            {/* Souq alleys: a tight, irregular grid */}
            <g stroke={p.souq} strokeWidth="2.2" strokeLinecap="round" fill="none">
              {[0, 1, 2, 3, 4].map((i) => <path key={`a${i}`} d={`M${262 + i * 13} 224 L${258 + i * 15} 300`} />)}
              {[0, 1, 2, 3].map((i) => <path key={`b${i}`} d={`M252 ${236 + i * 17} L${338 - i * 4} ${232 + i * 18}`} />)}
            </g>
            {["Sikkat al-Lawatiya", "Sikkat al-Dhahab", "Sikkat al-Bazaar"].map((t, i) => (
              <text key={t} x={262 + i * 4} y={252 + i * 17} fontSize="3.6" fill={p.muted} letterSpacing="0.2" transform={`rotate(${-2 + i} ${262} ${252 + i * 17})`}>{t}</text>
            ))}
          </g>

          {/* The corniche: a cased road following the bay */}
          <path d={COAST} transform="translate(0 12)" fill="none" stroke={p.casing} strokeWidth="6.5" strokeLinecap="round" />
          <path d={COAST} transform="translate(0 12)" fill="none" stroke={p.road} strokeWidth="4.2" strokeLinecap="round" />
          <text fontSize="5.2" fill={p.muted} letterSpacing="2.2">
            <textPath href={`#${id}-corniche`} startOffset="56%">AL BAHRI ROAD · CORNICHE</textPath>
          </text>
          <path id={`${id}-corniche`} d={COAST} transform="translate(0 20)" fill="none" />
          <path d="M300 214 C320 260 340 300 360 360 S400 430 420 520" fill="none" stroke={p.casing} strokeWidth="3.4" />
          <path d="M300 214 C320 260 340 300 360 360 S400 430 420 520" fill="none" stroke={p.road} strokeWidth="1.8" />

          {/* Port: quays and a breakwater */}
          <g fill={p.casing}>
            <rect x="24" y="118" width="120" height="7" rx="1" />
            <rect x="40" y="138" width="7" height="46" />
            <rect x="80" y="134" width="7" height="50" />
            <rect x="120" y="140" width="7" height="44" />
          </g>
          <path d="M8 96 Q90 80 170 108" fill="none" stroke={p.casing} strokeWidth="4" strokeLinecap="round" />

          {POIS.map((q) => (
            <g key={q.t}>
              <circle cx={q.x} cy={q.y} r="3.2" fill={p.bg} stroke={p.accent} strokeWidth="1.4" />
              <text x={q.x + (q.a === "end" ? -6 : q.a === "middle" ? 0 : 6)} y={q.y + (q.a === "middle" ? -7 : 2.5)} fontSize="7.2" fontWeight="600" fill={p.ink} textAnchor={q.a as "start" | "end" | "middle"}>
                {q.t}
              </text>
            </g>
          ))}
          <text x="604" y="240" fontSize="4.2" fill={p.muted}>Portuguese, 1580s · open 9–4, closed Fri</text>
          <text x="306" y="246" fontSize="4.2" fill={p.muted}>Frankincense, silver, halwa · 8–1 &amp; 5–10</text>

          {/* North arrow and scale */}
          <g transform="translate(748 470)" fill={p.ink}>
            <path d="M0 -18 L6 6 L0 2 L-6 6 Z" />
            <text y="18" fontSize="7" textAnchor="middle" fontWeight="600">N</text>
          </g>
          <g transform="translate(24 496)" fill={p.ink} fontSize="5.5">
            <rect width="40" height="3" />
            <rect x="40" width="40" height="3" fill="none" stroke={p.ink} strokeWidth="0.6" />
            <text y="-3">0</text>
            <text x="38" y="-3">250</text>
            <text x="74" y="-3">500 m</text>
          </g>
        </svg>
      </figure>

      <aside className="min-w-0 flex-1 text-[10.5px] leading-[1.55]" aria-label="Walking notes">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: p.muted }}>Walking notes</p>
        <h2 className="mt-2 text-[22px] leading-tight tracking-[-0.01em]" style={{ fontFamily: '"Instrument Serif", Newsreader, Georgia, serif' }}>
          The corniche, end to end
        </h2>
        <p className="mt-2" style={{ color: p.muted }}>
          Start at the fish market at 7, before the boats are unloaded. Walk east with the sea on your left; the souq gate is opposite the old customs house.
        </p>
        <table className="mt-4 w-full border-collapse font-mono text-[8.5px] tabular-nums">
          <caption className="pb-1.5 text-left text-[9px] font-sans font-medium">Mwasalat bus 04 · Ruwi ⇄ Muttrah</caption>
          <thead style={{ color: p.muted }}>
            <tr>
              <th className="py-0.5 text-left font-normal">Stop</th>
              <th className="py-0.5 text-right font-normal">Sat–Thu</th>
              <th className="py-0.5 text-right font-normal">Fri</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Ruwi Station", "06:10", "13:40"],
              ["Wadi Kabir", "06:24", "13:54"],
              ["Muttrah Fish Market", "06:35", "14:05"],
              ["Souq Gate", "06:38", "14:08"],
              ["Muttrah Fort", "06:42", "14:12"],
              ["Riyam Park", "06:47", "14:17"],
            ].map((r) => (
              <tr key={r[0]} style={{ borderTop: `0.5px solid ${p.casing}88` }}>
                <td className="py-[3px]">{r[0]}</td>
                <td className="py-[3px] text-right">{r[1]}</td>
                <td className="py-[3px] text-right">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-[7.5px] leading-[1.5]" style={{ color: p.muted }}>
          Every 20 min until 22:00; fare 200 bz. Riyam Park’s incense burner is lit after sunset. The souq closes 1–5 pm. Contours at 20 m intervals; spot heights in metres above mean sea level. Survey 2024, revised Sept 2026.
        </p>
        <p className="mt-5 text-[11px]" style={{ color: p.muted }}>
          Hover the sheet to look closer. <kbd className="rounded border px-1 font-mono text-[9px]" style={{ borderColor: p.casing }}>[</kbd>{" "}
          <kbd className="rounded border px-1 font-mono text-[9px]" style={{ borderColor: p.casing }}>]</kbd> or Alt + scroll to change the power.
        </p>
      </aside>
    </div>
  );
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <Loupe theme={night ? "night" : "paper"} className="h-full min-h-full w-full">
      <Sheet p={night ? NIGHT : PAPER} />
    </Loupe>
  );
}
