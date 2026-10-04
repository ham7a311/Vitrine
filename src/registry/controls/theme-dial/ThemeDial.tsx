"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./theme-dial.css";

/**
 * Theme Dial
 * Themes laid along one meaningful axis — the light of a day — on a half-dial
 * like a sun-path instrument. Drag the needle and every colour token is mixed
 * continuously between the neighbouring stops, so you watch the interface move
 * through the day; let go and it settles into the nearest detent.
 */

export type ThemeTokens = { bg: string; surface: string; ink: string; muted: string; accent: string; line: string };
export type ThemeStop = { id: string; name: string; note: string; tokens: ThemeTokens };

export const DAY_THEMES: ThemeStop[] = [
  { id: "daylight", name: "Daylight", note: "Cool, bright, neutral", tokens: { bg: "#f5f7fa", surface: "#ffffff", ink: "#12161c", muted: "#5b6472", accent: "#2f6bff", line: "#dfe3ea" } },
  { id: "paper", name: "Paper", note: "Warm ivory, soft ink", tokens: { bg: "#f3eee3", surface: "#fbf8f1", ink: "#241f17", muted: "#766d5d", accent: "#b4532a", line: "#e2dacb" } },
  { id: "dusk", name: "Dusk", note: "Low light, clay and plum", tokens: { bg: "#443a42", surface: "#51464f", ink: "#f4ebe4", muted: "#c3b4ad", accent: "#f2a66d", line: "#5f535c" } },
  { id: "ink", name: "Ink", note: "Deep blue-grey, calm", tokens: { bg: "#18202c", surface: "#212a38", ink: "#e5eaf1", muted: "#95a1b3", accent: "#7ea6ff", line: "#2d3848" } },
  { id: "midnight", name: "Midnight", note: "Near black, moonlit accent", tokens: { bg: "#0a0a0c", surface: "#141417", ink: "#ececec", muted: "#8a8a91", accent: "#e8c56f", line: "#222226" } },
];

/* ─── Colour: mix in OKLab so midpoints stay clean ─────────────────────── */

