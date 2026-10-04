"use client";

import { useState } from "react";
import { MediaInspector, type Asset } from "./MediaInspector";

type Kind = "dunes" | "sea" | "wadi" | "ridges" | "city";

/** Procedural landscapes stand in for photographs, so the demo needs no network. */
function Scene({ kind, p, w, h }: { kind: Kind; p: string[]; w: number; h: number }) {
  const H = Math.round((400 * h) / w);
  const id = `${kind}-${p.join("").replace(/#/g, "")}`;
  const base = H * 0.62;
  return (
    <svg viewBox={`0 0 400 ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p[0]} />
          <stop offset="1" stopColor={p[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height={H} fill={`url(#s${id})`} />
      {kind !== "city" && <circle cx={kind === "sea" ? 290 : 110} cy={base - H * 0.18} r={H * 0.07} fill={p[4]} opacity="0.9" />}
      {kind === "dunes" && (
        <>
          <path d={`M0 ${base} C 90 ${base - 40}, 170 ${base + 10}, 250 ${base - 25} S 380 ${base - 10}, 400 ${base - 20} V ${H} H0Z`} fill={p[2]} />
          <path d={`M0 ${base + 45} C 120 ${base + 5}, 220 ${base + 70}, 400 ${base + 20} V ${H} H0Z`} fill={p[3]} />
        </>
      )}
      {kind === "sea" && (
        <>
          <path d={`M0 ${base - 30} L60 ${base - 70} L120 ${base - 40} L170 ${base - 85} L240 ${base - 30} V ${base} H0Z`} fill={p[2]} />
          <rect y={base} width="400" height={H - base} fill={p[3]} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={250 + i * 6} y={base + 8 + i * 12} width={70 - i * 14} height="2" fill={p[4]} opacity="0.5" />
          ))}
        </>
      )}
      {kind === "wadi" && (
        <>
          <path d={`M0 0 L0 ${H} L130 ${H} C 110 ${base}, 150 ${base - 60}, 120 0Z`} fill={p[2]} />
          <path d={`M400 0 L400 ${H} L270 ${H} C 290 ${base}, 250 ${base - 80}, 290 0Z`} fill={p[2]} opacity="0.85" />
          <path d={`M130 ${H} C 150 ${base + 20}, 250 ${base + 20}, 270 ${H}Z`} fill={p[3]} />
        </>
      )}
      {kind === "ridges" &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M0 ${base - 30 + i * 35} L70 ${base - 70 + i * 40} L150 ${base - 20 + i * 30} L230 ${base - 80 + i * 45} L320 ${base - 30 + i * 30} L400 ${base - 60 + i * 40} V ${H} H0Z`}
            fill={[p[2], p[3], p[4]][i]}
            opacity={1 - i * 0.05}
          />
        ))}
      {kind === "city" && (
        <>
          {Array.from({ length: 14 }, (_, i) => {
            const bw = 20 + ((i * 37) % 22);
            const bh = 40 + ((i * 53) % 90);
            return <rect key={i} x={i * 29} y={base - bh + 40} width={bw} height={bh + H} fill={p[2]} />;
          })}
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={`w${i}`} x={((i * 71) % 390) + 4} y={base - ((i * 29) % 80) + 20} width="3" height="3" fill={p[4]} opacity="0.8" />
          ))}
          <rect y={base + 40} width="400" height={H} fill={p[3]} />
        </>
      )}
    </svg>
  );
}

const RAW: { name: string; kind: Kind; p: string[]; w: number; h: number; bytes: number; place: string; date: string; camera: string }[] = [
  { name: "wahiba-sands-dawn.jpg", kind: "dunes", p: ["#f6c9a0", "#f3e1c7", "#d99a5b", "#b8733d", "#fff4d6"], w: 6000, h: 4000, bytes: 8.4e6, place: "Wahiba Sands", date: "12 Jan 2026, 06:41", camera: "Fujifilm X-T5 · 23mm" },
  { name: "muttrah-corniche-dusk.jpg", kind: "sea", p: ["#3b3456", "#e89a7b", "#2a2438", "#4c4a6e", "#ffd7a8"], w: 4032, h: 3024, bytes: 3.9e6, place: "Muttrah, Muscat", date: "28 Feb 2026, 18:22", camera: "iPhone 16 Pro" },
  { name: "wadi-shab-pools.jpg", kind: "wadi", p: ["#bfe3e0", "#e8f2ee", "#a47552", "#2f9c95", "#fffbe8"], w: 3024, h: 4032, bytes: 4.6e6, place: "Wadi Shab", date: "14 Nov 2025, 09:15", camera: "iPhone 16 Pro" },
  { name: "jebel-akhdar-ridges.jpg", kind: "ridges", p: ["#dfe8ef", "#f5f2ea", "#8aa1b3", "#5d7488", "#3b4c5c"], w: 6000, h: 3375, bytes: 7.1e6, place: "Jebel Akhdar", date: "03 Dec 2025, 16:02", camera: "Fujifilm X-T5 · 56mm" },
  { name: "qurum-night.jpg", kind: "city", p: ["#0e1424", "#1d2740", "#0a0f1c", "#141b2c", "#ffd27a"], w: 4032, h: 3024, bytes: 5.2e6, place: "Qurum, Muscat", date: "21 Mar 2026, 21:48", camera: "iPhone 16 Pro" },
  { name: "sur-dhow-yard.jpg", kind: "sea", p: ["#a9d3e6", "#f1efe6", "#7a6a55", "#3f7f98", "#ffffff"], w: 5184, h: 3456, bytes: 6.0e6, place: "Sur", date: "07 Apr 2026, 11:30", camera: "Fujifilm X-T5 · 23mm" },
  { name: "sharqiya-noon.jpg", kind: "dunes", p: ["#9fd0ee", "#f7efe0", "#e3b27a", "#c98a4f", "#ffffff"], w: 4032, h: 3024, bytes: 3.3e6, place: "Sharqiya Sands", date: "12 Jan 2026, 12:05", camera: "iPhone 16 Pro" },
  { name: "jebel-shams-rim.jpg", kind: "ridges", p: ["#f4c7a5", "#f8e8d8", "#b86f58", "#8a4f45", "#5b3435"], w: 3024, h: 4032, bytes: 4.1e6, place: "Jebel Shams", date: "19 Dec 2025, 17:10", camera: "iPhone 16 Pro" },
  { name: "wadi-bani-khalid.jpg", kind: "wadi", p: ["#cdebd9", "#eef7ef", "#b58a61", "#3fb3a3", "#fffbe8"], w: 6000, h: 4000, bytes: 9.2e6, place: "Wadi Bani Khalid", date: "22 Feb 2026, 10:44", camera: "Fujifilm X-T5 · 16mm" },
  { name: "gutech-campus-evening.jpg", kind: "city", p: ["#433a66", "#c98b8b", "#2d2744", "#3a3356", "#ffe2a8"], w: 5184, h: 3456, bytes: 5.7e6, place: "GUtech, Halban", date: "30 Sep 2026, 18:55", camera: "iPhone 16 Pro" },
];

const ASSETS: Asset[] = RAW.map((r, i) => ({
  id: `a${i}`,
  name: r.name,
  width: r.w,
  height: r.h,
  bytes: r.bytes,
  type: "JPEG",
  alt: `${r.place}, ${r.kind === "city" ? "at night" : "landscape"}`,
  media: <Scene kind={r.kind} p={r.p} w={r.w} h={r.h} />,
  palette: r.p,
  meta: [
    { label: "Taken", value: r.date },
    { label: "Place", value: r.place },
    { label: "Camera", value: r.camera },
    { label: "Owner", value: "Hamza Al-Bulushi" },
  ],
}));

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [note, setNote] = useState("");
  return (
    <div className={`flex h-full min-h-[640px] w-full justify-center overflow-auto px-4 py-8 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[900px]">
        <div className="mb-4 flex items-baseline gap-3">
          <h1 className="m-0 text-[20px] font-semibold tracking-[-0.02em]">Oman field trip</h1>
          <span className={`text-[13px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>10 photos · 58 MB</span>
          <span role="status" className={`ml-auto text-[12.5px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>
            {note}
          </span>
        </div>
        <MediaInspector
          label="Oman field trip photos"
          theme={night ? "night" : "paper"}
          assets={ASSETS}
          actions={[
            { label: "Download", onSelect: (a) => setNote(`Downloading ${a.name}`) },
            { label: "Copy link", onSelect: (a) => setNote(`Link to ${a.name} copied`) },
            { label: "Delete", danger: true, onSelect: (a) => setNote(`${a.name} moved to Trash (demo)`) },
          ]}
        />
      </div>
    </div>
  );
}
