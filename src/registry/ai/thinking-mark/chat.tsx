"use client";
import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode } from "react";
import { MARKS, type Brand, type Phase } from "./marks";
import "./chat.css";

/*
 * A small working chat to show the indicator in place: pick a model, a reasoning level and file access, send a
 * message, and the reply starts with the indicator moving through thinking, planning, writing code and done.
 * The replies are simulated; connect your own model before using it for real.
 */

export type MarkProps = { brand?: Brand; phase?: Phase; size?: "inline" | "hero"; labels?: Partial<Record<Phase, string>> };

type Model = { id: string; name: string; brand: Brand };
const MODELS: Model[] = [
  { id: "opus", name: "Claude Opus 5.5", brand: "claude" },
  { id: "sonnet", name: "Claude Sonnet 5.5", brand: "claude" },
  { id: "luna", name: "GPT-6 Luna", brand: "chatgpt" },
  { id: "astra", name: "GPT-6 Astra", brand: "chatgpt" },
  { id: "grok", name: "Grok 4.7", brand: "grok" },
];
type Effort = "low" | "medium" | "high";
type Access = "read" | "ask" | "full";
const EFFORTS: { id: Effort; name: string }[] = [{ id: "low", name: "Low" }, { id: "medium", name: "Medium" }, { id: "high", name: "High" }];
const ACCESS: { id: Access; name: string }[] = [{ id: "read", name: "Read only" }, { id: "ask", name: "Ask first" }, { id: "full", name: "Full access" }];
/** Seconds spent thinking at each reasoning level, then planning and writing code. */
const THINK: Record<Effort, number> = { low: 1.6, medium: 3, high: 4.8 };
const PLAN = 2.4, CODE = 3.6;
const SEND: Record<Brand, { bg: string; ink: string }> = { claude: { bg: "#D97757", ink: "#1a0f0a" }, chatgpt: { bg: "#2F6FED", ink: "#ffffff" }, grok: { bg: "#ECECEC", ink: "#111111" } };
const FIRST = "Move the session check into a hook and update the pages that use it.";

type Turn = { id: number; role: "user" | "assistant"; text: string; brand: Brand; phase: Phase; secs?: number; stopped?: boolean };

function reply(text: string, access: Access) {
  if (access === "read") return /\?\s*$/.test(text)
    ? "I looked through the relevant files without changing anything and found the likely cause. Switch to Full access and I'll fix it."
    : "I can only read files with this access, so here's the plan instead: find every place it's used, make the change once, then update each caller. Switch to Full access and I'll make the edit.";
  if (access === "ask") return "I've prepared the change across 3 files. Approve it to apply, or tell me what to adjust first.";
  return "Done. I changed 3 files, kept the old behaviour behind the same names, and the tests pass.";
}

