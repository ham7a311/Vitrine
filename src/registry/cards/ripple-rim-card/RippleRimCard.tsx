"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import "./ripple-rim-card.css";

/**
 * Ripple Rim Card
 * A drop zone with a rim that knows where the file is. Drag one over and the
 * dashed edge leans in toward it; let go and a wave leaves the spot where it
 * landed and runs both ways round the card, like a stone dropped at the edge
 * of a pool. The file then settles in underneath.
 */

type Item = { id: number; name: string; size: number; done: boolean };

type Props = {
  title: string;
  hint?: string;
  /** Passed to the file input, e.g. ".pdf,.jpg,.png". */
  accept?: string;
  /** In megabytes. */
  maxSize?: number;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const IN = 1.5; // the rim sits just inside the zone
const R = 18; // corner radius
const STEP = 4; // px between samples

/** Points round a rounded rectangle, clockwise from the top-left corner's end, with outward normals. */
function rim(w: number, h: number) {
  const x0 = IN, y0 = IN, x1 = w - IN, y1 = h - IN, r = Math.min(R, (x1 - x0) / 2, (y1 - y0) / 2);
  const top = x1 - x0 - 2 * r, side = y1 - y0 - 2 * r, arc = (Math.PI / 2) * r;
  const segs: [number, (d: number) => [number, number, number, number]][] = [
    [top, (d) => [x0 + r + d, y0, 0, -1]],
    [arc, (d) => { const a = -Math.PI / 2 + d / r; return [x1 - r + Math.cos(a) * r, y0 + r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [side, (d) => [x1, y0 + r + d, 1, 0]],
    [arc, (d) => { const a = d / r; return [x1 - r + Math.cos(a) * r, y1 - r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [top, (d) => [x1 - r - d, y1, 0, 1]],
    [arc, (d) => { const a = Math.PI / 2 + d / r; return [x0 + r + Math.cos(a) * r, y1 - r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [side, (d) => [x0, y1 - r - d, -1, 0]],
    [arc, (d) => { const a = Math.PI + d / r; return [x0 + r + Math.cos(a) * r, y0 + r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
  ];
  const total = segs.reduce((s, [l]) => s + l, 0);
  const n = Math.max(80, Math.round(total / STEP));
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i < n; i++) {
    let d = (i / n) * total;
    for (const [len, at] of segs) {
      if (d <= len) { const [x, y, nx, ny] = at(d); pts.push({ x, y, nx, ny }); break; }
      d -= len;
    }
  }
  return pts;
}

const mb = (b: number) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const kind = (name: string) => (name.split(".").pop() || "file").slice(0, 4).toUpperCase();

export function RippleRimCard({ title, hint, accept, maxSize = 10, multiple = false, onFiles, theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const zone = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [over, setOver] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [said, setSaid] = useState("");
  const nextId = useRef(1);
  const raf = useRef(0);
  // Animation state lives in refs so the loop never waits on React.
  const sim = useRef({ over: false, amt: 0, px: 0, py: 0, tx: 0, ty: 0, wave: null as null | { start: number; t0: number } });
  const lastPress = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const el = zone.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pts = useRef<ReturnType<typeof rim>>([]);
  useEffect(() => {
    if (!box.w) return;
    pts.current = rim(box.w, box.h);
    if (!raf.current) draw();
  }, [box.w, box.h]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);

  const reduced = () => motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw(off?: (i: number, p: { x: number; y: number }) => number) {
    const p = pts.current;
    if (!p.length || !path.current) return;
    let d = "";
    for (let i = 0; i < p.length; i++) {
      const o = off ? off(i, p[i]) : 0;
      d += `${i ? "L" : "M"}${(p[i].x + p[i].nx * o).toFixed(2)} ${(p[i].y + p[i].ny * o).toFixed(2)}`;
    }
    path.current.setAttribute("d", d + "Z");
  }

  function kick() {
    if (raf.current || reduced()) return;
    let last = performance.now();
    const tick = (now: number) => {
      const s = sim.current, p = pts.current, n = p.length;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.amt += ((s.over ? 1 : 0) - s.amt) * Math.min(1, dt * 9);
      s.px += (s.tx - s.px) * Math.min(1, dt * 14);
      s.py += (s.ty - s.py) * Math.min(1, dt * 14);
      let wt = -1;
      if (s.wave) { wt = (now - s.wave.t0) / 1000; if (wt > 1.8) { s.wave = null; wt = -1; } }
      const speed = n / 1.6, width = 6;
      draw((i, q) => {
        // Lean in toward the file being dragged.
        let o = 0;
        if (s.amt > 0.002) {
          const dd = (q.x - s.px) ** 2 + (q.y - s.py) ** 2;
          o -= s.amt * 9 * Math.exp(-dd / (2 * 80 * 80));
        }
        if (wt >= 0 && s.wave) {
          let ds = Math.abs(i - s.wave.start);
          ds = Math.min(ds, n - ds);
          const front = wt * speed;
          o += 10 * Math.exp(-wt / 0.7) * Math.exp(-(((ds - front) / width) ** 2)) * Math.cos((ds - front) * 0.45);
        }
        return o;
      });
      if (s.over || s.amt > 0.002 || s.wave) raf.current = requestAnimationFrame(tick);
      else { raf.current = 0; draw(); }
    };
    raf.current = requestAnimationFrame(tick);
  }

  const local = (x: number, y: number) => {
    const r = zone.current!.getBoundingClientRect();
    return { x: x - r.left, y: y - r.top };
  };

  function ripple(at: { x: number; y: number } | null) {
    const p = pts.current;
    if (!p.length || reduced()) return;
    const { x, y } = at ?? { x: box.w / 2, y: 0 };
    let start = 0, best = Infinity;
    p.forEach((q, i) => { const dd = (q.x - x) ** 2 + (q.y - y) ** 2; if (dd < best) { best = dd; start = i; } });
    sim.current.wave = { start, t0: performance.now() };
    kick();
  }

  function take(list: File[], at: { x: number; y: number } | null) {
    if (!list.length) return;
    const files = multiple ? list : list.slice(0, 1);
    const big = files.find((f) => f.size > maxSize * 1e6);
    if (big) {
      setError(`${big.name} is ${mb(big.size)}. The limit is ${maxSize} MB; try exporting it smaller.`);
      return;
    }
    setError("");
    const added = files.map((f) => ({ id: nextId.current++, name: f.name, size: f.size, done: false }));
    setItems((cur) => (multiple ? [...cur, ...added] : added));
    setSaid(`${files.map((f) => f.name).join(", ")} added`);
    ripple(at);
    onFiles?.(files);
    const wait = reduced() ? 0 : 1300;
    added.forEach((a) => setTimeout(() => setItems((cur) => cur.map((c) => (c.id === a.id ? { ...c, done: true } : c))), wait));
  }

  const onDragOver = (e: DragEvent<HTMLButtonElement>) => {
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const { x, y } = local(e.clientX, e.clientY);
    const s = sim.current;
    if (!s.over) { s.px = x; s.py = y; }
    s.tx = x; s.ty = y; s.over = true;
    if (!over) setOver(true);
    kick();
  };
  const leave = () => { sim.current.over = false; setOver(false); };
  const onDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    leave();
  };
  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    leave();
    take(Array.from(e.dataTransfer.files), local(e.clientX, e.clientY));
  };
  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    take(Array.from(e.target.files ?? []), lastPress.current);
    e.target.value = "";
  };
  const open = (e: MouseEvent<HTMLButtonElement>) => {
    lastPress.current = e.detail ? local(e.clientX, e.clientY) : null;
    input.current?.click();
  };

  return (
    <div className={`rrc rrc--${theme} ${className}`} data-motion={motion}>
      <button
        ref={zone}
        type="button"
        className="rrc__zone"
        data-over={over || undefined}
        data-error={!!error || undefined}
        aria-describedby={`${uid}-hint ${uid}-err`}
        onClick={open}
        onDragEnter={onDragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {box.w > 0 && (
          <svg className="rrc__rim" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
            <path ref={path} className="rrc__shape" />
          </svg>
        )}
        <span className="rrc__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 15V4.5M7.5 9 12 4.5 16.5 9M4.5 14.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" /></svg>
        </span>
        <span className="rrc__title">{over ? "Let go to add it" : title}</span>
        <span id={`${uid}-hint`} className="rrc__hint">
          or <span className="rrc__link">choose a file</span>{hint ? ` · ${hint}` : ""}
        </span>
      </button>
      <input ref={input} type="file" className="rrc__input" accept={accept} multiple={multiple} tabIndex={-1} aria-hidden="true" onChange={onPick} />

      <p id={`${uid}-err`} className="rrc__error" role="alert">{error}</p>

      {items.length > 0 && (
        <ul className="rrc__files" aria-label="Added files">
          {items.map((f) => (
            <li key={f.id} className="rrc__file" data-done={f.done || undefined}>
              <span className="rrc__kind" aria-hidden="true">{kind(f.name)}</span>
              <span className="rrc__meta">
                <span className="rrc__name">{f.name}</span>
                <span className="rrc__size">{mb(f.size)} · {f.done ? "Uploaded" : "Uploading…"}</span>
                <span className="rrc__bar" aria-hidden="true" />
              </span>
              <button type="button" className="rrc__remove" aria-label={`Remove ${f.name}`} onClick={() => { setItems((cur) => cur.filter((c) => c.id !== f.id)); setSaid(`${f.name} removed`); zone.current?.focus(); }}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <span className="rrc__sr" aria-live="polite">{said}</span>
    </div>
  );
}
