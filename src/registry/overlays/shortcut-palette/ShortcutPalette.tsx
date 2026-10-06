"use client";

import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { rank } from "./fuzzy";
import "./shortcut-palette.css";

/**
 * Shortcut Palette
 * A command palette that teaches. Type a few letters of what you want, run it, and
 * if it has a keyboard shortcut the palette tells you ("Next time: ⇧⌘D") once the
 * action has happened, in the one moment you'll actually remember it.
 */

export type Command = {
  id: string;
  label: string;
  group: string;
  /** Shortcut keys in display order: ["⇧", "⌘", "D"]. */
  keys?: string[];
  /** Words that find it without being shown. */
  keywords?: string;
};

type Props = {
  commands: Command[];
  /** Controlled. Omit to let the palette keep its own state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRun: (command: Command) => void;
  /** Open and close with ⌘K / Ctrl K while focus is inside this element (or anywhere, with "window"). */
  hotkeyScope?: RefObject<HTMLElement | null> | "window";
  placeholder?: string;
  /** Position inside the nearest positioned ancestor instead of portalling to the body. */
  contained?: boolean;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

function Marked({ text, at }: { text: string; at: number[] }): ReactNode {
  if (!at.length) return text;
  const hit = new Set(at);
  return text.split("").map((c, i) => (hit.has(i) ? <b key={i}>{c}</b> : <Fragment key={i}>{c}</Fragment>));
}

export function ShortcutPalette({ commands, open: openProp, onOpenChange, onRun, hotkeyScope, placeholder = "Type a command", contained = false, theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const [phase, setPhase] = useState<"closed" | "open" | "closing">(open ? "open" : "closed");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [teach, setTeach] = useState<{ n: number; label: string; keys: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const typing = useRef(false);

  const set = (v: boolean) => { setInner(v); onOpenChange?.(v); };

  const results = useMemo(() => rank(query, commands), [query, commands]);
  // With no query the palette is a menu: groups in the order given. With one it is a ranked list.
  const sections = useMemo(() => {
    if (query.trim()) return [{ group: "", rows: results }];
    const order: string[] = [];
    commands.forEach((c) => !order.includes(c.group) && order.push(c.group));
    return order.map((g) => ({ group: g, rows: results.filter((r) => r.item.group === g) }));
  }, [query, results, commands]);
  const flat = sections.flatMap((s) => s.rows);
  const optionId = (i: number) => `${uid}-o${i}`;

  // Open and close, with a short exit so the panel leaves rather than vanishes.
  useEffect(() => {
    if (open && phase !== "open") {
      restore.current = document.activeElement as HTMLElement | null;
      setQuery(""); setActive(0); setPhase("open");
    } else if (!open && phase === "open") {
      setPhase("closing");
    }
  }, [open, phase]);
  // The exit has its own effect: sharing one with the phase change would cancel the timer the moment phase became "closing".
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      if (restore.current?.isConnected) restore.current.focus({ preventScroll: true });
    }, 140);
    return () => window.clearTimeout(t);
  }, [phase]);
  useEffect(() => { if (phase === "open") input.current?.focus({ preventScroll: true }); }, [phase]);
  useEffect(() => { setActive(0); }, [query]);

  // ⌘K / Ctrl K, scoped so a palette in a demo never steals the host page's own shortcut.
  useEffect(() => {
    if (!hotkeyScope) return;
    const target: HTMLElement | Window | null = hotkeyScope === "window" ? window : hotkeyScope.current;
    if (!target) return;
    const on = (e: Event) => {
      const k = e as KeyboardEvent;
      if ((k.metaKey || k.ctrlKey) && k.key.toLowerCase() === "k") { k.preventDefault(); k.stopPropagation(); set(!open); }
    };
    target.addEventListener("keydown", on);
    return () => target.removeEventListener("keydown", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotkeyScope, open]);

  // One marker that travels to the active row, instead of each row lighting up on its own.
  useLayoutEffect(() => {
    const ul = list.current;
    const el = ul?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`);
    if (!ul || !el) return;
    ul.style.setProperty("--sp-y", `${el.offsetTop}px`);
    ul.style.setProperty("--sp-h", `${el.offsetHeight}px`);
    if (!typing.current) return;
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < ul.scrollTop) ul.scrollTop = top - 36;
    else if (bottom > ul.scrollTop + ul.clientHeight) ul.scrollTop = bottom - ul.clientHeight + 8;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, flat.length, phase]);

  useEffect(() => {
    if (!teach) return;
    const t = window.setTimeout(() => setTeach(null), 3600);
    return () => window.clearTimeout(t);
  }, [teach]);

  const run = (i: number) => {
    const row = flat[i];
    if (!row) return;
    const c = row.item;
    set(false);
    onRun(c);
    setTeach({ n: Date.now(), label: c.label, keys: c.keys?.join(" ") ?? "" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    typing.current = true;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (flat.length ? (a + 1) % flat.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(active); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); set(false); }
    else if (e.key === "Tab") e.preventDefault(); // the palette is one control; focus stays in it
  };

  let idx = -1;
  const panel = phase !== "closed" && (
    <div className={`shortcut-palette__layer shortcut-palette--${theme}${contained ? " shortcut-palette--contained" : ""}`} data-phase={phase} data-motion={motion === "reduced" ? "reduced" : undefined}>
      <div className="shortcut-palette__scrim" aria-hidden="true" onPointerDown={() => set(false)} />
      <div className="shortcut-palette__panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="shortcut-palette__field">
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? optionId(active) : undefined}
            aria-label="Command"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => { typing.current = true; setQuery(e.target.value); }}
            onKeyDown={onKey}
          />
          <kbd>esc</kbd>
        </div>

        <ul ref={list} id={`${uid}-list`} role="listbox" aria-label="Commands" className="shortcut-palette__list" onPointerLeave={() => (typing.current = true)}>
          <li className="shortcut-palette__marker" aria-hidden="true" role="presentation" />
          {sections.map((s) =>
            s.rows.length === 0 ? null : (
              <li key={s.group || "r"} role="presentation" className="shortcut-palette__section">
                {s.group && <span className="shortcut-palette__group" id={`${uid}-g-${s.group}`} aria-hidden="true">{s.group}</span>}
                <ul role="group" aria-label={s.group || undefined}>
                  {s.rows.map((r) => {
                    idx++;
                    const i = idx;
                    return (
                      <li
                        key={r.item.id}
                        id={optionId(i)}
                        role="option"
                        aria-selected={i === active}
                        data-active={i === active || undefined}
                        onPointerMove={() => { typing.current = false; if (active !== i) setActive(i); }}
                        onClick={() => run(i)}
                      >
                        <span className="shortcut-palette__label"><Marked text={r.item.label} at={r.at} /></span>
                        {query.trim() && <span className="shortcut-palette__where">{r.item.group}</span>}
                        {r.item.keys && <span className="shortcut-palette__keys" aria-label={`Shortcut ${r.item.keys.join(" ")}`}>{r.item.keys.map((k, n) => <kbd key={n}>{k}</kbd>)}</span>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ),
          )}
          {flat.length === 0 && <li role="presentation" className="shortcut-palette__empty">Nothing is called “{query.trim()}”.</li>}
        </ul>

        <p className="shortcut-palette__foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span></p>
        <p className="shortcut-palette__sr" role="status">{flat.length} {flat.length === 1 ? "command" : "commands"}</p>
      </div>
    </div>
  );

  const taught = teach && (
    <p key={teach.n} className={`shortcut-palette__teach shortcut-palette--${theme}${contained ? " shortcut-palette--contained" : ""}`} role="status">
      <span>Ran “{teach.label}”</span>
      {teach.keys && <b>Next time: <kbd>{teach.keys}</kbd></b>}
    </p>
  );

  const node = <div className={`shortcut-palette ${className}`}>{panel}{taught}</div>;
  return contained || typeof document === "undefined" ? node : createPortal(node, document.body);
}
