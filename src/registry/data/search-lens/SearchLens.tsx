"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import "./search-lens.css";

/**
 * Search Lens
 * Search that filters the page you're looking at, in place. Matches stay
 * exactly where they were; everything else collapses to a hairline at its own
 * position, so the page becomes a map of where the matches sit. The query takes
 * over the header while you search. Escape unfolds the page again.
 */

export type LensItem = {
  id: string;
  title: string;
  meta?: string;
  icon?: ReactNode;
  /** Values that operators match against, e.g. { owner: "hamza", status: "open" }. */
  fields?: Record<string, string>;
  detail?: ReactNode;
};
export type LensSection = { id: string; label: string; items: LensItem[] };
export type RemoteHit = LensItem & { place: string };

type Props = {
  title: string;
  subtitle?: string;
  sections: LensSection[];
  /** Operators and their suggested values, e.g. { owner: ["hamza", "unassigned"] }. */
  operators?: Record<string, string[]>;
  /** Searches beyond this page; results appear in their own group. */
  remote?: (query: string) => Promise<RemoteHit[]>;
  remoteLabel?: string;
  onOpen?: (item: LensItem) => void;
  /** Key that focuses the field from anywhere on the page. */
  shortcut?: string;
  theme?: "paper" | "night";
};

type Chip = { key: string; value: string };

function parse(text: string) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !/^\w+:/.test(w));
}

