"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./gamut-picker.css";

/**
 * Gamut Picker
 * A colour picker for people who care where colours actually exist. You
 * pick in OKLCH — lightness and chroma on a plane, hue on a ring — and the
 * plane shows the truth: a hairline where sRGB runs out, a dashed line
 * where Display P3 does, and hatching over colours a normal screen can't
 * show. Alongside, the colour as oklch() and hex, and its contrast against
 * white and black, with the WCAG grades it earns.
 */

type Props = {
  defaultValue?: { l: number; c: number; h: number };
  onChange?: (v: { l: number; c: number; h: number; hex: string }) => void;
  theme?: "night" | "paper";
  className?: string;
};

const CMAX = 0.37;

/** OKLCH → linear sRGB (Björn Ottosson's OKLab matrices). */
function linSrgb(L: number, C: number, H: number): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
/** Linear sRGB → linear Display P3. */
const toP3 = ([r, g, b]: number[]) => [0.8224621 * r + 0.177538 * g, 0.0331941 * r + 0.9668058 * g, 0.0170827 * r + 0.0723974 * g + 0.9105199 * b];
const inside = (v: number[], e = 1e-7) => v.every((x) => x >= -e && x <= 1 + e);
const enc = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; };
const lum = (v: number[]) => { const [r, g, b] = v.map((x) => Math.min(1, Math.max(0, x))); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const toHex = (v: number[]) => "#" + v.map((x) => Math.round(enc(x) * 255).toString(16).padStart(2, "0")).join("");
/** The largest chroma that stays inside a gamut at this lightness and hue. */
function maxC(L: number, H: number, test: (v: number[]) => boolean) {
  let lo = 0, hi = CMAX;
  for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (test(linSrgb(L, mid, H))) lo = mid; else hi = mid; }
  return lo;
}
const inSrgb = (v: number[]) => inside(v);
const inP3 = (v: number[]) => inside(toP3(v));
const grade = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large" : "Fail");

