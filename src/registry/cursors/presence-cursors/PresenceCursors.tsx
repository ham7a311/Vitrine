"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./presence-cursors.css";

/**
 * Presence Cursors
 * Other people, in the room. Each collaborator's cursor moves the way a hand
 * does — curved paths, a little overshoot, a settle, a faint tremor while it
 * rests — and acts on the board: selecting a note with their colour,
 * dragging it, typing a few words in a bubble at their cursor. Press / to
 * say something at your own cursor; Enter posts it, Escape takes it back.
 *
 * Board elements are addressed by data-pid (or data-home, a fixed spot that
 * never moves, for returning a dragged note); scripts loop forever.
 */

export type Target = { pid: string; fx?: number; fy?: number } | { x: number; y: number };
export type Step = {
  to: Target;
  /** How long to rest after arriving, ms. */
  dwell: number;
  /** What to do on arrival. */
  act?: "select" | "deselect" | "grab" | "drop" | "chat";
  text?: string;
};
export type Person = { id: string; name: string; color: string; script: Step[]; offset?: number };

type Props = {
  people: Person[];
  /** Your own name and colour, for cursor chat. */
  me?: { name: string; color: string };
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type Posted = { id: number; text: string; x: number; y: number; out?: boolean };
type Status = Record<string, string>;

const ARROW = "M2.5 2 L2.5 17.5 L7 13.2 L10.1 20 L13 18.7 L10 12 L16.2 12 Z";

export function PresenceCursors({ people, me = { name: "You", color: "#d6409f" }, theme = "paper", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cursorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bubbleRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const ptr = useRef({ x: 0, y: 0, in: false });
  const [status, setStatus] = useState<Status>(() => Object.fromEntries(people.map((p) => [p.id, "Viewing"])));
  const [chat, setChat] = useState<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState<Posted[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    const scaleOf = () => {
      const r = host.getBoundingClientRect();
      return { r, s: r.width / host.offsetWidth || 1 };
    };
    const offsets = new Map<string, { x: number; y: number }>();
    const elOf = (pid: string) => host.querySelector<HTMLElement>(`[data-pid="${pid}"], [data-home="${pid}"]`);
    const applyOffset = (pid: string) => {
      const el = elOf(pid), o = offsets.get(pid);
      if (el && o) el.style.translate = `${o.x.toFixed(1)}px ${o.y.toFixed(1)}px`;
    };
    const resolve = (t: Target, seed: number) => {
      if ("pid" in t) {
        const el = elOf(t.pid);
        if (el) {
          const { r, s } = scaleOf();
          const b = el.getBoundingClientRect();
          // Aim somewhere inside the element, not dead centre — people point at words.
          const fx = t.fx ?? 0.35 + 0.3 * frac(seed * 12.9898);
          const fy = t.fy ?? 0.35 + 0.3 * frac(seed * 78.233);
          return { x: (b.left - r.left) / s + b.width * fx, y: (b.top - r.top) / s + b.height * fy };
        }
        return { x: host.offsetWidth / 2, y: host.offsetHeight / 2 };
      }
      return { x: t.x * host.offsetWidth, y: t.y * host.offsetHeight };
    };
    const frac = (v: number) => {
      const x = Math.sin(v) * 43758.5453;
      return x - Math.floor(x);
    };

    type State = {
      p: Person;
      i: number;
      phase: "move" | "dwell";
      t0: number;
      dur: number;
      a: { x: number; y: number };
      b: { x: number; y: number };
      c1: { x: number; y: number };
      c2: { x: number; y: number };
      pos: { x: number; y: number; vx: number; vy: number };
      sel: string | null;
      hold: string | null;
      chat: { text: string; t: number } | null;
      seed: number;
    };
    const now0 = performance.now();
    const states: State[] = people.map((p, k) => {
      const start = resolve(p.script[0].to, k + 1);
      return {
        p, i: 0, phase: "dwell", t0: now0 - (p.offset ?? 0), dur: 0,
        a: start, b: start, c1: start, c2: start,
        pos: { x: start.x, y: start.y, vx: 0, vy: 0 },
        sel: null, hold: null, chat: null, seed: k * 7.13 + 1,
      };
    });

    const say = (id: string, s: string) => setStatus((st) => (st[id] === s ? st : { ...st, [id]: s }));

    const select = (st: State, pid: string | null) => {
      if (st.sel) {
        const old = elOf(st.sel);
        if (old && old.dataset.by === st.p.id) { delete old.dataset.by; old.style.removeProperty("--by"); old.removeAttribute("data-by-name"); }
      }
      st.sel = pid;
      if (pid) {
        const el = elOf(pid);
        if (el) { el.dataset.by = st.p.id; el.style.setProperty("--by", st.p.color); el.setAttribute("data-by-name", st.p.name); }
      }
    };

    const arrive = (st: State, step: Step, now: number) => {
      const pid = "pid" in step.to ? step.to.pid : null;
      switch (step.act) {
        case "select": if (pid) select(st, pid); say(st.p.id, "Editing"); break;
        case "deselect": select(st, null); say(st.p.id, "Viewing"); break;
        case "grab": if (pid) { select(st, pid); st.hold = pid; say(st.p.id, "Moving a note"); } break;
        case "drop": st.hold = null; say(st.p.id, "Editing"); break;
        case "chat": st.chat = { text: step.text ?? "", t: now }; say(st.p.id, "Typing"); break;
      }
    };

    const startMove = (st: State, now: number) => {
      st.i = (st.i + 1) % st.p.script.length;
      const step = st.p.script[st.i];
      st.seed += 1.618;
      st.a = { x: st.b.x, y: st.b.y };
      st.b = resolve(step.to, st.seed);
      const dx = st.b.x - st.a.x, dy = st.b.y - st.a.y, d = Math.hypot(dx, dy);
      // Hands move in arcs: bow the path to one side by up to a fifth of its length.
      const bow = (frac(st.seed * 3.7) - 0.5) * 0.4 * d;
      const nx = -dy / (d || 1), ny = dx / (d || 1);
      st.c1 = { x: st.a.x + dx * 0.3 + nx * bow, y: st.a.y + dy * 0.3 + ny * bow };
      st.c2 = { x: st.a.x + dx * 0.72 + nx * bow * 0.5, y: st.a.y + dy * 0.72 + ny * bow * 0.5 };
      // Fitts-ish: longer reaches take longer, but not proportionally.
      st.dur = 260 + 170 * Math.log2(1 + d / 30);
      st.phase = "move";
      st.t0 = now;
    };

    const bez = (st: State, u: number) => {
      const m = 1 - u;
      return {
        x: m * m * m * st.a.x + 3 * m * m * u * st.c1.x + 3 * m * u * u * st.c2.x + u * u * u * st.b.x,
        y: m * m * m * st.a.y + 3 * m * m * u * st.c1.y + 3 * m * u * u * st.c2.y + u * u * u * st.b.y,
      };
    };
    const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

    let raf = 0, last = 0, visible = true;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      for (const st of states) {
        const step = st.p.script[st.i];
        let target: { x: number; y: number };
        if (st.phase === "move") {
          const u = Math.min(1, (now - st.t0) / st.dur);
          target = still() ? st.b : bez(st, ease(u));
          if (u >= 1) {
            st.phase = "dwell";
            st.t0 = now;
            arrive(st, step, now);
          }
        } else {
          // A resting hand is never perfectly still.
          const t = now / 1000 + st.seed;
          target = still() ? st.b : { x: st.b.x + Math.sin(t * 1.7) * 0.7 + Math.sin(t * 4.1) * 0.3, y: st.b.y + Math.cos(t * 1.3) * 0.6 };
          if (now - st.t0 > step.dwell) startMove(st, now);
        }
        const px = st.pos.x, py = st.pos.y;
        if (still()) {
          st.pos.x = target.x; st.pos.y = target.y;
        } else {
          // A spring after the path gives the small overshoot and settle of a real hand.
          const k = 210, c = 2 * 0.7 * Math.sqrt(k);
          st.pos.vx += ((target.x - st.pos.x) * k - st.pos.vx * c) * dt;
          st.pos.vy += ((target.y - st.pos.y) * k - st.pos.vy * c) * dt;
          st.pos.x += st.pos.vx * dt;
          st.pos.y += st.pos.vy * dt;
        }
        if (st.hold) {
          const o = offsets.get(st.hold) ?? { x: 0, y: 0 };
          o.x += st.pos.x - px;
          o.y += st.pos.y - py;
          offsets.set(st.hold, o);
          applyOffset(st.hold);
        }
        const el = cursorRefs.current[st.p.id];
        if (el) el.style.transform = `translate3d(${st.pos.x.toFixed(1)}px, ${st.pos.y.toFixed(1)}px, 0)`;
        // Cursor chat: typed a letter at a time, held, then let go.
        const bubble = bubbleRefs.current[st.p.id];
        if (bubble) {
          if (st.chat) {
            const age = now - st.chat.t;
            const n = still() ? st.chat.text.length : Math.min(st.chat.text.length, Math.floor(age / 55));
            const shown = st.chat.text.slice(0, n);
            if (bubble.textContent !== shown) bubble.textContent = shown;
            bubble.parentElement!.toggleAttribute("data-on", age < st.chat.text.length * 55 + 2600);
            if (n === st.chat.text.length && age > st.chat.text.length * 55 + 300) say(st.p.id, "Viewing");
            if (age > st.chat.text.length * 55 + 3200) st.chat = null;
          } else bubble.parentElement!.removeAttribute("data-on");
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    document.addEventListener("visibilitychange", wake);

    const onMove = (e: PointerEvent) => {
      const { r, s } = scaleOf();
      ptr.current = { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s, in: true };
    };
    const onLeave = () => { ptr.current.in = false; };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      for (const st of states) select(st, null);
      for (const pid of offsets.keys()) { const el = elOf(pid); if (el) el.style.translate = ""; }
    };
  }, [people, motion]);

  // "/" opens cursor chat where your pointer is (or the middle, from the keyboard).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || chat) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable='true']")) return;
      if (!ptr.current.in && !host.contains(document.activeElement)) return;
      // Captured first and stopped, so a page-level "/" shortcut (search, say) doesn't also fire.
      e.preventDefault();
      e.stopImmediatePropagation();
      openChat();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  });

  const openChat = () => {
    const host = hostRef.current;
    if (!host) return;
    const p = ptr.current;
    const x = p.in ? p.x : host.offsetWidth / 2, y = p.in ? p.y : host.offsetHeight / 2;
    setChat({ x: Math.min(x, host.offsetWidth - 240), y: Math.min(y, host.offsetHeight - 60) });
    setDraft("");
  };
  const post = () => {
    const text = draft.trim();
    if (text && chat) {
      const id = nextId.current++;
      setPosted((ps) => [...ps, { id, text, x: chat.x, y: chat.y }]);
      window.setTimeout(() => setPosted((ps) => ps.map((q) => (q.id === id ? { ...q, out: true } : q))), 3600);
      window.setTimeout(() => setPosted((ps) => ps.filter((q) => q.id !== id)), 4000);
    }
    setChat(null);
  };

  return (
    <div ref={hostRef} className={`presence-cursors presence-cursors--${theme} ${className}`} data-motion={motion} style={{ ...style, ["--presence-cursors-me" as string]: me.color }}>
      {children}

      <div className="presence-cursors__layer" aria-hidden="true">
        {people.map((p) => (
          <div key={p.id} ref={(el) => { cursorRefs.current[p.id] = el; }} className="presence-cursors__cursor" style={{ ["--c" as string]: p.color }}>
            <svg viewBox="0 0 20 22" width="20" height="22">
              <path d={ARROW} />
            </svg>
            <span className="presence-cursors__name">{p.name}</span>
            <span className="presence-cursors__chat">
              <span ref={(el) => { bubbleRefs.current[p.id] = el; }} />
            </span>
          </div>
        ))}
        {posted.map((q) => (
          <div key={q.id} className="presence-cursors__mine" data-out={q.out || undefined} style={{ transform: `translate3d(${q.x}px, ${q.y}px, 0)` }}>
            {q.text}
          </div>
        ))}
      </div>

      {chat && (
        <div className="presence-cursors__compose" style={{ transform: `translate3d(${chat.x}px, ${chat.y}px, 0)` }}>
          <label htmlFor="presence-cursors-chat" className="presence-cursors__sr">
            Say something to everyone on the board
          </label>
          <input
            id="presence-cursors-chat"
            autoFocus
            value={draft}
            maxLength={80}
            placeholder="Say something…"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setChat(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") post();
              if (e.key === "Escape") { e.stopPropagation(); setChat(null); }
            }}
          />
        </div>
      )}

      <div className="presence-cursors__people">
        <ul className="presence-cursors__stack" aria-label={`${people.length + 1} people on this board`}>
          {people.map((p) => (
            <li key={p.id} style={{ ["--c" as string]: p.color }} title={`${p.name} · ${status[p.id]}`}>
              <span aria-hidden="true">{p.name[0]}</span>
              <span className="presence-cursors__sr">
                {p.name}, {status[p.id]?.toLowerCase()}
              </span>
            </li>
          ))}
          <li className="presence-cursors__me" style={{ ["--c" as string]: me.color }} title={me.name}>
            <span aria-hidden="true">{me.name.length <= 3 ? me.name : me.name[0]}</span>
            <span className="presence-cursors__sr">{me.name}</span>
          </li>
        </ul>
        <button type="button" className="presence-cursors__say" onClick={openChat} aria-keyshortcuts="/">
          Say something <kbd>/</kbd>
        </button>
      </div>
    </div>
  );
}