const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToOklab(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToHex([L, A, B]: number[]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, toSrgb(v))) * 255).toString(16).padStart(2, "0")).join("")}`;
}
function mix(a: string, b: string, t: number) {
  const A = hexToOklab(a);
  const B = hexToOklab(b);
  return oklabToHex(A.map((v, i) => v + (B[i] - v) * t));
}
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Tokens at a continuous position t ∈ [0, stops − 1]. */
export function tokensAt(stops: ThemeStop[], t: number): ThemeTokens {
  const i = Math.min(stops.length - 2, Math.floor(t));
  const f = t - i;
  const a = stops[i].tokens;
  const b = stops[i + 1].tokens;
  return Object.fromEntries((Object.keys(a) as (keyof ThemeTokens)[]).map((k) => [k, mix(a[k], b[k], f)])) as ThemeTokens;
}

/* ─── Geometry ─────────────────────────────────────────────────────────── */

const W = 320;
const H = 182;
const CX = W / 2;
const CY = 164;
const R = 132;
const SWEEP = 150; // degrees of arc used, centred on the top
const angleFor = (t: number, n: number) => 180 - (180 - SWEEP) / 2 - (t / (n - 1)) * SWEEP; // degrees, 0 = right
const point = (deg: number, r: number) => [CX + r * Math.cos((deg * Math.PI) / 180), CY - r * Math.sin((deg * Math.PI) / 180)] as const;

type Props = {
  stops?: ThemeStop[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string, tokens: ThemeTokens) => void;
  /** Fires continuously while scrubbing. */
  onPreview?: (tokens: ThemeTokens) => void;
  motion?: "auto" | "reduced";
  children?: (tokens: ThemeTokens) => React.ReactNode;
};

export function ThemeDial({ stops = DAY_THEMES, value, defaultValue = "paper", onChange, onPreview, motion = "auto", children }: Props) {
  const n = stops.length;
  const indexOf = (id?: string) => Math.max(0, stops.findIndex((s) => s.id === id));
  const [t, setT] = useState(() => indexOf(value ?? defaultValue));
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const raf = useRef(0);
  const labelId = useId();
  const gradId = useId();

  useEffect(() => {
    if (value !== undefined) setT(indexOf(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const tokens = useMemo(() => tokensAt(stops, t), [stops, t]);
  const nearest = Math.round(t);
  const current = stops[nearest];

  useEffect(() => {
    onPreview?.(tokens);
  }, [tokens, onPreview]);

  const reduced = () => motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tRef = useRef(t);
  tRef.current = t;

  /** Ease from wherever the needle is into the nearest detent. */
  const settle = useCallback(
    (to: number) => {
      cancelAnimationFrame(raf.current);
      const target = Math.max(0, Math.min(n - 1, Math.round(to)));
      const from = tRef.current;
      const done = () => onChange?.(stops[target].id, stops[target].tokens);
      // Jump when motion is reduced, or when the tab is hidden and frames won't run.
      if (reduced() || document.hidden || Math.abs(from - target) < 0.001) {
        setT(target);
        return done();
      }
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / 280);
        setT(from + (target - from) * (1 - (1 - k) ** 3));
        if (k < 1) raf.current = requestAnimationFrame(step);
        else done();
      };
      raf.current = requestAnimationFrame(step);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n, stops, onChange],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Pointer position → continuous t along the arc. */
  const tFromPointer = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current!;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    let deg = (Math.atan2(CY - y, x - CX) * 180) / Math.PI;
    if (deg < -90) deg += 360; // below-left counts as the far left
    const start = 180 - (180 - SWEEP) / 2;
    return Math.max(0, Math.min(n - 1, ((start - deg) / SWEEP) * (n - 1)));
  };

  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf.current);
    setDragging(true);
    setT(tFromPointer(e));
    (svgRef.current?.querySelector("[role=slider]") as SVGElement | null)?.focus({ preventScroll: true });
  };
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (dragging) setT(tFromPointer(e));
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    settle(t);
  };

  const onKey = (e: ReactKeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 1, PageDown: -1 };
    if (e.key in map) {
      e.preventDefault();
      settle(nearest + map[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      settle(0);
    } else if (e.key === "End") {
      e.preventDefault();
      settle(n - 1);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 4) return;
    settle(nearest + (e.deltaY > 0 ? 1 : -1));
  };

  const needle = angleFor(t, n);
  const [nx, ny] = point(needle, R - 20);
  const [bx, by] = point(needle, R - 44);
  const [sx, sy] = point(needle, R);
  const arcStart = point(angleFor(0, n), R);
  const arcEnd = point(angleFor(n - 1, n), R);
  // Contrast is reported for the theme you'd get, not the transient mix mid-scrub.
  const ratio = contrast(current.tokens.ink, current.tokens.bg);

  const vars = {
    "--td-bg": tokens.bg,
    "--td-surface": tokens.surface,
    "--td-ink": tokens.ink,
    "--td-muted": tokens.muted,
    "--td-accent": tokens.accent,
    "--td-line": tokens.line,
  } as CSSProperties;

  return (
    <div className="theme-dial" style={vars} data-dragging={dragging || undefined}>
      <div className="theme-dial__instrument">
        <svg
          ref={svgRef}
          className="theme-dial__svg"
          viewBox={`0 0 ${W} ${H}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onWheel={onWheel}
        >
          <defs>
            <linearGradient id={gradId} x1={arcStart[0]} x2={arcEnd[0]} y1="0" y2="0" gradientUnits="userSpaceOnUse">
              {stops.map((s, i) => (
                <stop key={s.id} offset={i / (n - 1)} stopColor={s.tokens.bg} />
              ))}
            </linearGradient>
          </defs>

          {/* The track shows the day as materials: each stop's own background. */}
          <path className="theme-dial__track-edge" d={`M ${arcStart[0]} ${arcStart[1]} A ${R} ${R} 0 0 1 ${arcEnd[0]} ${arcEnd[1]}`} />
          <path className="theme-dial__track" d={`M ${arcStart[0]} ${arcStart[1]} A ${R} ${R} 0 0 1 ${arcEnd[0]} ${arcEnd[1]}`} stroke={`url(#${gradId})`} />

          {/* Minor ticks between stops, major ticks at stops. */}
          {Array.from({ length: (n - 1) * 4 + 1 }, (_, i) => {
            const deg = angleFor(i / 4, n);
            const major = i % 4 === 0;
            const [x1, y1] = point(deg, R - 14);
            const [x2, y2] = point(deg, R - (major ? 26 : 19));
            return <line key={i} className={major ? "theme-dial__tick theme-dial__tick--major" : "theme-dial__tick"} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}

          {/* A short pointer, not a full needle, so the name can sit inside the arc. */}
          <line className="theme-dial__needle" x1={bx} y1={by} x2={nx} y2={ny} />
          <g
            role="slider"
            tabIndex={0}
            aria-labelledby={labelId}
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={nearest}
            aria-valuetext={`${current.name}: ${current.note}`}
            aria-orientation="horizontal"
            className="theme-dial__thumb"
            onKeyDown={onKey}
          >
            <circle cx={sx} cy={sy} r={17} className="theme-dial__thumb-hit" />
            <circle cx={sx} cy={sy} r={9.5} className="theme-dial__sun" />
          </g>
        </svg>

        <div className="theme-dial__readout">
          <span id={labelId} className="theme-dial__sr">
            Theme
          </span>
          <p className="theme-dial__name" aria-hidden="true">
            {current.name}
          </p>
          <p className="theme-dial__note">
            {current.note} · <span title="Text contrast against the background">{ratio.toFixed(1)}:1</span>
          </p>
        </div>

        <div className="theme-dial__stops" role="group" aria-label="Theme stops">
          {stops.map((s, i) => (
            <button key={s.id} type="button" aria-pressed={nearest === i && !dragging} onClick={() => settle(i)}>
              <i style={{ background: s.tokens.bg, boxShadow: `inset 0 0 0 1px ${s.tokens.line}` }} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {children && <div className="theme-dial__preview">{children(tokens)}</div>}
    </div>
  );
}