export function GamutPicker({ defaultValue = { l: 0.72, c: 0.16, h: 48 }, onChange, theme = "night", className = "" }: Props) {
  const id = useId();
  const [col, setCol] = useState(defaultValue);
  const [copied, setCopied] = useState(false);
  const planeRef = useRef<HTMLCanvasElement>(null);
  const [bounds, setBounds] = useState<{ srgb: string; p3: string }>({ srgb: "", p3: "" });
  const ringRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  // Draw the plane for this hue: in-gamut colours as they are, others hatched and dimmed.
  const paint = useCallback((h: number) => {
    const cv = planeRef.current;
    if (!cv) return;
    const W = cv.width, H = cv.height;
    const ctx = cv.getContext("2d")!;
    const img = ctx.createImageData(W, H);
    const d = img.data;
    for (let y = 0; y < H; y++) {
      const L = 1 - y / (H - 1);
      for (let x = 0; x < W; x++) {
        const C = (x / (W - 1)) * CMAX;
        const v = linSrgb(L, C, h);
        const k = (y * W + x) * 4;
        let r = enc(v[0]), g = enc(v[1]), b = enc(v[2]);
        if (!inSrgb(v)) {
          // Out of sRGB: shown clipped, dimmed, with fine diagonal hatching (stronger past P3).
          const p3 = inP3(v);
          const hatch = (x + y) % 7 < 1.5;
          const dim = p3 ? 0.55 : 0.28;
          const grey = 0.5 * (r + g + b) / 1.5;
          r = r * dim + grey * (1 - dim) * 0.4; g = g * dim + grey * (1 - dim) * 0.4; b = b * dim + grey * (1 - dim) * 0.4;
          if (hatch) { r = r * 0.6 + 0.4 * (p3 ? 0.9 : 0.6); g = g * 0.6 + 0.4 * (p3 ? 0.9 : 0.6); b = b * 0.6 + 0.4 * (p3 ? 0.9 : 0.6); }
        }
        d[k] = r * 255; d[k + 1] = g * 255; d[k + 2] = b * 255; d[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // The gamut edges, as SVG lines over the canvas (crisp at any size).
    const pts = (test: (v: number[]) => boolean) => {
      const out: string[] = [];
      for (let i = 0; i <= 60; i++) {
        const L = Math.max(0.004, 1 - i / 60); // true black has no chroma at all; stop just above it
        out.push(`${((maxC(L, h, test) / CMAX) * 100).toFixed(2)},${((i / 60) * 100).toFixed(2)}`);
      }
      return out.join(" ");
    };
    setBounds({ srgb: pts(inSrgb), p3: pts(inP3) });
  }, []);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => paint(col.h));
    return () => cancelAnimationFrame(raf.current);
  }, [col.h, paint]);

  const v = linSrgb(col.l, col.c, col.h);
  const srgbOk = inSrgb(v), p3Ok = inP3(v);
  const hex = toHex(v);
  const Y = lum(v);
  const cw = (1.05) / (Y + 0.05), cb = (Y + 0.05) / 0.05;
  const update = (n: Partial<typeof col>) => {
    const next = { l: Math.min(1, Math.max(0, n.l ?? col.l)), c: Math.min(CMAX, Math.max(0, n.c ?? col.c)), h: (((n.h ?? col.h) % 360) + 360) % 360 };
    setCol(next);
    setCopied(false);
    onChange?.({ ...next, hex: toHex(linSrgb(next.l, next.c, next.h)) });
  };

  // Plane: drag anywhere on it.
  const fromPlane = (e: RPointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    update({ c: ((e.clientX - r.left) / r.width) * CMAX, l: 1 - (e.clientY - r.top) / r.height });
  };
  // Ring: the angle of the pointer around its centre.
  const fromRing = (e: RPointerEvent) => {
    const r = ringRef.current!.getBoundingClientRect();
    const a = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
    update({ h: a });
  };
  const planeKey = (e: KeyboardEvent) => {
    const k = e.shiftKey ? 5 : 1;
    const m: Record<string, Partial<typeof col>> = { ArrowLeft: { c: col.c - 0.004 * k }, ArrowRight: { c: col.c + 0.004 * k }, ArrowUp: { l: col.l + 0.01 * k }, ArrowDown: { l: col.l - 0.01 * k } };
    if (m[e.key]) { e.preventDefault(); update(m[e.key]); }
  };
  const ringKey = (e: KeyboardEvent) => {
    const k = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); update({ h: col.h + k }); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); update({ h: col.h - k }); }
  };
  const fmt = `oklch(${col.l.toFixed(3)} ${col.c.toFixed(3)} ${col.h.toFixed(1)})`;

  return (
    <div className={`gp2 gp2--${theme} ${className}`}>
      <div className="gp2__plane-wrap">
        <div
          className="gp2__plane"
          role="slider"
          tabIndex={0}
          aria-label="Lightness and chroma"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(col.l * 100)}
          aria-valuetext={`Lightness ${Math.round(col.l * 100)}%, chroma ${col.c.toFixed(3)}${srgbOk ? "" : ", outside sRGB"}`}
          aria-describedby={`${id}-kb`}
          onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); fromPlane(e); }}
          onPointerMove={(e) => { if (e.buttons) fromPlane(e); }}
          onKeyDown={planeKey}
        >
          <canvas ref={planeRef} width={320} height={240} aria-hidden="true" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="gp2__bounds">
            <polyline points={bounds.p3} className="gp2__p3" />
            <polyline points={bounds.srgb} className="gp2__srgb" />
          </svg>
          <span className="gp2__dot" style={{ left: `${(col.c / CMAX) * 100}%`, top: `${(1 - col.l) * 100}%`, background: hex }} aria-hidden="true" />
          <span className="gp2__axis gp2__axis--x" aria-hidden="true">Chroma →</span>
          <span className="gp2__axis gp2__axis--y" aria-hidden="true">Lightness →</span>
        </div>
        <div className="gp2__legend" aria-hidden="true">
          <span><i className="gp2__k gp2__k--s" />sRGB edge</span>
          <span><i className="gp2__k gp2__k--p" />Display P3 edge</span>
          <span><i className="gp2__k gp2__k--h" />Can’t show on most screens</span>
        </div>
      </div>

      <div className="gp2__side">
        <div className="gp2__ring" ref={ringRef}>
          <div
            className="gp2__ring-track"
            role="slider"
            tabIndex={0}
            aria-label="Hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(col.h)}
            aria-valuetext={`${Math.round(col.h)} degrees`}
            onPointerDown={(e) => {
              // Only the ring itself picks a hue, not the swatch inside it.
              const r = ringRef.current!.getBoundingClientRect();
              if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width * 0.36) return;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              fromRing(e);
            }}
            onPointerMove={(e) => { if (e.buttons && (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) fromRing(e); }}
            onKeyDown={ringKey}
          >
            <span className="gp2__knob" style={{ transform: `rotate(${col.h}deg) translateY(calc(var(--ring) / -2 + 9px))` }} aria-hidden="true" />
          </div>
          {/* Out of sRGB, the swatch splits: the nearest sRGB colour, and the colour as specified (vivid on a P3 screen). */}
          <div className="gp2__swatch" style={{ background: hex }} aria-hidden="true">
            {!srgbOk && (
              <>
                <div className="gp2__swatch-true" style={{ background: fmt }} />
                <span className="gp2__sw-l">sRGB</span>
                <span className="gp2__sw-r">{p3Ok ? "P3" : "Spec"}</span>
              </>
            )}
          </div>
        </div>

        <dl className="gp2__read">
          <div>
            <dt>OKLCH</dt>
            <dd>
              <code>{fmt}</code>
              <button type="button" className="gp2__copy" onClick={() => { navigator.clipboard?.writeText(fmt).then(() => setCopied(true), () => {}); }}>{copied ? "Copied" : "Copy"}</button>
            </dd>
          </div>
          <div>
            <dt>Hex</dt>
            <dd><code>{hex}</code>{!srgbOk && <span className="gp2__warn">{p3Ok ? "nearest sRGB · P3 only" : "nearest sRGB · beyond P3"}</span>}</dd>
          </div>
          <div className="gp2__contrast">
            <dt>Contrast</dt>
            <dd>
              <span className="gp2__chip" style={{ background: hex, color: "#fff" }}>Aa</span>
              <span className="tabular-nums">{cw.toFixed(2)}</span>
              <span className="gp2__grade" data-fail={cw < 3 || undefined}>{grade(cw)}</span>
              <span className="gp2__chip" style={{ background: hex, color: "#000" }}>Aa</span>
              <span className="tabular-nums">{cb.toFixed(2)}</span>
              <span className="gp2__grade" data-fail={cb < 3 || undefined}>{grade(cb)}</span>
            </dd>
          </div>
        </dl>
        <p id={`${id}-kb`} className="gp2__kb">Arrows move on the plane and round the ring · Shift for bigger steps</p>
      </div>
    </div>
  );
}
