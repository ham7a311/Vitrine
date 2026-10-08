"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FIELDS, LABELS, RECORDS, apply, distribution, matches, nextCycle, quorum, summarise, type Cycle, type Field, type Label, type Patch, type Rec } from "./mix";
import "./mixed-inspector.css";

/**
 * Mixed Inspector
 * Select several records and edit them together without losing what makes them different. Instead of
 * "Mixed", every field shows its spread — "In progress ×2 · Todo ×3" — and each slice is both an editor
 * (change only those) and a selector (select only those). Labels show how many carry them and cycle
 * back to the original mix. Nothing saves until you apply, and failures stay selected with a reason.
 */

export type MixedChange = { id: string; patch: Patch };

export type MixedInspectorProps = {
  records?: Rec[];
  defaultSelected?: string[];
  onApply?: (changes: MixedChange[]) => void;
  theme?: "dark" | "light";
  className?: string;
};

const I = {
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
  dash: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8" /></svg>,
  chev: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>,
  search: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.25" /><path d="m10.25 10.25 3.25 3.25" /></svg>,
  x: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" /></svg>,
  warn: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2zM8 6.5v3m0 1.8v.2" /></svg>,
};

type Menu = { field: Field; value: string | null };

function Check({ state }: { state: boolean | "mixed" }) {
  return <b className="mxin__box" data-s={state === "mixed" ? "mixed" : state ? "on" : "off"} aria-hidden="true">{state === "mixed" ? I.dash : state ? I.tick : null}</b>;
}

