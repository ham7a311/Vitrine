"use client";
import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { score, type Result } from "./score";
import "./you-draw-it.css";

export type DrawPoint = { x: string; y: number };
export type YouDrawItProps = {
  data: DrawPoint[];
  /** How many points are shown before the reader guesses the rest. */
  known: number;
  yDomain: [number, number];
  question: string;
  formatY?: (v: number) => string;
  /** Column heading for the x values in the numbers table. */
  xLabel?: string;
  onReveal?: (result: Result, guess: number[]) => void;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const W = 640, H = 300, M = { t: 18, r: 26, b: 34, l: 52 };

/**
 * You Draw It
 * The reader sees the start of a trend, draws how they think it continued,
 * then the real line is drawn over their guess with the gap shaded and a
 * plain sentence about how close they were.
 */
export function YouDrawIt({ data, known, yDomain, question, formatY = (v) => String(Math.round(v)), xLabel = "Point", onReveal, theme = "light", motion = true, className = "" }: YouDrawItProps) {
  const id = useId();
  const hidden = data.length - known;
  const [guess, setGuess] = useState<(number | null)[]>(() => Array(hidden).fill(null));
  const [revealed, setRevealed] = useState<Result | null>(null);
  const [cursor, setCursor] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState("");
  const last = useRef<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  const [lo, hi] = yDomain;
  const x = (i: number) => M.l + (i / (data.length - 1)) * (W - M.l - M.r);
  const y = (v: number) => M.t + (1 - (v - lo) / (hi - lo)) * (H - M.t - M.b);
  const yInv = (py: number) => lo + (1 - (py - M.t) / (H - M.t - M.b)) * (hi - lo);
  const clamp = (v: number) => Math.max(lo, Math.min(hi, v));
  const ticks = useMemo(() => Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4), [lo, hi]);
  const anchor = data[known - 1].y;
  const complete = guess.every((g) => g !== null);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = svg.current!.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };
  const paint = (px: number, py: number) => {
    const i = Math.round(((px - M.l) / (W - M.l - M.r)) * (data.length - 1)) - known;
    if (i < 0 || i >= hidden) return;
    const v = clamp(yInv(py));
    setGuess((g) => {
      const n = [...g];
      // Fill any columns skipped by a fast stroke so the line has no gaps.
      const from = last.current ?? i;
      const a = Math.min(from, i), b = Math.max(from, i);
      const va = last.current !== null && n[from] !== null ? (n[from] as number) : v;
      for (let k = a; k <= b; k++) n[k] = b === a ? v : va + ((v - va) * (k - from)) / (i - from || 1);
      return n;
    });
    last.current = i;
    setCursor(i);
  };
  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing(true);
    last.current = null;
    const { px, py } = local(e);
    paint(px, py);
  };
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => { if (drawing && !revealed) { const { px, py } = local(e); paint(px, py); } };
  const onUp = () => { setDrawing(false); last.current = null; };

  const reveal = () => {
    if (!complete || revealed) return;
    const truth = data.slice(known).map((d) => d.y);
    const r = score(truth, guess as number[], hi - lo);
    setRevealed(r);
    setMessage(r.sentence);
    onReveal?.(r, guess as number[]);
  };
  const reset = () => { setGuess(Array(hidden).fill(null)); setRevealed(null); setCursor(0); setMessage("Guess cleared."); };

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (revealed) return;
    const step = (hi - lo) / 40;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const c = Math.max(0, Math.min(hidden - 1, cursor + (e.key === "ArrowRight" ? 1 : -1)));
      setCursor(c);
      if (guess[c] === null) setGuess((g) => { const n = [...g]; n[c] = (c ? n[c - 1] : null) ?? anchor; return n; });
      setMessage(`${data[known + c].x}: guess ${formatY((guess[c] ?? (c ? guess[c - 1] : null) ?? anchor) as number)}`);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const v = clamp(((guess[cursor] ?? (cursor ? guess[cursor - 1] : null) ?? anchor) as number) + (e.key === "ArrowUp" ? step : -step) * (e.shiftKey ? 5 : 1));
      setGuess((g) => { const n = [...g]; n[cursor] = v; return n; });
      setMessage(`${data[known + cursor].x}: guess ${formatY(v)}`);
    } else if (e.key === "Enter") { e.preventDefault(); reveal(); }
  };

  const knownPath = data.slice(0, known).map((d, i) => `${i ? "L" : "M"}${x(i)} ${y(d.y)}`).join("");
  const guessPts = guess.map((g, i) => (g === null ? null : [x(known + i), y(g)] as const));
  const guessPath = [[x(known - 1), y(anchor)] as const, ...guessPts].reduce((acc, p, i, arr) => (p === null ? acc : `${acc}${acc && arr[i - 1] !== null ? "L" : "M"}${p[0]} ${p[1]}`), "");
  const truthPath = data.slice(known - 1).map((d, i) => `${i ? "L" : "M"}${x(known - 1 + i)} ${y(d.y)}`).join("");
  const gap = revealed ? `M${x(known - 1)} ${y(anchor)}${guess.map((g, i) => `L${x(known + i)} ${y(g as number)}`).join("")}${data.slice(known).reverse().map((d, i) => `L${x(data.length - 1 - i)} ${y(d.y)}`).join("")}Z` : "";

  return (
    <figure className={`ydraw ydraw--${theme} ${className}`} data-motion={motion ? undefined : "off"} data-revealed={revealed ? true : undefined} aria-labelledby={`${id}-q`}>
      <figcaption id={`${id}-q`} className="ydraw__q">{question}</figcaption>
      <svg
        ref={svg}
        className="ydraw__chart"
        viewBox={`0 0 ${W} ${H}`}
        role="application"
        tabIndex={0}
        aria-roledescription="drawable chart"
        aria-label={`${question} The first ${known} values are shown. Use left and right arrows to pick a point and up and down to set your guess, then Enter to reveal.`}
        data-drawing={drawing || undefined}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        onFocus={() => {
          // Keyboard drawing starts at the first hidden point, from the last known value.
          if (revealed || guess[cursor] !== null || drawing) return;
          setGuess((g) => { const n = [...g]; n[cursor] = (cursor ? n[cursor - 1] : null) ?? anchor; return n; });
          setMessage(`${data[known + cursor].x}: guess ${formatY((cursor ? guess[cursor - 1] : null) ?? anchor)}. Up and down change it.`);
        }}
      >
        {ticks.map((t) => <g key={t}><line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="ydraw__grid" /><text x={M.l - 8} y={y(t) + 4} className="ydraw__ytick">{formatY(t)}</text></g>)}
        {data.map((d, i) => <text key={d.x} x={x(i)} y={H - 10} className="ydraw__xtick" data-hidden={i >= known || undefined}>{d.x}</text>)}
        {!revealed && <rect x={x(known - 1)} y={M.t} width={x(data.length - 1) - x(known - 1) + 6} height={H - M.t - M.b} className="ydraw__zone" />}
        {!revealed && !guess.some((g) => g !== null) && <text x={(x(known - 1) + x(data.length - 1)) / 2} y={(M.t + H - M.b) / 2} className="ydraw__hint">Draw your guess →</text>}
        {revealed && <path d={gap} className="ydraw__gap" />}
        <path d={knownPath} className="ydraw__known" />
        {guessPath && <path d={guessPath} className="ydraw__guess" />}
        {guessPts.map((p, i) => p && <circle key={i} cx={p[0]} cy={p[1]} r={i === cursor && !revealed ? 5 : 3.5} className="ydraw__gdot" />)}
        {revealed && <path d={truthPath} className="ydraw__truth" pathLength={1} />}
        {revealed && data.slice(known).map((d, i) => <circle key={d.x} cx={x(known + i)} cy={y(d.y)} r="3.5" className="ydraw__tdot" />)}
        <circle cx={x(known - 1)} cy={y(anchor)} r="4.5" className="ydraw__anchor" />
      </svg>
      <div className="ydraw__foot">
        {revealed ? (
          <>
            <p className="ydraw__result">{revealed.sentence}</p>
            <button type="button" className="ydraw__ghost" onClick={reset}>Try again</button>
          </>
        ) : (
          <>
            <p className="ydraw__status">{complete ? "Ready when you are." : `${guess.filter((g) => g !== null).length} of ${hidden} points drawn.`}</p>
            <button type="button" className="ydraw__primary" disabled={!complete} onClick={reveal}>Show me</button>
          </>
        )}
      </div>
      {revealed && (
        <details className="ydraw__table">
          <summary>The numbers</summary>
          <table>
            <thead><tr><th scope="col">{xLabel}</th><th scope="col">Your guess</th><th scope="col">Actual</th></tr></thead>
            <tbody>{data.slice(known).map((d, i) => <tr key={d.x}><th scope="row">{d.x}</th><td>{formatY(guess[i] as number)}</td><td>{formatY(d.y)}</td></tr>)}</tbody>
          </table>
        </details>
      )}
      <p className="ydraw__sr" aria-live="polite">{message}</p>
    </figure>
  );
}