function highlight(text: string, words: string[]) {
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export function SearchLens({ title, subtitle, sections, operators = {}, remote, remoteLabel = "Elsewhere", onOpen, shortcut = "/", theme = "paper" }: Props) {
  const [text, setText] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [focused, setFocused] = useState(false);
  const [off, setOff] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [remoteHits, setRemoteHits] = useState<RemoteHit[] | null>(null);
  const [remoteBusy, setRemoteBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const listId = useId();
  const statusId = useId();

  const words = useMemo(() => parse(text), [text]);
  const searching = words.length > 0 || chips.length > 0;

  const matches = (item: LensItem) => {
    const hay = `${item.title} ${item.meta ?? ""}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) return false;
    return chips.every((c) => (item.fields?.[c.key] ?? "").toLowerCase().includes(c.value.toLowerCase()));
  };

  const view = useMemo(
    () =>
      sections.map((s) => {
        const hits = searching ? s.items.filter(matches) : s.items;
        const shown = off.has(s.id) ? [] : hits;
        return { ...s, hits, shown: new Set(shown.map((i) => i.id)) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, words, chips, off, searching],
  );

  const order = useMemo(() => {
    const local = view.flatMap((s) => s.items.filter((i) => s.shown.has(i.id)).map((i) => i.id));
    return searching ? [...local, ...(remoteHits ?? []).map((h) => h.id)] : [];
  }, [view, remoteHits, searching]);
  const total = view.reduce((n, s) => n + s.shown.size, 0);

  // Keep the active match valid; start on the first one.
  useEffect(() => {
    if (!searching) return setActive(null);
    setActive((a) => (a && order.includes(a) ? a : order[0] ?? null));
  }, [order, searching]);

  useEffect(() => {
    if (active) rowRefs.current.get(active)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // The remote group: debounced, with its own quiet loading line.
  useEffect(() => {
    if (!remote || !searching) {
      setRemoteHits(null);
      setRemoteBusy(false);
      return;
    }
    let live = true;
    setRemoteBusy(true);
    const q = [text, ...chips.map((c) => `${c.key}:${c.value}`)].join(" ").trim();
    const t = window.setTimeout(() => {
      remote(q).then((hits) => {
        if (!live) return;
        setRemoteHits(hits);
        setRemoteBusy(false);
      });
    }, 220);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [text, chips, remote, searching]);

  // "/" focuses the lens from anywhere that isn't already a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== shortcut || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const clear = () => {
    setText("");
    setChips([]);
    setOff(new Set());
    setOpen(null);
  };

  const onChange = (v: string) => {
    // "key:value " becomes a chip once the space is typed.
    const m = v.match(/(?:^|\s)(\w+):(\S+)\s$/);
    if (m && operators[m[1].toLowerCase()]) {
      setChips((c) => [...c.filter((x) => x.key !== m[1].toLowerCase()), { key: m[1].toLowerCase(), value: m[2] }]);
      setText(v.slice(0, v.length - m[0].length).trimEnd() + (v.length - m[0].length > 0 ? " " : ""));
      return;
    }
    setText(v);
  };

  const pending = text.match(/(?:^|\s)(\w+):(\S*)$/);
  const pendingKey = pending && operators[pending[1].toLowerCase()] ? pending[1].toLowerCase() : null;
  const suggestions = pendingKey ? operators[pendingKey].filter((v) => v.startsWith(pending![2].toLowerCase())) : [];

  const addChip = (key: string, value: string) => {
    setChips((c) => [...c.filter((x) => x.key !== key), { key, value }]);
    setText((t) => t.replace(/(?:^|\s)\w+:\S*$/, "").trimEnd());
    inputRef.current?.focus();
  };

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const i = active ? order.indexOf(active) : -1;
    if (e.key === "ArrowDown" && order.length) {
      e.preventDefault();
      setActive(order[Math.min(order.length - 1, i + 1)]);
    } else if (e.key === "ArrowUp" && order.length) {
      e.preventDefault();
      setActive(order[Math.max(0, i - 1)]);
    } else if (e.key === "Enter" && active) {
      e.preventDefault();
      setOpen((o) => (o === active ? null : active));
      const item = [...sections.flatMap((s) => s.items), ...(remoteHits ?? [])].find((x) => x.id === active);
      if (item) onOpen?.(item);
    } else if (e.key === "Tab" && suggestions.length && pendingKey) {
      e.preventDefault();
      addChip(pendingKey, suggestions[0]);
    } else if (e.key === "Backspace" && !text && chips.length) {
      setChips((c) => c.slice(0, -1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (searching || off.size) clear();
      else inputRef.current?.blur();
    }
  };

  const expanded = focused || searching;
  const row = (item: LensItem, visible: boolean, place?: string) => {
    const isActive = active === item.id;
    const isOpen = open === item.id && visible;
    return (
      <li
        key={item.id}
        id={`${listId}-${item.id}`}
        ref={(el) => {
          if (el) rowRefs.current.set(item.id, el);
          else rowRefs.current.delete(item.id);
        }}
        className="search-lens__row"
        data-hidden={!visible || undefined}
        data-active={isActive || undefined}
        role={searching ? "option" : undefined}
        aria-selected={searching ? isActive : undefined}
        aria-hidden={!visible || undefined}
      >
        <div className="search-lens__row-inner">
          <button
            type="button"
            tabIndex={searching ? -1 : 0}
            className="search-lens__item"
            onMouseDown={(e) => searching && e.preventDefault()}
            onClick={() => {
              setActive(item.id);
              setOpen((o) => (o === item.id ? null : item.id));
              onOpen?.(item);
            }}
          >
            {item.icon && (
              <span className="search-lens__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="search-lens__text">
              <span className="search-lens__title">{highlight(item.title, words)}</span>
              {(item.meta || place) && <span className="search-lens__meta">{place ? `${place} · ${item.meta ?? ""}` : highlight(item.meta ?? "", words)}</span>}
            </span>
          </button>
          {item.detail && (
            <div className="search-lens__detail" data-open={isOpen || undefined}>
              <div>{isOpen && item.detail}</div>
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className={`search-lens search-lens--${theme}`} data-expanded={expanded || undefined} data-searching={searching || undefined}>
      <header className="search-lens__head">
        <div className="search-lens__heading" aria-hidden={expanded || undefined}>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="search-lens__field" onClick={() => inputRef.current?.focus()}>
          <svg className="search-lens__glass" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          {chips.map((c) => (
            <span key={c.key} className="search-lens__chip">
              <span>{c.key}:</span>
              {c.value}
              <button type="button" aria-label={`Remove ${c.key} filter`} onClick={() => setChips((x) => x.filter((y) => y.key !== c.key))}>
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={searching}
            aria-controls={listId}
            aria-activedescendant={active ? `${listId}-${active}` : undefined}
            aria-describedby={statusId}
            aria-label={`Search ${title}`}
            autoComplete="off"
            spellCheck={false}
            placeholder={chips.length ? "" : `Search ${title}`}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {expanded ? (
            (searching || off.size > 0) && (
              <button type="button" className="search-lens__clear" onClick={clear} aria-label="Clear search">
                <span>Clear</span> <kbd aria-hidden="true">esc</kbd>
              </button>
            )
          ) : (
            <kbd className="search-lens__key" aria-hidden="true">
              {shortcut}
            </kbd>
          )}
        </div>
      </header>

      {/* Facets and operator suggestions appear only while searching. */}
      <div className="search-lens__facets" data-on={expanded || undefined}>
        <div>
          {suggestions.length > 0 ? (
            <>
              <span className="search-lens__facet-label">{pendingKey}:</span>
              {suggestions.map((v) => (
                <button key={v} type="button" className="search-lens__facet" onMouseDown={(e) => e.preventDefault()} onClick={() => addChip(pendingKey!, v)}>
                  {v}
                </button>
              ))}
              <span className="search-lens__facet-hint">Tab to accept</span>
            </>
          ) : searching ? (
            view.map((s) => (
              <button
                key={s.id}
                type="button"
                className="search-lens__facet"
                aria-pressed={!off.has(s.id)}
                disabled={!s.hits.length}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  setOff((o) => {
                    const n = new Set(o);
                    if (n.has(s.id)) n.delete(s.id);
                    else n.add(s.id);
                    return n;
                  })
                }
              >
                {s.label} <b>{s.hits.length}</b>
              </button>
            ))
          ) : (
            <span className="search-lens__facet-hint">
              Try {Object.keys(operators).map((k, i) => (
                <code key={k}>
                  {i > 0 && " "}
                  {k}:
                </code>
              ))}
            </span>
          )}
        </div>
      </div>

      <p id={statusId} className="search-lens__sr" aria-live="polite">
        {searching ? `${total} ${total === 1 ? "match" : "matches"} in ${title}${remoteBusy ? ", searching elsewhere" : remoteHits?.length ? `, ${remoteHits.length} elsewhere` : ""}` : ""}
      </p>

      <div id={listId} className="search-lens__page" role={searching ? "listbox" : undefined} aria-label={searching ? `Matches in ${title}` : undefined}>
        {view.map((s) => (
          <section key={s.id} className="search-lens__section" data-empty={(searching && !s.shown.size) || undefined} role={searching ? "group" : undefined} aria-label={s.label}>
            <h3 className="search-lens__section-head">
              {s.label}
              <span>{searching ? `${s.shown.size} / ${s.items.length}` : s.items.length}</span>
            </h3>
            <ul role={searching ? "presentation" : undefined}>{s.items.map((item) => row(item, !searching || s.shown.has(item.id)))}</ul>
          </section>
        ))}

        {searching && total === 0 && (
          <div className="search-lens__empty">
            <p>
              Nothing in {title} matches <strong>&ldquo;{[text.trim(), ...chips.map((c) => `${c.key}:${c.value}`)].filter(Boolean).join(" ")}&rdquo;</strong>.
            </p>
            <div>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clear}>
                Clear search
              </button>
              {chips.length > 0 && (
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setChips([])}>
                  Remove filters
                </button>
              )}
            </div>
          </div>
        )}
        {searching && remote && (
          <section className="search-lens__section search-lens__remote" role="group" aria-label={remoteLabel}>
            <h3 className="search-lens__section-head">
              {remoteLabel}
              <span>{remoteBusy ? "…" : remoteHits?.length ?? 0}</span>
            </h3>
            <div className="search-lens__progress" data-on={remoteBusy || undefined} aria-hidden="true" />
            <ul role="presentation">{(remoteHits ?? []).map((h) => row(h, true, h.place))}</ul>
            {!remoteBusy && remoteHits?.length === 0 && <p className="search-lens__none">Nothing elsewhere either.</p>}
          </section>
        )}

      </div>
    </div>
  );
}