export function MixedInspector({ records = RECORDS, defaultSelected = ["VT-118", "VT-121", "VT-124", "VT-130", "VT-136"], onApply, theme = "dark", className = "" }: MixedInspectorProps) {
  const uid = useId();
  const [recs, setRecs] = useState<Rec[]>(records);
  const [sel, setSel] = useState<string[]>(defaultSelected);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [anchor, setAnchor] = useState(0);
  const [pending, setPending] = useState<Record<string, Patch>>({});
  const [cycles, setCycles] = useState<Partial<Record<Label, Cycle>>>({});
  const [menu, setMenu] = useState<Menu | null>(null);
  const [applying, setApplying] = useState(false);
  const [failed, setFailed] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState(false);
  const [say, setSay] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLElement | null>(null);

  const eff = (r: Rec) => apply(r, pending[r.id]);
  const shown = useMemo(() => recs.filter((r) => matches(eff(r), query)), [recs, query, pending]); // eslint-disable-line react-hooks/exhaustive-deps
  const selRecs = recs.filter((r) => sel.includes(r.id));
  const selEff = selRecs.map(eff);
  const hidden = sel.filter((id) => !shown.some((r) => r.id === id)).length;
  const shownSel = shown.filter((r) => sel.includes(r.id)).length;
  const groupState: boolean | "mixed" = shownSel === 0 ? false : shownSel === shown.length ? true : "mixed";
  const diff = summarise(recs, recs.map(eff));
  const failedN = Object.keys(failed).length;

  /* Selection changes reset the label cycles: they're relative to the selection. */
  const select = (ids: string[], msg?: string) => {
    setSel(ids);
    setCycles({});
    setMenu(null);
    setSay(msg ?? `${ids.length} selected.`);
  };

  useEffect(() => {
    if (cursor >= shown.length) setCursor(Math.max(0, shown.length - 1));
  }, [shown.length, cursor]);

  /* Menus: focus the first item, close on outside click. */
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus({ preventScroll: true });
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !menuBtn.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  const stage = (ids: string[], p: (r: Rec) => Patch) => {
    setPending((m) => {
      const next = { ...m };
      for (const id of ids) {
        const base = recs.find((r) => r.id === id)!;
        if (base.archived && !sel.includes(id)) continue;
        const merged: Patch = { ...next[id], ...p(apply(base, next[id])) };
        // Drop anything that's back to how it was saved.
        for (const k of Object.keys(merged) as (keyof Patch)[]) {
          const a = merged[k];
          const b = base[k];
          if (Array.isArray(a) && Array.isArray(b) ? [...a].sort().join() === [...b].sort().join() : a === b) delete merged[k];
        }
        if (Object.keys(merged).length) next[id] = merged;
        else delete next[id];
      }
      return next;
    });
  };

  const setField = (field: Field, value: string, ids: string[]) => {
    stage(ids, () => ({ [field]: value }) as Patch);
    setMenu(null);
    menuBtn.current?.focus({ preventScroll: true });
    setSay(`${FIELDS.find((f) => f.id === field)!.name} → ${value} on ${ids.length}. Staged, not saved.`);
  };

  const cycleLabel = (l: Label) => {
    const orig = selRecs.filter((r) => r.labels.includes(l));
    const c = nextCycle(cycles[l] ?? "orig", orig.length, selRecs.length);
    setCycles((m) => ({ ...m, [l]: c }));
    stage(sel, (r) => {
      const base = recs.find((x) => x.id === r.id)!;
      const want = c === "all" ? true : c === "none" ? false : base.labels.includes(l);
      const has = r.labels.includes(l);
      return want === has ? {} : { labels: want ? [...r.labels, l] : r.labels.filter((x) => x !== l) };
    });
    setSay(c === "all" ? `${l} on all ${selRecs.length}.` : c === "none" ? `${l} removed from all.` : `${l} back to how it was: ${orig.length} of ${selRecs.length}.`);
  };

  const commit = (ids: string[], retry = false) => {
    if (!ids.length) return;
    setApplying(true);
    setSay("Saving…");
    window.setTimeout(() => {
      const fails: Record<string, string> = {};
      const ok: string[] = [];
      for (const id of ids) {
        const r = recs.find((x) => x.id === id)!;
        if (r.archived) fails[id] = "Archived — read-only";
        else if (r.conflict && !retry) fails[id] = "Mei edited this a moment ago";
        else ok.push(id);
      }
      onApply?.(ok.map((id) => ({ id, patch: pending[id] })));
      setRecs((rs) => rs.map((r) => (ok.includes(r.id) ? { ...apply(r, pending[r.id]), conflict: false } : fails[r.id] && !r.archived ? { ...r, conflict: false } : r)));
      setPending((m) => Object.fromEntries(Object.entries(m).filter(([id]) => !ok.includes(id))));
      setFailed(fails);
      setApplying(false);
      setCycles({});
      const nf = Object.keys(fails).length;
      if (nf) setSel(Object.keys(fails));
      setSay(nf ? `${ok.length} saved. ${nf} couldn’t be saved and stay selected.` : `${ok.length} saved.`);
    }, 900);
  };

  const discard = () => {
    setPending({});
    setCycles({});
    setFailed({});
    setSay("Changes discarded.");
  };
  const dropArchived = () => {
    const ids = Object.keys(failed).filter((id) => recs.find((r) => r.id === id)?.archived);
    setPending((m) => Object.fromEntries(Object.entries(m).filter(([id]) => !ids.includes(id))));
    setFailed((f) => Object.fromEntries(Object.entries(f).filter(([id]) => !ids.includes(id))));
    select(sel.filter((id) => !ids.includes(id)), "Archived issues left out.");
  };

  /* ---------- list selection ---------- */
  const range = (a: number, b: number) => shown.slice(Math.min(a, b), Math.max(a, b) + 1).map((r) => r.id);
  const toggle = (i: number) => {
    const id = shown[i].id;
    const on = sel.includes(id);
    select(on ? sel.filter((x) => x !== id) : [...sel, id], `${id} ${on ? "deselected" : "selected"}. ${sel.length + (on ? -1 : 1)} selected.`);
    setAnchor(i);
  };
  const clickRow = (e: MouseEvent, i: number) => {
    setCursor(i);
    if (e.shiftKey) {
      select([...new Set([...sel, ...range(anchor, i)])]);
      return;
    }
    toggle(i);
  };
  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault();
      const n = Math.max(0, Math.min(shown.length - 1, cursor + (k === "ArrowDown" ? 1 : -1)));
      setCursor(n);
      if (e.shiftKey) select([...new Set([...sel.filter((id) => !range(anchor, cursor).includes(id)), ...range(anchor, n)])]);
      else setAnchor(n);
    } else if (k === "Home" || k === "End") {
      e.preventDefault();
      setCursor(k === "Home" ? 0 : shown.length - 1);
    } else if ((k === " " || k.toLowerCase() === "x") && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (shown[cursor]) toggle(cursor);
    } else if (k.toLowerCase() === "a" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      select([...new Set([...sel, ...shown.map((r) => r.id)])], `All ${shown.length} shown selected.`);
    } else if (k === "Escape" && sel.length) {
      e.preventDefault();
      select([], "Selection cleared.");
    }
  };
  useEffect(() => {
    (listRef.current?.querySelector(`[data-i="${cursor}"]`) as HTMLElement | null)?.scrollIntoView?.({ block: "nearest" });
  }, [cursor]);

  const onMenuKey = (e: KeyboardEvent) => {
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setMenu(null);
      menuBtn.current?.focus({ preventScroll: true });
    } else if (e.key === "Tab") setMenu(null);
  };
  const openMenu = (e: MouseEvent<HTMLElement>, m: Menu) => {
    menuBtn.current = e.currentTarget;
    setMenu((cur) => (cur && cur.field === m.field && cur.value === m.value ? null : m));
  };

  const n = selRecs.length;
  const changedSel = (field: Field) => selRecs.some((r) => pending[r.id]?.[field] !== undefined);

  return (
    <div className={`mxin mxin--${theme} ${className}`} data-sheet={sheet || undefined}>
      <div className="mxin__card">
        {/* ---------- the list ---------- */}
        <section className="mxin__list" aria-label="Issues">
          <div className="mxin__bar">
            <button
              type="button"
              role="checkbox"
              aria-checked={groupState}
              aria-label={groupState === true ? "Deselect all shown" : "Select all shown"}
              className="mxin__group"
              onClick={() => (groupState === true ? select(sel.filter((id) => !shown.some((r) => r.id === id))) : select([...new Set([...sel, ...shown.map((r) => r.id)])]))}
            >
              <Check state={groupState} />
            </button>
            <p className="mxin__count">
              <b>{n}</b> selected{hidden > 0 && <span> · {hidden} hidden by filter</span>}
            </p>
            <label className="mxin__filter">
              {I.search}
              <input value={query} placeholder="Filter" aria-label="Filter issues" onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          <ul
            ref={listRef}
            className="mxin__rows"
            role="listbox"
            aria-multiselectable="true"
            aria-label="Issues — X or Space selects, Shift+arrows extend, ⌘A selects all shown"
            tabIndex={0}
            aria-activedescendant={shown[cursor] ? `${uid}-r-${shown[cursor].id}` : undefined}
            onKeyDown={onListKey}
          >
            {shown.map((r, i) => {
              const e = eff(r);
              const on = sel.includes(r.id);
              return (
                <li
                  key={r.id}
                  id={`${uid}-r-${r.id}`}
                  data-i={i}
                  role="option"
                  aria-selected={on}
                  className="mxin__row"
                  data-cursor={i === cursor || undefined}
                  data-staged={pending[r.id] ? true : undefined}
                  data-failed={failed[r.id] ? true : undefined}
                  onPointerDown={(ev) => ev.shiftKey && ev.preventDefault()}
                  onClick={(ev) => clickRow(ev, i)}
                >
                  <Check state={on} />
                  <span className="mxin__id">{r.id}</span>
                  <span className="mxin__title">
                    {r.title}
                    {r.archived && <em>archived</em>}
                  </span>
                  <span className="mxin__cells">
                    <span data-v={e.status}>{e.status}</span>
                    <span data-p={e.priority}>{e.priority}</span>
                    <span>{e.assignee}</span>
                  </span>
                  {pending[r.id] && <i className="mxin__dot" aria-label="has unsaved changes" />}
                </li>
              );
            })}
            {!shown.length && <li className="mxin__empty" role="presentation">Nothing matches “{query}”.</li>}
          </ul>
          <button type="button" className="mxin__open" disabled={!n} onClick={() => setSheet(true)}>
            Edit {n} selected{diff.changed.length > 0 && <span> · {diff.changed.length} staged</span>}
          </button>
        </section>

        {/* ---------- the inspector ---------- */}
        <section className="mxin__insp" aria-labelledby={`${uid}-insp`}>
          <header className="mxin__ihead">
            <h3 id={`${uid}-insp`}>{n ? `Editing ${n} issue${n === 1 ? "" : "s"}` : "Nothing selected"}</h3>
            <button type="button" className="mxin__close" aria-label="Back to the list" onClick={() => setSheet(false)}>{I.x}</button>
          </header>

          {!n ? (
            <p className="mxin__hint">Select issues to edit them together. Their differences stay visible.</p>
          ) : (
            <div className="mxin__fields">
              {FIELDS.map((f) => {
                const dist = distribution(selEff, f.id);
                const open = menu?.field === f.id;
                return (
                  <div key={f.id} className="mxin__field" data-f={f.id}>
                    <div className="mxin__fhead">
                      <span className="mxin__fname">
                        {f.name}
                        {changedSel(f.id) && <i className="mxin__dot" aria-label="changed" />}
                      </span>
                      <span className="mxin__spread" aria-hidden="true">
                        {dist.map((d) => <i key={d.value} data-v={d.value} style={{ flexGrow: d.ids.length }} />)}
                      </span>
                      <button type="button" className="mxin__setall" aria-haspopup="menu" aria-expanded={open && menu?.value === null} onClick={(e) => openMenu(e, { field: f.id, value: null })}>
                        {dist.length === 1 ? "Change" : `Set all ${n}`}{I.chev}
                      </button>
                    </div>
                    <div className="mxin__chips">
                      {dist.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          className="mxin__chip"
                          data-v={d.value}
                          aria-haspopup="menu"
                          aria-expanded={open && menu?.value === d.value}
                          aria-label={`${d.value} on ${d.ids.length} of ${n}`}
                          onClick={(e) => openMenu(e, { field: f.id, value: d.value })}
                        >
                          <span>{d.value}</span>
                          {dist.length > 1 && <small>×{d.ids.length}</small>}
                        </button>
                      ))}
                    </div>
                    {open && (
                      <div ref={menuRef} className="mxin__menu" role="menu" aria-label={menu!.value ? `${menu!.value} — ${f.name}` : `Set ${f.name} on all`} onKeyDown={onMenuKey}>
                        {menu!.value !== null && (() => {
                          const ids = dist.find((d) => d.value === menu!.value)?.ids ?? [];
                          return (
                            <>
                              <button type="button" role="menuitem" className="mxin__mi" onClick={() => { select(ids, `Selected only the ${ids.length} with ${f.name} ${menu!.value}.`); menuBtn.current = null; }}>
                                Select only these {ids.length}
                              </button>
                              <p className="mxin__mlabel">Change these {ids.length} to</p>
                              {f.values.filter((v) => v !== menu!.value).map((v) => (
                                <button key={v} type="button" role="menuitem" className="mxin__mi" data-v={v} onClick={() => setField(f.id, v, ids)}>
                                  <i aria-hidden="true" />{v}
                                </button>
                              ))}
                            </>
                          );
                        })()}
                        {menu!.value === null && (
                          <>
                            <p className="mxin__mlabel">Set {f.name.toLowerCase()} on all {n}</p>
                            {f.values.map((v) => (
                              <button key={v} type="button" role="menuitem" className="mxin__mi" data-v={v} onClick={() => setField(f.id, v, sel)}>
                                <i aria-hidden="true" />{v}
                                {dist.length === 1 && dist[0].value === v && <small>current</small>}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <fieldset className="mxin__labels">
                <legend>Labels</legend>
                {LABELS.map((l) => {
                  const now = quorum(selEff, l);
                  const was = quorum(selRecs, l);
                  const state: boolean | "mixed" = now === 0 ? false : now === n ? true : "mixed";
                  return (
                    <button key={l} type="button" role="checkbox" aria-checked={state} className="mxin__label" data-l={l} aria-label={`${l}: on ${now} of ${n}${now !== was ? `, was ${was}` : ""}`} onClick={() => cycleLabel(l)}>
                      <Check state={state} />
                      <span className="mxin__lname">{l}</span>
                      <span className="mxin__q" aria-hidden="true"><i style={{ width: `${(now / n) * 100}%` }} /></span>
                      <span className="mxin__qn" aria-hidden="true">
                        {now}/{n}
                        {now !== was && <s>{was}</s>}
                      </span>
                    </button>
                  );
                })}
              </fieldset>
            </div>
          )}

          {/* ---------- staged diff / failures ---------- */}
          {failedN > 0 && (
            <div className="mxin__fail" role="group" aria-label="Couldn’t be saved">
              <p>{I.warn}{failedN} couldn’t be saved — still selected</p>
              <ul>
                {Object.entries(failed).map(([id, why]) => <li key={id}><b>{id}</b> {why}</li>)}
              </ul>
              <div className="mxin__acts">
                <button type="button" className="mxin__btn" data-k="go" disabled={applying} onClick={() => commit(Object.keys(failed).filter((id) => pending[id]), true)}>Retry</button>
                {Object.keys(failed).some((id) => recs.find((r) => r.id === id)?.archived) && (
                  <button type="button" className="mxin__btn" onClick={dropArchived}>Leave out archived</button>
                )}
              </div>
            </div>
          )}
          {diff.changed.length > 0 && failedN === 0 && (
            <div className="mxin__diff" role="group" aria-label="Staged changes">
              <p>
                <b>{diff.changed.length} issue{diff.changed.length === 1 ? "" : "s"} will change</b>
                <span>{diff.parts.join(" · ")}</span>
              </p>
              <div className="mxin__acts">
                <button type="button" className="mxin__btn" disabled={applying} onClick={discard}>Discard</button>
                <button type="button" className="mxin__btn" data-k="go" disabled={applying} onClick={() => commit(diff.changed)}>
                  {applying ? <i className="mxin__spin" aria-hidden="true" /> : null}
                  {applying ? "Saving" : "Apply"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
      <p className="mxin__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
