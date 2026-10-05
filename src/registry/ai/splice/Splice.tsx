"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { sentences, wordCount } from "./segment";
import "./splice.css";

export type SpliceDraft = { id: string; label: string; text: string };
export type SplicePick = { draft: string; sentence: string; text: string };
export type SpliceProps = {
  drafts: SpliceDraft[];
  onUse?: (result: { text: string; picks: SplicePick[] }) => void;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Splice
 * Several drafts side by side, cut into sentences. Pick the best sentence from
 * any of them and it joins the final text on the right, still coloured by the
 * draft it came from, ready to reorder.
 */
export function Splice({ drafts, onUse, theme = "light", motion = true, className = "" }: SpliceProps) {
  const id = useId();
  const split = useMemo(() => drafts.map((d) => ({ ...d, sentences: sentences(d.text, `${d.id}-`) })), [drafts]);
  const [picks, setPicks] = useState<SplicePick[]>([]);
  const [tab, setTab] = useState(0);
  const [cursor, setCursor] = useState<number[]>(() => drafts.map(() => 0));
  const [message, setMessage] = useState("");
  const [used, setUsed] = useState(false);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const rows = useRef(new Map<string, HTMLLIElement>());
  const from = useRef<{ key: string; rect: DOMRect } | null>(null);
  const rects = useRef(new Map<string, DOMRect>());
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);

  const key = (p: { draft: string; sentence: string }) => `${p.draft}:${p.sentence}`;
  const index = useMemo(() => new Map(picks.map((p, i) => [key(p), i])), [picks]);
  const colour = (draftId: string) => `var(--splc-c${(drafts.findIndex((d) => d.id === draftId) % 4) + 1})`;
  const letter = (draftId: string) => String.fromCharCode(65 + drafts.findIndex((d) => d.id === draftId));

  // A picked sentence flies from its draft into the final text; reordering slides rows.
  const capture = () => { rects.current = new Map([...rows.current].map(([k, el]) => [k, el.getBoundingClientRect()])); };
  useLayoutEffect(() => {
    if (reduced.current) { from.current = null; rects.current = new Map(); return; }
    for (const [k, el] of rows.current) {
      const now = el.getBoundingClientRect();
      const was = from.current?.key === k ? from.current.rect : rects.current.get(k);
      if (!was) continue;
      const dx = was.left - now.left, dy = was.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)`, opacity: from.current?.key === k ? 0.6 : 1 }, { transform: "none", opacity: 1 }], { duration: from.current?.key === k ? 380 : 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    from.current = null;
    rects.current = new Map();
  }, [picks]);

  const toggle = (draftId: string, s: { id: string; text: string }) => {
    const k = key({ draft: draftId, sentence: s.id });
    capture();
    setUsed(false);
    if (index.has(k)) {
      setPicks((ps) => ps.filter((p) => key(p) !== k));
      setMessage(`Removed from the final text.`);
    } else {
      const el = buttons.current.get(k);
      if (el) from.current = { key: k, rect: el.getBoundingClientRect() };
      setPicks((ps) => [...ps, { draft: draftId, sentence: s.id, text: s.text }]);
      setMessage(`Added from draft ${letter(draftId)}, sentence ${picks.length + 1} of the final text.`);
    }
  };
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= picks.length) return;
    capture();
    const next = [...picks];
    [next[i], next[j]] = [next[j], next[i]];
    setPicks(next);
    setUsed(false);
    setMessage(`Moved to position ${j + 1}.`);
    requestAnimationFrame(() => rows.current.get(key(next[j]))?.focus());
  };

  const onColumnKey = (e: KeyboardEvent<HTMLUListElement>, col: number) => {
    const list = split[col].sentences;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = Math.max(0, Math.min(list.length - 1, cursor[col] + (e.key === "ArrowDown" ? 1 : -1)));
    setCursor((c) => c.map((v, i) => (i === col ? n : v)));
    buttons.current.get(key({ draft: split[col].id, sentence: list[n].id }))?.focus();
  };
  const onRootKey = (e: KeyboardEvent<HTMLElement>) => {
    const n = Number(e.key);
    if (!e.altKey && !e.metaKey && !e.ctrlKey && n >= 1 && n <= drafts.length && !(e.target as Element).closest("textarea, input")) {
      e.preventDefault();
      setTab(n - 1);
      requestAnimationFrame(() => buttons.current.get(key({ draft: split[n - 1].id, sentence: split[n - 1].sentences[cursor[n - 1]]?.id ?? "" }))?.focus());
    }
  };

  const text = picks.map((p) => p.text).join(" ");
  const counts = drafts.map((d) => picks.filter((p) => p.draft === d.id).length);

  return (
    <section className={`splc splc--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-label="Splice drafts" onKeyDown={onRootKey}>
      <div className="splc__tabs" role="tablist" aria-label="Drafts">
        {split.map((d, i) => (
          <button key={d.id} type="button" role="tab" aria-selected={tab === i} aria-controls={`${id}-d${i}`} onClick={() => setTab(i)} style={{ "--c": colour(d.id) } as CSSProperties}>
            <span className="splc__letter">{letter(d.id)}</span>{d.label}
          </button>
        ))}
      </div>
      <div className="splc__body">
        <div className="splc__drafts" style={{ "--n": drafts.length } as CSSProperties}>
          {split.map((d, col) => (
            <div key={d.id} id={`${id}-d${col}`} className="splc__draft" data-tab={tab === col || undefined} style={{ "--c": colour(d.id) } as CSSProperties} role="region" aria-labelledby={`${id}-dl${col}`}>
              <h4 id={`${id}-dl${col}`} className="splc__draft-head"><span className="splc__letter">{letter(d.id)}</span>{d.label}<kbd aria-hidden="true">{col + 1}</kbd></h4>
              <ul className="splc__sentences" onKeyDown={(e) => onColumnKey(e, col)}>
                {d.sentences.map((s, i) => {
                  const k = key({ draft: d.id, sentence: s.id });
                  const at = index.get(k);
                  return (
                    <li key={s.id}>
                      <button
                        ref={(el) => { if (el) buttons.current.set(k, el); else buttons.current.delete(k); }}
                        type="button"
                        className="splc__sentence"
                        aria-pressed={at !== undefined}
                        tabIndex={i === cursor[col] ? 0 : -1}
                        onFocus={() => setCursor((c) => c.map((v, j) => (j === col ? i : v)))}
                        onClick={() => toggle(d.id, s)}
                      >
                        {at !== undefined && <span className="splc__badge" aria-hidden="true">{at + 1}</span>}
                        {s.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="splc__final" aria-labelledby={`${id}-f`}>
          <h4 id={`${id}-f`} className="splc__final-head">Final <span>{wordCount(text)} words</span></h4>
          {picks.length === 0 ? (
            <p className="splc__empty">Choose sentences from any draft. They'll gather here in the order you pick them.</p>
          ) : (
            <ol className="splc__picks">
              {picks.map((p, i) => (
                <li
                  key={key(p)}
                  ref={(el) => { if (el) rows.current.set(key(p), el); else rows.current.delete(key(p)); }}
                  className="splc__pick"
                  tabIndex={0}
                  style={{ "--c": colour(p.draft) } as CSSProperties}
                  aria-label={`${i + 1}. From draft ${letter(p.draft)}: ${p.text}`}
                  onKeyDown={(e) => {
                    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); move(i, e.key === "ArrowUp" ? -1 : 1); }
                    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); toggle(p.draft, { id: p.sentence, text: p.text }); }
                  }}
                >
                  <span className="splc__pick-text" aria-hidden="true">{p.text}</span>
                  <span className="splc__pick-tools">
                    <button type="button" tabIndex={-1} aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                    <button type="button" tabIndex={-1} aria-label="Move down" disabled={i === picks.length - 1} onClick={() => move(i, 1)}>↓</button>
                    <button type="button" tabIndex={-1} aria-label="Remove" onClick={() => toggle(p.draft, { id: p.sentence, text: p.text })}>×</button>
                  </span>
                </li>
              ))}
            </ol>
          )}
          <footer className="splc__foot">
            <p className="splc__from">{drafts.map((d, i) => <span key={d.id} style={{ "--c": colour(d.id) } as CSSProperties}><span className="splc__letter">{letter(d.id)}</span>{counts[i]}</span>)}</p>
            <button type="button" className="splc__use" disabled={!picks.length} onClick={() => { onUse?.({ text, picks }); setUsed(true); setMessage("Final text used."); }}>{used ? "Used ✓" : "Use this text"}</button>
          </footer>
        </div>
      </div>
      <p className="splc__keys" aria-hidden="true"><kbd>1</kbd>–<kbd>{drafts.length}</kbd> jump to a draft · <kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> pick · <kbd>Alt</kbd>+<kbd>↑</kbd><kbd>↓</kbd> reorder</p>
      <p className="splc__sr" aria-live="polite">{message}</p>
    </section>
  );
}
