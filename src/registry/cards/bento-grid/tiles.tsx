"use client";
import { useEffect, useRef, useState } from "react";
import "./tiles.css";

// Small working pieces of interface for the demo tiles. Fictional product: Lumen.

/** Runs only while on screen, and never under reduced motion. */
function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting && !document.hidden));
    io.observe(el);
    const vis = () => setLive((v) => v && !document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return [ref, live] as const;
}

/* ---------- live traffic chart ---------- */
const seed = (n: number) => Array.from({ length: n }, (_, i) => 52 + Math.sin(i / 3) * 10 + Math.sin(i / 1.3) * 4 + (i % 5) * 1.5);
export function TrafficChart() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [pts, setPts] = useState(() => seed(40));
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setPts((p) => {
      const last = p[p.length - 1];
      const next = Math.max(20, Math.min(90, last + (Math.random() - 0.48) * 9));
      return [...p.slice(1), next];
    }), 900);
    return () => clearInterval(id);
  }, [live]);
  const w = 400, h = 150, max = 100;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - (v / max) * h] as const);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const rate = Math.round(last * 231);
  const delta = ((last - pts[0]) / pts[0]) * 100;
  return (
    <div ref={ref} className="bentov-chart">
      <div className="bentov-chart__top">
        <span className="bentov-label">Requests / s</span>
        <span className={`bentov-chip ${delta >= 0 ? "bentov-chip--up" : ""}`}>{delta >= 0 ? "+" : ""}{delta.toFixed(1)}%</span>
      </div>
      <p className="bentov-chart__value" aria-live="off">{rate.toLocaleString("en-US")}</p>
      <div className="bentov-chart__plot">
      <svg className="bentov-chart__svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="bentov-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--bento-accent)" stopOpacity="0.32" />
            <stop offset="1" stopColor="var(--bento-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--bento-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#bentov-fill)" />
        <path d={line} fill="none" stroke="var(--bento-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <span className="bentov-chart__dot" style={{ top: `${(xy[xy.length - 1][1] / h) * 100}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}

