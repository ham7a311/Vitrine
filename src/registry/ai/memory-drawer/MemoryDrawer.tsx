"use client";
import { useEffect, useId, useReducer, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { memories, shown, type Memory } from "./memory";
import "./memory-drawer.css";

export type MemoryDrawerProps = {
  initial: Memory[];
  topics: { id: string; label: string }[];
  /** Who is remembering, e.g. "Your assistant". */
  name?: string;
  onChange?: (items: Memory[], enabled: boolean) => void;
  theme?: "paper" | "night";
  className?: string;
};

const STRIPS = 9;

function Card({ m, paused, onEdit, onPin, onForget }: { m: Memory; paused: boolean; onEdit: (t: string) => void; onPin: () => void; onForget: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.text);
  const [shred, setShred] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (editing) { field.current?.focus(); field.current?.select(); } }, [editing]);

  const save = () => { onEdit(draft); setEditing(false); };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); save(); }
    if (e.key === "Escape") { setDraft(m.text); setEditing(false); }
  };
  const forget = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onForget(); return; }
    setShred(true);
    window.setTimeout(onForget, 650);
  };
  const face = (
    <>
      {m.fresh && <span className="mdraw__fresh"><i aria-hidden="true" />Added from this chat</span>}
      {editing
        ? <textarea ref={field} className="mdraw__edit" value={draft} rows={2} aria-label="Edit memory" onChange={(e) => setDraft(e.target.value)} onKeyDown={key} />
        : <p className="mdraw__text">{m.text}</p>}
      <p className="mdraw__source">{m.source}</p>
    </>
  );
  return (
    <li className={`mdraw__card ${m.pinned ? "is-pinned" : ""} ${shred ? "is-shredding" : ""}`}>
      <div className="mdraw__face">{face}</div>
      {shred && (
        <div className="mdraw__strips" aria-hidden="true">
          {Array.from({ length: STRIPS }, (_, i) => (
            <div key={i} className="mdraw__strip" style={{ clipPath: `inset(0 ${100 - ((i + 1) * 100) / STRIPS}% 0 ${(i * 100) / STRIPS}%)`, ["--i" as string]: i, ["--r" as string]: `${(i % 2 ? 1 : -1) * (4 + (i % 3) * 3)}deg` } as CSSProperties}>{face}</div>
          ))}
        </div>
      )}
      <div className="mdraw__tools">
        {editing ? (
          <>
            <button type="button" className="mdraw__tool mdraw__tool--save" onClick={save}>Save</button>
            <button type="button" className="mdraw__tool" onClick={() => { setDraft(m.text); setEditing(false); }}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="mdraw__icon" aria-pressed={!!m.pinned} aria-label={m.pinned ? "Unpin" : "Pin"} title={m.pinned ? "Unpin" : "Pin"} onClick={onPin} disabled={paused}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.8 2.2 13.8 6.2 11 7.4 8.6 9.8 8.9 13 3 7.1 6.2 7.4 8.6 5z" /><path d="M5.6 10.4 2.4 13.6" /></svg>
            </button>
            <button type="button" className="mdraw__icon" aria-label="Edit" title="Edit" onClick={() => { setDraft(m.text); setEditing(true); }} disabled={paused}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.8 2.7 13.3 5.2 5.6 12.9 2.6 13.4 3.1 10.4z" /></svg>
            </button>
            <button type="button" className="mdraw__icon mdraw__icon--danger" aria-label="Forget" title="Forget" onClick={forget}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" /></svg>
            </button>
          </>
        )}
      </div>
    </li>
  );
}

/**
 * Memory Drawer
 * The things an assistant remembers about you, laid out where you can see and change them: grouped
 * by topic, pinned ones first, new ones marked as added from this chat. Edit a memory in place, pin
 * it, or forget it — it goes through the shredder, with an Undo — and pause memory altogether with
 * one switch.
 */
export function MemoryDrawer({ initial, topics, name = "Your assistant", onChange, theme = "paper", className = "" }: MemoryDrawerProps) {
  const uid = useId();
  const [state, dispatch] = useReducer(memories, { items: initial, enabled: true, gone: null });
  const [topic, setTopic] = useState("all");
  const first = useRef(true);

  useEffect(() => { if (first.current) { first.current = false; return; } onChange?.(state.items, state.enabled); }, [state.items, state.enabled, onChange]);
  const [toastOpen, setToastOpen] = useState(false);
  useEffect(() => {
    if (!state.gone) { setToastOpen(false); return; }
    setToastOpen(true);
    const t = window.setTimeout(() => setToastOpen(false), 6000);
    return () => window.clearTimeout(t);
  }, [state.gone]);

  const list = shown(state.items, topic);
  const count = (id: string) => (id === "all" ? state.items.length : state.items.filter((m) => m.topic === id).length);
  const paused = !state.enabled;

  return (
    <section className={`mdraw mdraw--${theme} ${className}`} aria-labelledby={`${uid}-t`} data-paused={paused ? "" : undefined}>
      <header className="mdraw__head">
        <div>
          <h3 id={`${uid}-t`} className="mdraw__title">Memory</h3>
          <p className="mdraw__sub">{name} remembers {state.items.length} things about you.</p>
        </div>
        <button type="button" role="switch" aria-checked={state.enabled} className="mdraw__switch" onClick={() => dispatch({ type: "toggle" })}>
          <span className="mdraw__knob" aria-hidden="true" />
          <span className="mdraw__switch-label">{state.enabled ? "On" : "Paused"}</span>
        </button>
      </header>
      {paused && <p className="mdraw__banner" role="status">Memory is paused. New chats won&rsquo;t use or add to what&rsquo;s saved here.</p>}
      <div className="mdraw__topics" role="radiogroup" aria-label="Topic">
        {[{ id: "all", label: "All" }, ...topics].map((t) => (
          <button key={t.id} type="button" role="radio" aria-checked={topic === t.id} onClick={() => setTopic(t.id)}>
            {t.label}<span>{count(t.id)}</span>
          </button>
        ))}
      </div>
      <ul className="mdraw__list" aria-label="Memories">
        {list.map((m) => (
          <Card key={m.id} m={m} paused={paused}
            onEdit={(text) => dispatch({ type: "edit", id: m.id, text })} onPin={() => dispatch({ type: "pin", id: m.id })}
            onForget={() => dispatch({ type: "forget", id: m.id })} />
        ))}
        {!list.length && <li className="mdraw__empty">Nothing remembered here yet.</li>}
      </ul>
      <div className="mdraw__toast" data-open={toastOpen && state.gone ? "" : undefined} role="status">
        {state.gone && toastOpen && <><span>Forgotten.</span><button type="button" onClick={() => dispatch({ type: "undo" })}>Undo</button></>}
      </div>
    </section>
  );
}

export default MemoryDrawer;
