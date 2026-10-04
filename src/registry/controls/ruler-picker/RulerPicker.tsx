"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./ruler-picker.css";

/**
 * Ruler Picker
 * A number picked the way a tape measure is read. Drag or flick the ruler
 * under a fixed needle — it coasts, then settles exactly on a tenth — and
 * the ticks swell as they pass the needle while the big readout rolls its
 * digits. Switch kg ⇄ lb and the value converts while the ruler re-scales
 * itself to the new unit. A soft band marks the healthy range.
 */

type Props = {
  label?: string;
  defaultKg?: number;
  /** Healthy range in kg, shown as a band. */
  band?: [number, number];
  bandLabel?: string;
  onChange?: (kg: number) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const LB = 2.20462;
const PPU = 96; // px per unit (kg or lb) at rest
const RANGE = { kg: [30, 200], lb: [66, 440] } as const;

export function RulerPicker({ label = "Your weight", defaultKg = 72.4, band = [56.7, 76.4], bandLabel = "Healthy range for 1.75 m", onChange, theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [shown, setShown] = useState(defaultKg); // in the current unit, snapped to 0.1
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const S = useRef({ v: defaultKg, vel: 0, target: NaN as number, ppu: PPU, ppuTo: PPU, unit: "kg" as "kg" | "lb", dragging: false, raf: 0, last: 0, lastX: 0, lastT: 0 });
  const colors = useRef({ ink: "#1d1a15", soft: "rgba(29,26,21,.35)", band: "rgba(47,191,113,.16)", bandEdge: "rgba(47,191,113,.6)", bg: "#fbf8f1" });

  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clampU = (v: number, u = S.current.unit) => Math.min(RANGE[u][1], Math.max(RANGE[u][0], v));
  const snap = (v: number) => Math.round(v * 10) / 10;

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const s = S.current;
    const dpr = Math.min(devicePixelRatio, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const c = colors.current, cx = W / 2;
    // The healthy band.
    const k = s.unit === "kg" ? 1 : LB;
    const b0 = cx + (band[0] * k - s.v) * s.ppu, b1 = cx + (band[1] * k - s.v) * s.ppu;
    ctx.fillStyle = c.band;
    ctx.fillRect(b0, 0, b1 - b0, H - 26);
    ctx.fillStyle = c.bandEdge;
    ctx.fillRect(b0, H - 28, b1 - b0, 2);
    // Ticks every tenth, longer at halves and wholes, swelling near the needle.
    const step = s.ppu < 40 ? 0.5 : 0.1;
    const span = W / 2 / s.ppu + 1;
    const from = Math.floor((s.v - span) / step) * step, to = s.v + span;
    ctx.textAlign = "center";
    ctx.font = `500 11px "Geist Mono", ui-monospace, monospace`;
    for (let u = from; u <= to; u += step) {
      const uu = Math.round(u * 10) / 10;
      if (uu < RANGE[s.unit][0] || uu > RANGE[s.unit][1]) continue;
      const x = cx + (uu - s.v) * s.ppu;
      const whole = Math.abs(uu - Math.round(uu)) < 1e-6, half = Math.abs(uu * 2 - Math.round(uu * 2)) < 1e-6;
      const near = Math.exp(-Math.pow((x - cx) / 70, 2));
      const h = (whole ? 30 : half ? 20 : 12) * (1 + near * 0.55);
      ctx.globalAlpha = 0.35 + 0.65 * Math.max(near, whole ? 0.55 : 0.2);
      ctx.fillStyle = c.ink;
      ctx.fillRect(Math.round(x * 2) / 2 - (whole ? 0.75 : 0.5), 0, whole ? 1.5 : 1, h);
      if (whole && (s.ppu >= 40 || Math.round(uu) % 5 === 0)) {
        ctx.globalAlpha = 0.45 + 0.55 * near;
        ctx.fillText(String(Math.round(uu)), x, h + 16);
      }
    }
    ctx.globalAlpha = 1;
    // Fade the ends.
    const fade = ctx.createLinearGradient(0, 0, W, 0);
    fade.addColorStop(0, c.bg); fade.addColorStop(0.16, "rgba(0,0,0,0)"); fade.addColorStop(0.84, "rgba(0,0,0,0)"); fade.addColorStop(1, c.bg);
    ctx.globalCompositeOperation = "destination-out";
    const fo = ctx.createLinearGradient(0, 0, W, 0);
    fo.addColorStop(0, "rgba(0,0,0,1)"); fo.addColorStop(0.18, "rgba(0,0,0,0)"); fo.addColorStop(0.82, "rgba(0,0,0,0)"); fo.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = fo;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    void fade;
  }, [band]);

  const publish = useCallback(() => {
    const s = S.current;
    const v = snap(s.v);
    setShown(v);
    onChange?.(s.unit === "kg" ? v : snap(v / LB));
  }, [onChange]);

  const tick = useCallback((now: number) => {
    const s = S.current;
    s.raf = 0;
    const dt = Math.min(0.032, s.last ? (now - s.last) / 1000 : 0.016);
    s.last = now;
    let busy = false;
    if (!s.dragging) {
      if (Math.abs(s.vel) > 0.4) {
        // Coasting after a flick.
        s.v = clampU(s.v + s.vel * dt);
        s.vel *= Math.exp(-3.2 * dt);
        if (s.v <= RANGE[s.unit][0] || s.v >= RANGE[s.unit][1]) s.vel = 0;
        busy = true;
      } else {
        // Then settling exactly on a tenth.
        if (Number.isNaN(s.target)) s.target = snap(s.v);
        s.v += (s.target - s.v) * Math.min(1, dt * 14);
        s.vel = 0;
        if (Math.abs(s.target - s.v) > 0.0005) busy = true; else { s.v = s.target; s.target = NaN; }
      }
    }
    s.ppu += (s.ppuTo - s.ppu) * Math.min(1, dt * 7);
    if (Math.abs(s.ppuTo - s.ppu) > 0.05) busy = true; else s.ppu = s.ppuTo;
    draw();
    publish();
    if (busy || s.dragging) s.raf = requestAnimationFrame(tick);
    else s.last = 0;
  }, [draw, publish]);
  const wake = useCallback(() => { const s = S.current; if (!s.raf) s.raf = requestAnimationFrame(tick); }, [tick]);

  useEffect(() => {
    const cs = getComputedStyle(wrapRef.current!);
    colors.current = { ink: cs.getPropertyValue("--ink").trim(), soft: cs.getPropertyValue("--muted").trim(), band: cs.getPropertyValue("--band").trim(), bandEdge: cs.getPropertyValue("--band-edge").trim(), bg: cs.getPropertyValue("--card").trim() };
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvasRef.current!);
    let alive = true;
    document.fonts?.ready.then(() => alive && draw());
    const el = canvasRef.current!;
    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      const s = S.current;
      s.v = clampU(s.v + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / s.ppu);
      s.target = NaN;
      wake();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { alive = false; ro.disconnect(); el.removeEventListener("wheel", onWheel); cancelAnimationFrame(S.current.raf); S.current.raf = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const onDown = (e: React.PointerEvent) => {
    const s = S.current;
    s.dragging = true; s.vel = 0; s.target = NaN;
    s.lastX = e.clientX; s.lastT = e.timeStamp;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wake();
  };
  const onMove = (e: React.PointerEvent) => {
    const s = S.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX, dtm = Math.max(1, e.timeStamp - s.lastT);
    s.v = clampU(s.v - dx / s.ppu);
    s.vel = s.vel * 0.6 + (-dx / s.ppu / (dtm / 1000)) * 0.4;
    s.lastX = e.clientX; s.lastT = e.timeStamp;
  };
  const onUp = () => {
    const s = S.current;
    s.dragging = false;
    if (reduced()) s.vel = 0;
    wake();
  };
  const nudge = (d: number) => { const s = S.current; s.vel = 0; s.target = snap(clampU((Number.isNaN(s.target) ? snap(s.v) : s.target) + d)); if (reduced()) s.v = s.target; wake(); };
  const onKey = (e: KeyboardEvent) => {
    const m: Record<string, number> = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1, PageUp: 5, PageDown: -5 };
    if (e.key in m) { e.preventDefault(); nudge(m[e.key] * (e.shiftKey ? 10 : 1)); }
    else if (e.key === "Home") { e.preventDefault(); nudge(RANGE[S.current.unit][0] - S.current.v); }
    else if (e.key === "End") { e.preventDefault(); nudge(RANGE[S.current.unit][1] - S.current.v); }
  };

  const switchUnit = (u: "kg" | "lb") => {
    const s = S.current;
    if (u === s.unit) return;
    // Same weight, new unit: the ruler starts at the old unit's spacing and re-scales to the new one.
    const k = u === "lb" ? LB : 1 / LB;
    s.v = snap(clampU(s.v * k, u));
    s.target = NaN;
    s.ppu = s.ppu / k;
    s.ppuTo = PPU;
    s.unit = u;
    if (reduced()) s.ppu = PPU;
    setUnit(u);
    wake();
  };

  const text = shown.toFixed(1);
  return (
    <div ref={wrapRef} className={`rp rp--${theme} ${className}`} data-motion={motion}>
      <div className="rp__top">
        <span className="rp__label" id={`${id}-l`}>{label}</span>
        <div className="rp__units" role="radiogroup" aria-label="Unit">
          {(["kg", "lb"] as const).map((u) => (
            <button key={u} type="button" role="radio" aria-checked={unit === u} onClick={() => switchUnit(u)}>{u}</button>
          ))}
        </div>
      </div>
      <p className="rp__value" aria-hidden="true">
        {Array.from(text).map((ch, i) =>
          ch === "." ? <span key={`p${i}`} className="rp__dot">.</span> : (
            <span key={text.length - i} className="rp__digit">
              <span className="rp__strip" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
                {"0123456789".split("").map((d) => <span key={d}>{d}</span>)}
              </span>
            </span>
          ),
        )}
        <span className="rp__unit">{unit}</span>
      </p>
      <div
        className="rp__ruler"
        role="slider"
        tabIndex={0}
        aria-labelledby={`${id}-l`}
        aria-valuemin={RANGE[unit][0]}
        aria-valuemax={RANGE[unit][1]}
        aria-valuenow={shown}
        aria-valuetext={`${text} ${unit === "kg" ? "kilograms" : "pounds"}`}
        onKeyDown={onKey}
      >
        <canvas ref={canvasRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} aria-hidden="true" />
        <span className="rp__needle" aria-hidden="true" />
      </div>
      <p className="rp__band"><i aria-hidden="true" />{bandLabel}: {(band[0] * (unit === "kg" ? 1 : LB)).toFixed(1)}–{(band[1] * (unit === "kg" ? 1 : LB)).toFixed(1)} {unit}</p>
    </div>
  );
}
