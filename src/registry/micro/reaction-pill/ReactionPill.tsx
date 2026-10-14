"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { magnify, shortCount, summary, tally, type Counts } from "./reactions";
import "./reaction-pill.css";

export type Reaction = { id: string; label: string; color: string; icon: ReactNode };

const P = (d: string) => d.split("|").map((p) => <path key={p} d={p} />);
const svg = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{P(d)}</svg>;

export const DEFAULT_REACTIONS: Reaction[] = [
  { id: "like", label: "Like", color: "#2f7cf0", icon: svg("M7 10v11|M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17.5 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3a2 2 0 0 0 1.8-1.1L12 2a3 3 0 0 1 3 3.9Z") },
  { id: "cheer", label: "Cheer", color: "#5aa83d", icon: svg("M5.8 11.3 2 22l10.7-3.8|M4 3h.01|M22 8h.01|M15 2h.01|M22 20h.01|M22 2l-2.2.7a3 3 0 0 0-2 3.4c.1.9-.6 1.7-1.5 1.7h-.4c-.9 0-1.6.6-1.7 1.4L14 11|M22 13l-.8-.3a3 3 0 0 0-3.4 1.6c-.4.8-1.4 1.2-2.2.8l-.9-.4|M11 2l.3.8a3 3 0 0 1-1.5 3.6c-.8.4-1.2 1.4-.8 2.2l.4.9|M8.8 9.2c1.9 1.9 2.8 4.3 2 5.2-.8.8-3.2-.1-5.1-2s-2.8-4.3-2-5.1c.8-.9 3.2 0 5.1 1.9Z") },
  { id: "support", label: "Support", color: "#8f72e0", icon: svg("M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16|M7 20l1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.9l-4.2 3.9|M2 15l6 6|M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.7 2.7 0 0 0 16 4a2.7 2.7 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z") },
  { id: "love", label: "Love", color: "#e3463a", icon: svg("M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z") },
  { id: "insight", label: "Insight", color: "#eda32b", icon: svg("M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5|M9 18h6|M10 22h4") },
  { id: "laugh", label: "Laugh", color: "#30b2c6", icon: svg("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z|M8 13s1.5 3 4 3 4-3 4-3|M8 13h8|M9 9h.01|M15 9h.01") },
];

export type ReactionPillProps = {
  reactions?: Reaction[];
  counts: Counts;
  /** The viewer's current reaction, as the server last reported it. */
  value?: string | null;
  /** Persist a change; reject to put it back. */
  onChange?: (next: string | null) => Promise<void> | void;
  theme?: "night" | "paper";
  className?: string;
};

