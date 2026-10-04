"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import "./balance-stats.css";

/**
 * Balance Stats
 * Money in against money out, on a real balance. Each coin is a fixed sum;
 * they drop into the two pans one at a time as the scale scrolls into view,
 * and every landing knocks the beam, which swings and settles at an angle
 * set by the difference. The needle at the pivot reads the surplus. Pick
 * another month and the coins that no longer belong lift away while new
 * ones fall, and the beam finds its new rest.
 */

type Month = { label: string; left: number; right: number };
type Props = {
  months: Month[];
  /** Names of the two pans. */
  names?: [string, string];
  /** How much one coin is worth. */
  coin?: number;
  currency?: string;
  title?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const W = 520, H = 292;
const PX = W / 2, PY = 92; // pivot
const ARM = 168; // half-beam
const CHAIN = 96; // pivot-to-pan drop
const MAX_TILT = 14; // degrees

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Where coin i sits in a pan: a little pyramid of stacked columns. */
function coinSpot(i: number) {
  const perCol = 6;
  const cols = [0, -1, 1, -2, 2, -3, 3];
  const c = Math.floor(i / perCol), r = i % perCol;
  return { x: cols[c % cols.length] * 19 + (c >= cols.length ? 9 : 0), y: -r * 6.2 };
}

export function BalanceStats({ months, names = ["Earned", "Spent"], coin = 500, currency = "OMR", title = "Earned and spent", theme = "paper", motion = "full", className = "" }: Props) {
  const root = useRef<HTMLElement>(null);
  const beam = useRef<SVGGElement>(null);
  const panL = useRef<SVGGElement>(null);
  const panR = useRef<SVGGElement>(null);
  const needle = useRef<SVGGElement>(null);
  const [mi, setMi] = useState(months.length - 1);
  const [on, setOn] = useState(false);
  const [count, setCount] = useState<[number, number]>([0, 0]);
  const phys = useRef({ a: 0, v: 0, raf: 0, last: 0 });

  const m = months[mi];
  const target: [number, number] = [Math.round(m.left / coin), Math.round(m.right / coin)];
  const still = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Coins move one at a time toward the month's counts, alternating pans so the beam rocks as it fills.
  useEffect(() => {
    if (!on) return;
    if (still()) { setCount(target); return; }
    const id = window.setInterval(() => {
      setCount((c) => {
        const d0 = target[0] - c[0], d1 = target[1] - c[1];
        if (!d0 && !d1) { window.clearInterval(id); return c; }
        // Whichever pan is further from done moves next.
        if (Math.abs(d0) >= Math.abs(d1)) return [c[0] + Math.sign(d0), c[1]];
        return [c[0], c[1] + Math.sign(d1)];
      });
    }, 85);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, mi]);

  // The beam: a lightly damped spring toward the angle the weights ask for; each change knocks it.
  const weightL = count[0] * coin, weightR = count[1] * coin;
  const want = weightL + weightR ? Math.max(-MAX_TILT, Math.min(MAX_TILT, ((weightR - weightL) / (weightL + weightR)) * 90)) : 0;
  useEffect(() => {
    const st = phys.current;
    const draw = () => {
      const a = st.a, r = (a * Math.PI) / 180;
      beam.current?.setAttribute("transform", `rotate(${a.toFixed(3)} ${PX} ${PY})`);
      const lx = PX - Math.cos(r) * ARM, ly = PY - Math.sin(r) * ARM;
      const rx = PX + Math.cos(r) * ARM, ry = PY + Math.sin(r) * ARM;
      panL.current?.setAttribute("transform", `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
      panR.current?.setAttribute("transform", `translate(${rx.toFixed(2)} ${ry.toFixed(2)})`);
      needle.current?.setAttribute("transform", `rotate(${(-a * 2.2).toFixed(3)} ${PX} ${PY})`);
    };
    if (still()) { st.a = want; st.v = 0; draw(); return; }
    st.v += (want - st.a) * 0.6; // the knock of a coin landing
    const step = (now: number) => {
      const dt = Math.min(0.032, st.last ? (now - st.last) / 1000 : 0.016);
      st.last = now;
      const k = 38, c = 2 * 0.32 * Math.sqrt(k);
      st.v += ((want - st.a) * k - st.v * c) * dt;
      st.a += st.v * dt;
      draw();
      if (Math.abs(want - st.a) > 0.01 || Math.abs(st.v) > 0.02) st.raf = requestAnimationFrame(step);
      else { st.a = want; st.v = 0; st.raf = 0; st.last = 0; draw(); }
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(st.raf); st.raf = 0; st.last = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want, motion]);

  const diff = m.left - m.right;
  const most: [number, number] = [Math.max(...months.map((x) => Math.round(x.left / coin))), Math.max(...months.map((x) => Math.round(x.right / coin)))];
  const coins = (n: number, side: 0 | 1) =>
    // Every coin either pan could ever hold is drawn, so coins that leave can lift away rather than vanish.
    Array.from({ length: most[side] }, (_, i) => {
      const p = coinSpot(i);
      const live = i < n;
      return (
        <g key={i} className="bal__coin" data-live={live || undefined} style={{ ["--x" as string]: `${p.x}px`, ["--y" as string]: `${p.y}px` }}>
          <ellipse cx={0} cy={0} rx={9} ry={3.6} className="bal__coin-side" />
          <ellipse cx={0} cy={-2.2} rx={9} ry={3.6} className="bal__coin-face" />
        </g>
      );
    });

  const pan = (side: 0 | 1, ref: RefObject<SVGGElement | null>) => (
    <g ref={ref} className="bal__pan" data-side={side}>
      {/* Chains: three strings from the hook to the dish rim. */}
      <path d={`M0 0 L-46 ${CHAIN} M0 0 L46 ${CHAIN} M0 0 L0 ${CHAIN - 6}`} className="bal__chain" />
      <circle cx={0} cy={0} r={3.2} className="bal__hook" />
      <g transform={`translate(0 ${CHAIN - 7})`} className="bal__stack">{coins(count[side], side)}</g>
      <path d={`M-54 ${CHAIN} Q0 ${CHAIN + 26} 54 ${CHAIN} Z`} className="bal__dish" />
      <path d={`M-54 ${CHAIN} L54 ${CHAIN}`} className="bal__lip" />
    </g>
  );

  return (
    <section ref={root} className={`bal bal--${theme} ${className}`} data-motion={motion} aria-label={title}>
      <div className="bal__head">
        <div>
          <p className="bal__diff" data-neg={diff < 0 || undefined}>
            <span className="bal__sign">{diff >= 0 ? "+" : "−"}</span>
            <span className="bal__cur">{currency}</span> {fmt(Math.abs(diff))}
          </p>
          <p className="bal__sub">{diff >= 0 ? "surplus" : "shortfall"} in {m.label}</p>
        </div>
        <div className="bal__months" role="radiogroup" aria-label="Month">
          {months.map((x, i) => (
            <button key={x.label} type="button" role="radio" aria-checked={i === mi} className="bal__month" onClick={() => setMi(i)}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="bal__svg" role="img" aria-label={`${m.label}: ${names[0]} ${currency} ${fmt(m.left)}, ${names[1]} ${currency} ${fmt(m.right)}, ${diff >= 0 ? "surplus" : "shortfall"} of ${currency} ${fmt(Math.abs(diff))}.`}>
        {/* Stand */}
        <path d={`M${PX - 70} ${H - 14} Q${PX} ${H - 34} ${PX + 70} ${H - 14} Z`} className="bal__foot" />
        <rect x={PX - 5} y={PY} width={10} height={H - 14 - PY - 10} rx={4} className="bal__post" />
        {/* Dial behind the pivot, read by the needle */}
        <path d={`M${PX - 44} ${PY - 8} A46 46 0 0 1 ${PX + 44} ${PY - 8}`} className="bal__arc" />
        {[-30, -15, 0, 15, 30].map((d) => {
          const r = ((d - 90) * Math.PI) / 180;
          return <line key={d} x1={PX + Math.cos(r) * 40} y1={PY + Math.sin(r) * 40} x2={PX + Math.cos(r) * (d ? 46 : 50)} y2={PY + Math.sin(r) * (d ? 46 : 50)} className="bal__tick" />;
        })}
        <g ref={needle}>
          <line x1={PX} y1={PY} x2={PX} y2={PY - 50} className="bal__needle" />
        </g>
        {pan(0, panL)}
        {pan(1, panR)}
        <g ref={beam}>
          <rect x={PX - ARM - 6} y={PY - 4} width={ARM * 2 + 12} height={8} rx={4} className="bal__beam" />
          <circle cx={PX - ARM} cy={PY} r={5} className="bal__end" />
          <circle cx={PX + ARM} cy={PY} r={5} className="bal__end" />
        </g>
        <circle cx={PX} cy={PY} r={9} className="bal__pivot" />
      </svg>

      <div className="bal__legend">
        <p data-side="0">
          <span className="bal__dot" aria-hidden="true" />
          {names[0]} <b>{currency} {fmt(m.left)}</b>
        </p>
        <p className="bal__unit">1 coin = {currency} {fmt(coin)}</p>
        <p data-side="1">
          <span className="bal__dot" aria-hidden="true" />
          {names[1]} <b>{currency} {fmt(m.right)}</b>
        </p>
      </div>

      {/* Tables ignore overflow, so the hidden table sits inside a hidden box. */}
      <div className="bal__sr">
      <table>
        <caption>{title}</caption>
        <thead><tr><th scope="col">Month</th><th scope="col">{names[0]}</th><th scope="col">{names[1]}</th><th scope="col">Difference</th></tr></thead>
        <tbody>
          {months.map((x) => (
            <tr key={x.label}><th scope="row">{x.label}</th><td>{fmt(x.left)}</td><td>{fmt(x.right)}</td><td>{fmt(x.left - x.right)}</td></tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
