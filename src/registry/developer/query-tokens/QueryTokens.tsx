"use client";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { phrase, render, tokenize, type KeyDef, type Token } from "./query";
import "./query-tokens.css";

export type { KeyDef, Token } from "./query";
export { test as matchesQuery, tokenize } from "./query";

export type QueryTokensProps = {
  keys: KeyDef[];
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  /** Called with the tokens and the raw text on every edit. */
  onChange?: (tokens: Token[], text: string) => void;
  theme?: "light" | "dark";
  className?: string;
};

type Suggestion = { label: string; insert: string; hint: string; from: number; to: number };

/**
 * Query Tokens
 * A filter bar that speaks a small syntax (status:open -label:bug
 * updated:>2026-09) without giving up plain-text editing. Recognised terms are
 * highlighted in place, mistakes get a "did you mean", and the bar suggests
 * keys and values as you type.
 */
export function QueryTokens({ keys, defaultValue = "", placeholder = "Filter, e.g. status:open owner:me", label = "Filter", onChange, theme = "light", className = "" }: QueryTokensProps) {
  const id = useId();
  const [text, setText] = useState(defaultValue);
  const [caret, setCaret] = useState(defaultValue.length);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [scroll, setScroll] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const tokens = useMemo(() => tokenize(text, keys), [text, keys]);

  const update = (v: string, at = v.length) => {
    setText(v);
    setCaret(at);
    setOpen(true);
    setActive(0);
    onChange?.(tokenize(v, keys), v);
    requestAnimationFrame(() => { input.current?.setSelectionRange(at, at); setScroll(input.current?.scrollLeft ?? 0); });
  };

  // What the caret is in the middle of decides what to suggest.
  const suggestions = useMemo<Suggestion[]>(() => {
    const before = text.slice(0, caret);
    const start = before.search(/\S*$/);
    const word = before.slice(start);
    const end = start + (/^\S*/.exec(text.slice(start))?.[0].length ?? 0);
    const neg = word.startsWith("-") ? "-" : "";
    const bare = word.slice(neg.length);
    const colon = bare.indexOf(":");
    if (colon < 0) {
      if (!bare && !open) return [];
      return keys.filter((k) => k.key.startsWith(bare.toLowerCase()) && k.key !== bare).map((k) => ({ label: `${k.key}:`, insert: `${neg}${k.key}:`, hint: k.label, from: start, to: end }));
    }
    const key = keys.find((k) => k.key === bare.slice(0, colon).toLowerCase());
    if (!key?.values) return [];
    const typed = bare.slice(colon + 1).replace(/^"/, "").toLowerCase();
    return key.values.filter((v) => v.toLowerCase().startsWith(typed) && v.toLowerCase() !== typed).map((v) => ({ label: v, insert: `${neg}${key.key}:${/\s/.test(v) ? `"${v}"` : v} `, hint: key.label, from: start, to: end }));
  }, [text, caret, keys, open]);
  const showing = open && suggestions.length > 0;

  const accept = (s: Suggestion) => {
    const v = text.slice(0, s.from) + s.insert + text.slice(s.to).replace(/^\s*/, s.insert.endsWith(" ") ? "" : "");
    update(v, s.from + s.insert.length);
  };
  const remove = (t: Token) => {
    const v = (text.slice(0, t.start) + text.slice(t.end)).replace(/\s{2,}/g, " ").trim();
    update(v, Math.min(t.start, v.length));
    input.current?.focus();
  };
  const fix = (t: Token) => {
    if (t.type !== "term" || !t.suggestion) return;
    const fixed = render(t.known ? { ...t, value: t.suggestion } : { ...t, key: t.suggestion });
    update(text.slice(0, t.start) + fixed + text.slice(t.end), t.start + fixed.length);
    input.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showing && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length); }
    else if (showing && (e.key === "Enter" || e.key === "Tab")) { e.preventDefault(); accept(suggestions[active]); }
    else if (e.key === "Escape") { if (showing) { e.preventDefault(); setOpen(false); } }
    else if (e.key === "ArrowDown" && !showing) { setOpen(true); }
  };
  const sync = () => { const el = input.current; if (!el) return; setCaret(el.selectionStart ?? el.value.length); setScroll(el.scrollLeft); };

  // The overlay repeats the text with each token wrapped, so the input keeps native editing.
  const pieces: { text: string; t?: Token }[] = [];
  let at = 0;
  for (const t of tokens) { if (t.start > at) pieces.push({ text: text.slice(at, t.start) }); pieces.push({ text: text.slice(t.start, t.end), t }); at = t.end; }
  if (at < text.length) pieces.push({ text: text.slice(at) });
  const problems = tokens.filter((t): t is Extract<Token, { type: "term" }> => t.type === "term" && (!t.known || !!t.badValue));

  return (
    <div className={`qtok qtok--${theme} ${className}`}>
      <div className="qtok__bar" data-open={showing || undefined}>
        <svg className="qtok__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
        <div className="qtok__field">
          <div className="qtok__overlay" aria-hidden="true" style={{ transform: `translateX(${-scroll}px)` }}>
            {pieces.map((p, i) => p.t ? (
              <span key={i} className="qtok__tok" data-type={p.t.type} data-neg={p.t.negate || undefined} data-bad={p.t.type === "term" && (!p.t.known || p.t.badValue) ? true : undefined}>
                {p.t.type === "term" ? <><span className="qtok__key">{text.slice(p.t.start, p.t.keyEnd + 1 + (p.t.op === ":" ? 0 : p.t.op.length))}</span>{text.slice(p.t.keyEnd + 1 + (p.t.op === ":" ? 0 : p.t.op.length), p.t.end)}</> : p.text}
              </span>
            ) : <span key={i}>{p.text}</span>)}
          </div>
          <input
            ref={input}
            id={`${id}-in`}
            className="qtok__input"
            value={text}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            role="combobox"
            aria-label={label}
            aria-expanded={showing}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={showing ? `${id}-o${active}` : undefined}
            aria-describedby={`${id}-sum`}
            onChange={(e) => update(e.target.value, e.target.selectionStart ?? e.target.value.length)}
            onKeyDown={onKey}
            onKeyUp={sync}
            onClick={() => { sync(); setOpen(true); }}
            onScroll={sync}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
          />
        </div>
        {text && <button type="button" className="qtok__clear" aria-label="Clear filter" onClick={() => { update(""); input.current?.focus(); }}>×</button>}
        {showing && (
          <ul id={`${id}-list`} className="qtok__list" role="listbox" aria-label="Suggestions">
            {suggestions.map((s, i) => (
              <li key={s.label} id={`${id}-o${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => { e.preventDefault(); accept(s); }} onMouseEnter={() => setActive(i)}>
                <code>{s.label}</code><span>{s.hint}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {problems.length > 0 && (
        <p className="qtok__hint" role="status">
          {problems.map((t) => (
            <span key={t.start}>
              {t.known ? <>No {t.key} called “{t.value}”.</> : <>No filter called “{t.key}”.</>}
              {t.suggestion && <> <button type="button" onClick={() => fix(t)}>Did you mean {t.known ? `${t.key}:${t.suggestion}` : `${t.suggestion}:`}?</button></>}
            </span>
          ))}
        </p>
      )}

      <ul id={`${id}-sum`} className="qtok__summary" aria-label="Active filters">
        {tokens.length === 0 && <li className="qtok__none">No filters. Showing everything.</li>}
        {tokens.map((t) => (
          <li key={`${t.start}-${t.end}`} data-bad={t.type === "term" && (!t.known || t.badValue) ? true : undefined}>
            {phrase(t, keys)}
            <button type="button" aria-label={`Remove ${phrase(t, keys)}`} onClick={() => remove(t)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