export function ReactionPill({ reactions = DEFAULT_REACTIONS, counts: initial, value = null, onChange, theme = "night", className = "" }: ReactionPillProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<string | null>(value);
  const [counts, setCounts] = useState<Counts>(initial);
  const [pointer, setPointer] = useState<number | null>(null);
  const [pop, setPop] = useState(0);
  const [msg, setMsg] = useState("");
  const timers = useRef<{ open?: number; close?: number; press?: number }>({});
  const centres = useRef<number[]>([]);
  const fine = useRef(true);
  useEffect(() => { fine.current = matchMedia("(hover: hover) and (pointer: fine)").matches; }, []);

  const byId = (k: string | null) => reactions.find((r) => r.id === k) ?? null;
  const current = byId(mine);

  const choose = async (next: string | null) => {
    const before = mine, prev = counts;
    setMine(next); setCounts(tally(counts, before, next)); setOpen(false); setPop((p) => p + 1);
    setMsg(next ? `Reacted ${byId(next)?.label}` : "Reaction removed");
    try { await onChange?.(next); }
    catch { setMine(before); setCounts(prev); setMsg("Couldn't save your reaction. Put back as it was."); }
  };

  const openSoon = () => { clearTimeout(timers.current.close); timers.current.open = window.setTimeout(() => setOpen(true), 380); };
  const closeSoon = () => { clearTimeout(timers.current.open); timers.current.close = window.setTimeout(() => { setOpen(false); setPointer(null); }, 260); };
  useEffect(() => () => { const t = timers.current; clearTimeout(t.open); clearTimeout(t.close); clearTimeout(t.press); }, []);

  // measure disc centres once open, for magnification
  useEffect(() => {
    if (!open) return;
    // layout positions, unaffected by the opening scale
    centres.current = items.current.map((b) => (b ? b.offsetLeft + b.offsetWidth / 2 : 0));
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);

  const onMenuKey = (e: React.KeyboardEvent, i: number) => {
    const n = reactions.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to >= 0) { e.preventDefault(); items.current[to]?.focus(); }
    if (e.key === "Tab") setOpen(false);
  };

  const sum = summary(counts);
  return (
    <div ref={root} className={`rpill rpill--${theme} ${className}`} onPointerLeave={(e) => { if (e.pointerType === "mouse") closeSoon(); }}>
      <div
        id={`${id}-menu`}
        role="menu"
        aria-label="Reactions"
        className={`rpill__pill ${open ? "rpill__pill--open" : ""}`}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPointer((e.clientX - r.left) * (e.currentTarget.offsetWidth / Math.max(1, r.width))); }}
        onPointerLeave={() => setPointer(null)}
        onPointerEnter={() => clearTimeout(timers.current.close)}
      >
        {reactions.map((r, i) => {
          const s = open ? magnify(centres.current[i] ?? 0, pointer) : 1;
          return (
            <button
              key={r.id}
              ref={(n) => { items.current[i] = n; }}
              type="button"
              role="menuitemradio"
              aria-checked={mine === r.id}
              tabIndex={open ? 0 : -1}
              className="rpill__disc"
              style={{ ["--rpill-c" as string]: r.color, ["--rpill-s" as string]: s, ["--rpill-i" as string]: i } as CSSProperties}
              onClick={() => choose(mine === r.id ? null : r.id)}
              onKeyDown={(e) => onMenuKey(e, i)}
            >
              <span className="rpill__face" aria-hidden="true">{r.icon}</span>
              <span className="rpill__tip">{r.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rpill__row">
        <button
          ref={trigger}
          type="button"
          className={`rpill__trigger ${current ? "rpill__trigger--on" : ""}`}
          style={{ ["--rpill-c" as string]: current?.color ?? "currentColor" } as CSSProperties}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          aria-keyshortcuts="ArrowUp"
          aria-label={current ? `${current.label}. Press to remove, or arrow up for more reactions` : "Like. Press and hold, or arrow up, for more reactions"}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") openSoon(); }}
          onPointerDown={(e) => { if (e.pointerType !== "mouse") timers.current.press = window.setTimeout(() => { timers.current.press = -1; setOpen(true); }, 420); }}
          onPointerUp={() => clearTimeout(timers.current.press)}
          onClick={() => {
            if (timers.current.press === -1) { timers.current.press = undefined; return; }
            clearTimeout(timers.current.open);
            choose(mine ? null : reactions[0].id);
          }}
          onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); requestAnimationFrame(() => items.current[Math.max(0, reactions.findIndex((r) => r.id === mine))]?.focus()); } }}
          onContextMenu={(e) => { if (!fine.current) e.preventDefault(); }}
        >
          <span key={pop} className="rpill__glyph" aria-hidden="true">{current ? current.icon : reactions[0].icon}</span>
        </button>
        <span className="rpill__sum" aria-hidden="true">
          <span className="rpill__stack">{sum.top.map((k) => { const r = byId(k)!; return <span key={k} style={{ ["--rpill-c" as string]: r.color } as CSSProperties}>{r.icon}</span>; })}</span>
          <span className="rpill__total">{shortCount(sum.total)}</span>
        </span>
      </div>
      <p className="rpill__sr" role="status">{msg}</p>
    </div>
  );
}

export default ReactionPill;