/* ---------- command palette ---------- */
const QUERIES = [
  { q: "deploy", rows: ["Deploy main to production", "Deploy preview for #482", "Deployment history"] },
  { q: "invite", rows: ["Invite a teammate", "Invite by link", "Pending invitations"] },
  { q: "roll", rows: ["Roll back to v2.14.0", "Rollout settings", "Role permissions"] },
];
export function CommandPalette() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [step, setStep] = useState({ k: 0, chars: QUERIES[0].q.length, active: 0 });
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setStep(({ k, chars, active }) => {
      const q = QUERIES[k].q;
      if (chars < q.length) return { k, chars: chars + 1, active: 0 };
      if (active < 2) return { k, chars, active: active + 1 };
      return { k: (k + 1) % QUERIES.length, chars: 0, active: 0 };
    }), 420);
    return () => clearInterval(id);
  }, [live]);
  const cur = QUERIES[step.k];
  const typed = cur.q.slice(0, step.chars);
  return (
    <div ref={ref} className="bentov-cmd" aria-hidden="true">
      <div className="bentov-cmd__win">
        <div className="bentov-cmd__search">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5" /><path d="m11 11 3.5 3.5" /></svg>
          <span className="bentov-cmd__q">{typed || <em>Type a command…</em>}<i className="bentov-caret" /></span>
          <kbd>⌘K</kbd>
        </div>
        <ul className="bentov-cmd__list">
          {cur.rows.map((r, i) => (
            <li key={r} className={step.chars === cur.q.length && i === step.active ? "is-on" : ""}>
              <span className="bentov-cmd__ico">{["↗", "◎", "≡"][i]}</span>{r}{i === step.active && step.chars === cur.q.length && <kbd>↵</kbd>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- presence ---------- */
const PEOPLE = [["AO", 24], ["LC", 205], ["SR", 340], ["KM", 150], ["NH", 280]] as const;
export function Presence() {
  return (
    <div className="bentov-presence">
      <div className="bentov-presence__stack" aria-hidden="true">
        {PEOPLE.map(([n, h], i) => (
          <span key={n} style={{ background: `hsl(${h} 42% 33%)`, animationDelay: `${i * 90}ms` }}>{n}</span>
        ))}
        <span className="bentov-presence__more">+3</span>
      </div>
      <p className="bentov-presence__live"><i aria-hidden="true" />8 editing now</p>
      <span className="bentov-cursor bentov-cursor--a" aria-hidden="true"><svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1v12l3.5-3.2 2.4 5.4 2.4-1.1-2.3-5.2H12Z" fill="#ff7a59" stroke="#fff" strokeWidth="1" /></svg><b>Lena</b></span>
      <span className="bentov-cursor bentov-cursor--b" aria-hidden="true"><svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1v12l3.5-3.2 2.4 5.4 2.4-1.1-2.3-5.2H12Z" fill="#7c6bff" stroke="#fff" strokeWidth="1" /></svg><b>Kai</b></span>
    </div>
  );
}

/* ---------- settings ---------- */
export function Settings() {
  const [on, setOn] = useState([true, false, true]);
  const rows = ["Preview deploys", "Weekly digest", "Two-step sign-in"];
  return (
    <ul className="bentov-settings">
      {rows.map((r, i) => (
        <li key={r}>
          <span id={`bentov-set-${i}`}>{r}</span>
          <button type="button" role="switch" aria-checked={on[i]} aria-labelledby={`bentov-set-${i}`} className="bentov-switch"
            onClick={() => setOn((s) => s.map((v, j) => (j === i ? !v : v)))}><i /></button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- install snippet ---------- */
const MANAGERS = { npm: "npm install @lumen/ui", pnpm: "pnpm add @lumen/ui", bun: "bun add @lumen/ui" } as const;
export function Install() {
  const [pm, setPm] = useState<keyof typeof MANAGERS>("npm");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(MANAGERS[pm]); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  };
  return (
    <div className="bentov-code">
      <div className="bentov-code__bar" role="tablist" aria-label="Package manager">
        {(Object.keys(MANAGERS) as (keyof typeof MANAGERS)[]).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={pm === k} onClick={() => setPm(k)}>{k}</button>
        ))}
        <button type="button" className="bentov-code__copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre className="bentov-code__pre"><code><span className="bentov-tok-dim">$ </span>{MANAGERS[pm]}{"\n"}<span className="bentov-tok-dim">{"// then"}</span>{"\n"}<span className="bentov-tok-key">import</span> {"{ Button }"} <span className="bentov-tok-key">from</span> <span className="bentov-tok-str">"@lumen/ui"</span></code></pre>
    </div>
  );
}

/* ---------- dotted globe ---------- */
export function Globe() {
  const [wrap, live] = useLive<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [regions] = useState(32);
  useEffect(() => {
    const cv = canvas.current, box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const pts: [number, number, number][] = [];
    const N = 1400;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const pings = [[0.2, 0.55], [1.9, 0.3], [3.4, -0.25], [4.6, 0.62], [5.5, -0.1]];
    let rot = 0.6, frame = 0;
    const style = getComputedStyle(box);
    const draw = (t: number) => {
      const w = box.clientWidth, h = box.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w * 0.36, h * 1.05), cx = w * 0.66, cy = h * 1.02;
      const ink = style.getPropertyValue("--bento-ink").trim() || "#fff";
      const accent = style.getPropertyValue("--bento-accent").trim() || "#6ea8ff";
      const c = Math.cos(rot), s = Math.sin(rot);
      ctx.fillStyle = ink;
      for (const [x, y, z] of pts) {
        const xr = x * c - z * s, zr = x * s + z * c;
        if (zr < -0.05) continue;
        ctx.globalAlpha = 0.2 + 0.65 * zr;
        ctx.fillRect(cx + xr * R - 0.8, cy - y * R - 0.8, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
      for (const [lon, lat] of pings) {
        const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
        const xr = x * c - z * s, zr = x * s + z * c;
        if (zr < 0.1) continue;
        const px = cx + xr * R, py = cy - y * R, pulse = ((t / 1400 + lon) % 1);
        ctx.strokeStyle = accent; ctx.globalAlpha = (1 - pulse) * 0.8; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(px, py, 3 + pulse * 10, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = ink;
      }
    };
    const tick = (t: number) => { rot += 0.0025; draw(t); frame = requestAnimationFrame(tick); };
    if (live) frame = requestAnimationFrame(tick); else draw(0);
    return () => cancelAnimationFrame(frame);
  }, [live, wrap]);
  return (
    <div ref={wrap} className="bentov-globe">
      <canvas ref={canvas} aria-hidden="true" />
      <p className="bentov-globe__count"><b>{regions}</b><span>regions, one deploy</span></p>
    </div>
  );
}
