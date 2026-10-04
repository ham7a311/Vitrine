"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./signature-pad.css";

/**
 * Signature Pad
 * A nib that behaves like ink: fast is thin, slow pools, and the width eases so one quick
 * frame can't notch the line. Each segment is its own curve through the midpoints. Clear
 * doesn't wipe — it rewinds, un-drawing the signature last point first.
 */

type Seg = { d: string; w: number };
export type Signature = { svg: string; empty: boolean; typed?: string };

type Props = {
  label?: string;
  thick?: number;
  thin?: number;
  ink?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  onChange?: (sig: Signature) => void;
  className?: string;
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function SignaturePad({ label = "Signature", thick = 4.2, thin = 1.1, ink, theme = "paper", motion = "full", onChange, className = "" }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const layer = useRef<SVGGElement>(null);
  const strokes = useRef<Seg[][]>([]);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const status = useId();
  const colour = ink ?? (theme === "night" ? "#e9e2d0" : "#1d2b4f");

  const emit = () => {
    const el = svg.current;
    if (!el) return;
    const empty = !strokes.current.length;
    onChange?.({ svg: empty ? "" : new XMLSerializer().serializeToString(el), empty });
  };

  const render = (list: Seg[][], cut = Infinity) => {
    const g = layer.current;
    if (!g) return;
    let n = 0;
    const out: string[] = [];
    for (const s of list)
      for (const seg of s) {
        if (n++ >= cut) break;
        out.push(`<path d="${seg.d}" stroke-width="${seg.w.toFixed(2)}" />`);
      }
    g.innerHTML = out.join("");
  };

  useEffect(() => {
    const el = svg.current;
    if (!el || mode !== "draw") return;
    let live: Seg[] | null = null;
    let last: { x: number; y: number; t: number } | null = null;
    let mid: { x: number; y: number } | null = null;
    let w = (thick + thin) / 2;
    const pt = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const vb = el.viewBox.baseVal;
      return { x: ((e.clientX - r.left) / r.width) * vb.width, y: ((e.clientY - r.top) / r.height) * vb.height, t: e.timeStamp };
    };
    const g = layer.current!;
    const add = (p: { x: number; y: number; t: number }, pressure: number, pen: boolean) => {
      if (!last || !mid || !live) return;
      const dist = Math.hypot(p.x - last.x, p.y - last.y);
      if (dist < 0.6) return;
      const dt = Math.max(1, p.t - last.t);
      const v = dist / dt;
      // THE NIB: fast is thin, slow pools; the width eases so one quick frame can't notch the line.
      let target = thick - (thick - thin) * clamp(v / 1.6);
      if (pen && pressure > 0) target *= 0.55 + pressure * 0.9;
      w += (target - w) * 0.35;
      const m = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
      const seg = { d: `M${mid.x.toFixed(1)} ${mid.y.toFixed(1)}Q${last.x.toFixed(1)} ${last.y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`, w };
      live.push(seg);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", seg.d);
      path.setAttribute("stroke-width", w.toFixed(2));
      g.appendChild(path);
      mid = m;
      last = p;
    };
    const down = (e: PointerEvent) => {
      if (e.button > 0 || busy) return;
      el.setPointerCapture(e.pointerId);
      const p = pt(e);
      live = [];
      last = p;
      mid = { x: p.x, y: p.y };
      w = (thick + thin) / 2 + 0.6;
      // a touch of ink where the nib lands
      const dot = { d: `M${p.x.toFixed(1)} ${p.y.toFixed(1)}l0.01 0`, w: w * 1.1 };
      live.push(dot);
      render([...strokes.current, live]);
    };
    const move = (e: PointerEvent) => {
      if (!live) return;
      const evs = e.getCoalescedEvents?.() ?? [e];
      for (const ev of evs.length ? evs : [e]) add(pt(ev), ev.pressure, ev.pointerType === "pen");
    };
    const up = () => {
      if (!live) return;
      strokes.current.push(live);
      live = null;
      setCount(strokes.current.length);
      emit();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thick, thin, mode, busy]);

  // CLEAR REWINDS: un-draw, last point first.
  const clear = () => {
    const list = strokes.current;
    const total = list.reduce((a, s) => a + s.length, 0);
    if (!total) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      strokes.current = [];
      render([]);
      setCount(0);
      setBusy(false);
      emit();
    };
    if (reduced) return done();
    setBusy(true);
    const dur = Math.min(1100, 260 + total * 2.2), t0 = performance.now();
    const step = (now: number) => {
      const k = clamp((now - t0) / dur);
      render(list, Math.floor(total * (1 - ease(k))));
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  };
  const undo = () => {
    strokes.current.pop();
    render(strokes.current);
    setCount(strokes.current.length);
    emit();
  };
  const download = () => {
    const el = svg.current;
    if (!el) return;
    const blob = new Blob([new XMLSerializer().serializeToString(el)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signature.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const signed = mode === "draw" ? count > 0 : typed.trim().length > 0;

  return (
    <div className={`sp sp--${theme} ${className}`} style={{ ["--sp-ink" as string]: colour }}>
      <div className="sp__head">
        <span className="sp__label" id={`${status}-label`}>
          {label}
        </span>
        <button type="button" className="sp__link" onClick={() => setMode((m) => (m === "draw" ? "type" : "draw"))}>
          {mode === "draw" ? "Type your name instead" : "Draw instead"}
        </button>
      </div>
      <div className="sp__pad" data-mode={mode}>
        {mode === "draw" ? (
          <svg ref={svg} viewBox="0 0 600 220" role="img" aria-labelledby={`${status}-label`} aria-describedby={status} xmlns="http://www.w3.org/2000/svg">
            <g ref={layer} fill="none" stroke={colour} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <input
            className="sp__typed"
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              onChange?.({ svg: "", empty: !e.target.value.trim(), typed: e.target.value });
            }}
            placeholder="Your full name"
            aria-labelledby={`${status}-label`}
            autoFocus
          />
        )}
        <div className="sp__line" aria-hidden="true">
          <span>×</span>
          {!signed && <em>Sign here</em>}
        </div>
      </div>
      <div className="sp__foot">
        <p id={status} className="sp__status" aria-live="polite">
          {mode === "type" ? (typed.trim() ? `Signed as ${typed.trim()}` : "Type your name to sign") : count ? `${count} stroke${count > 1 ? "s" : ""}` : "Draw with a mouse, finger or pen"}
        </p>
        {mode === "draw" && (
          <div className="sp__actions">
            <button type="button" onClick={undo} disabled={!count || busy}>
              Undo
            </button>
            <button type="button" onClick={clear} disabled={!count || busy}>
              Clear
            </button>
            <button type="button" onClick={download} disabled={!count || busy}>
              Save SVG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