function Logo({ brand, size = 16 }: { brand: Brand; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>;
}

/** A compact menu button: opens upwards, arrow keys move, Enter or Space picks, Escape closes. */
/** compact: on narrow screens show only the icon (the name stays in the button's label). end: open aligned to the right. */
function Picker<T extends string>({ label, value, options, onPick, icon, compact, end }: { label: string; value: T; options: { id: T; name: string; icon?: ReactNode }[]; onPick: (v: T) => void; icon?: ReactNode; compact?: boolean; end?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value)!;
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    list.current?.querySelectorAll<HTMLElement>("[role=menuitemradio]")[hot]?.focus();
    return () => document.removeEventListener("pointerdown", away);
  }, [open, hot]);
  const show = () => { setHot(Math.max(0, options.findIndex((o) => o.id === value))); setOpen(true); };
  const choose = (v: T) => { onPick(v); setOpen(false); btn.current?.focus(); };
  const keys = (e: KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); btn.current?.focus(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setHot((h) => (h + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); setHot(e.key === "Home" ? 0 : options.length - 1); }
    else if (e.key === "Tab") setOpen(false);
  };
  return (
    <div className="tmk-pick" ref={box}>
      <button ref={btn} type="button" className={`tmk-pick__btn ${compact ? "tmk-pick__btn--compact" : ""}`} aria-haspopup="menu" aria-expanded={open} aria-label={`${label}: ${current.name}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(e) => { if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); show(); } }}>
        {current.icon ?? icon}
        <span>{current.name}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div ref={list} className={`tmk-pick__menu ${end ? "tmk-pick__menu--end" : ""}`} role="menu" aria-label={label} onKeyDown={keys}>
          {options.map((o, i) => (
            <button key={o.id} type="button" role="menuitemradio" aria-checked={o.id === value} tabIndex={i === hot ? 0 : -1}
              className="tmk-pick__item" onClick={() => choose(o.id)} onPointerMove={() => setHot(i)}>
              {o.icon}<span>{o.name}</span>
              {o.id === value && <svg className="tmk-pick__tick" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 7.2 2.6 2.6L11 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const Lock = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d={open ? "M5.5 7V5a2.5 2.5 0 0 1 4.9-.7" : "M5.5 7V5a2.5 2.5 0 0 1 5 0v2"} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
);

/**
 * The chat. Mark is the working indicator under test; hero shows it large above the thread as well, following the
 * latest reply and resting on "Ready" between turns.
 */
export function Chat({ Mark, hero = true }: { Mark: ComponentType<MarkProps>; hero?: boolean }) {
  const [model, setModel] = useState("opus");
  const [effort, setEffort] = useState<Effort>("medium");
  const [access, setAccess] = useState<Access>("full");
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);
  const thread = useRef<HTMLDivElement>(null);
  const brand = MODELS.find((m) => m.id === model)!.brand;
  const live = turns.findLast((t) => t.role === "assistant");
  const busy = !!live && live.phase !== "done";

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const update = (id: number, patch: Partial<Turn>) => setTurns((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const id = nextId.current += 2, started = performance.now();
    setTurns((ts) => [...ts, { id: id - 1, role: "user", text, brand, phase: "done" }, { id, role: "assistant", text: reply(text, access), brand, phase: "thinking" }]);
    setDraft("");
    // Thinking for as long as the reasoning level asks, then planning, then code unless access is read only.
    const steps: [Phase, number][] = [["planning", THINK[effort]], ...(access === "read" ? [] : [["coding", PLAN] as [Phase, number]])];
    let at = 0;
    for (const [p, secs] of steps) { at += secs; timers.current.push(window.setTimeout(() => update(id, { phase: p }), at * 1000)); }
    at += access === "read" ? PLAN : CODE;
    timers.current.push(window.setTimeout(() => update(id, { phase: "done", secs: Math.round((performance.now() - started) / 1000) }), at * 1000));
  };
  const stop = () => {
    if (!live || !busy) return;
    clear();
    update(live.id, { phase: "done", stopped: true, text: "Stopped. Nothing was changed." });
  };

  // Start the first turn by itself, so the indicator is working when the page opens.
  useEffect(() => { const t = window.setTimeout(() => send(FIRST), 500); return () => { clearTimeout(t); clear(); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: "smooth" }); }, [turns]);

  const S = SEND[brand];
  return (
    <div className="tmk-chat">
      {hero && (
        <div className="tmk-chat__hero">
          <Mark brand={busy && live ? live.brand : brand} phase={busy && live ? live.phase : "done"} size="hero" labels={{ done: "Ready" }} />
        </div>
      )}
      <div className="tmk-chat__thread" ref={thread}>
        {turns.map((t) =>
          t.role === "user" ? (
            <p key={t.id} className="tmk-chat__user">{t.text}</p>
          ) : (
            <div key={t.id} className="tmk-chat__reply">
              <Mark brand={t.brand} phase={t.phase} labels={{ done: t.stopped ? "Stopped" : `Worked for ${t.secs ?? 0}s` }} />
              {t.phase === "done" && <p className="tmk-chat__answer">{t.text}</p>}
            </div>
          ),
        )}
      </div>
      <form className="tmk-chat__composer" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
        <textarea className="tmk-chat__input" value={draft} rows={2} placeholder="Ask for changes, send follow-ups…" aria-label="Message"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); } }} />
        <div className="tmk-chat__bar">
          <Picker label="Model" compact value={model} onPick={setModel} options={MODELS.map((m) => ({ id: m.id, name: m.name, icon: <Logo brand={m.brand} /> }))} />
          <span className="tmk-chat__sep" aria-hidden="true" />
          <Picker label="Reasoning" value={effort} onPick={setEffort} options={EFFORTS} />
          <span className="tmk-chat__sep" aria-hidden="true" />
          <Picker label="Access" compact end value={access} onPick={setAccess} options={ACCESS.map((a) => ({ ...a, icon: <Lock open={a.id === "full"} /> }))} />
          {busy ? (
            <button type="button" className="tmk-chat__send" style={{ background: S.bg, color: S.ink }} onClick={stop} aria-label="Stop">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" /></svg>
            </button>
          ) : (
            <button type="submit" className="tmk-chat__send" style={{ background: S.bg, color: S.ink }} disabled={!draft.trim()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.8 7.7 8 3.5l4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
