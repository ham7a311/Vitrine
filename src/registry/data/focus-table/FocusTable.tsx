"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import "./focus-table.css";

/**
 * Focus Table
 * A table with depth of field. The row you're on stays sharp; the rows around
 * it fall off in contrast with distance, while the grid lines and structure
 * stay put, so you read one record without losing the table. At rest,
 * everything is in focus. On narrow screens rows become compact records instead
 * of a table that scrolls sideways.
 */

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** Comparator; the column is sortable when present. */
  sort?: (a: T, b: T) => number;
  align?: "start" | "end";
  /** Take the remaining width (and truncate). Other columns size to their content. */
  grow?: boolean;
  /** Where the column goes in the compact (card) layout. */
  priority?: "primary" | "badge" | "secondary" | "meta";
};

type Status = "ready" | "loading" | "empty" | "error";

type Props<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowId: (row: T) => string;
  rowLabel: (row: T) => string;
  detail?: (row: T) => ReactNode;
  status?: Status;
  empty?: ReactNode;
  onRetry?: () => void;
  bulkActions?: (ids: string[], clear: () => void) => ReactNode;
  /** Width below which rows become compact records. */
  compactBelow?: number;
  theme?: "paper" | "night";
};

type Sort = { key: string; dir: "asc" | "desc" } | null;

const FALLOFF = [1, 0.78, 0.64, 0.55];

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function FocusTable<T>({
  caption,
  columns,
  rows,
  rowId,
  rowLabel,
  detail,
  status = "ready",
  empty,
  onRetry,
  bulkActions,
  compactBelow = 640,
  theme = "paper",
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rowEls = useRef(new Map<string, HTMLElement>());
  const before = useRef<Map<string, number> | null>(null);
  const [compact, setCompact] = useState(false);
  const [sort, setSort] = useState<Sort>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [within, setWithin] = useState(false);
  const [hotCol, setHotCol] = useState<string | null>(null);
  const anchor = useRef<number | null>(null);
  const moveFocus = useRef(false);
  const headRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < compactBelow));
    ro.observe(el);
    return () => ro.disconnect();
  }, [compactBelow]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    const out = [...rows].sort(col.sort);
    return sort.dir === "desc" ? out.reverse() : out;
  }, [rows, sort, columns]);
  const ids = useMemo(() => sorted.map(rowId), [sorted, rowId]);

  // FLIP the rows into their new order after a sort.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev || reduced()) return;
    rowEls.current.forEach((el, id) => {
      const was = prev.get(id);
      if (was === undefined) return;
      const dy = was - el.getBoundingClientRect().top;
      if (Math.abs(dy) > 1) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 320, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
    });
  }, [sorted]);

  // Keyboard focus follows the active row once the user is driving with keys.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    const el = rowEls.current.get(ids[active]);
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "nearest" });
  }, [active, ids]);

  // Keep the active index valid when rows change.
  useEffect(() => setActive((a) => Math.min(a, Math.max(0, ids.length - 1))), [ids.length]);

  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = ids.some((id) => selected.has(id));
  useEffect(() => {
    if (headRef.current) headRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  const cycleSort = (key: string) => {
    before.current = new Map(Array.from(rowEls.current, ([id, el]) => [id, el.getBoundingClientRect().top]));
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  };

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const selectRange = (from: number, to: number, on = true) =>
    setSelected((s) => {
      const n = new Set(s);
      for (let i = Math.min(from, to); i <= Math.max(from, to); i++) (on ? n.add(ids[i]) : n.delete(ids[i]));
      return n;
    });
  const setOpen = (id: string, open: boolean) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (open) n.add(id);
      else n.delete(id);
      return n;
    });

  const onCheck = (i: number, e: ReactMouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey && anchor.current !== null) selectRange(anchor.current, i, !selected.has(ids[i]));
    else toggle(ids[i]);
    anchor.current = i;
    setActive(i);
  };

  const onKey = (e: ReactKeyboardEvent) => {
    if (status !== "ready" || !ids.length) return;
    if ((e.target as HTMLElement).closest("button, input, a") && e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    const last = ids.length - 1;
    const go = (i: number, extend = false) => {
      e.preventDefault();
      const n = Math.max(0, Math.min(last, i));
      if (extend) {
        if (anchor.current === null) anchor.current = active;
        selectRange(anchor.current, n);
      } else anchor.current = n;
      moveFocus.current = true;
      setActive(n);
    };
    switch (e.key) {
      case "ArrowDown":
        return go(active + 1, e.shiftKey);
      case "ArrowUp":
        return go(active - 1, e.shiftKey);
      case "Home":
        return go(0);
      case "End":
        return go(last);
      case "PageDown":
        return go(active + 5);
      case "PageUp":
        return go(active - 5);
      case " ":
        e.preventDefault();
        anchor.current = active;
        return toggle(ids[active]);
      case "Enter":
      case "ArrowRight":
        if (!detail) return;
        e.preventDefault();
        return setOpen(ids[active], true);
      case "ArrowLeft":
        if (!detail) return;
        e.preventDefault();
        return setOpen(ids[active], false);
      case "Escape":
        if (selected.size) (e.preventDefault(), setSelected(new Set()));
    }
  };

  const focusIndex = hover ?? (within ? active : null);
  const falloff = (i: number) => (focusIndex === null ? 1 : FALLOFF[Math.min(3, Math.abs(i - focusIndex))]);

  const rowProps = (row: T, i: number) => {
    const id = ids[i];
    const open = expanded.has(id);
    return {
      ref: (el: HTMLElement | null) => {
        if (el) rowEls.current.set(id, el);
        else rowEls.current.delete(id);
      },
      role: "row",
      tabIndex: i === active ? 0 : -1,
      "aria-rowindex": i + 2,
      "aria-selected": selected.has(id),
      "aria-expanded": detail ? open : undefined,
      "aria-label": rowLabel(row),
      "data-focus": focusIndex === i ? "" : undefined,
      "data-selected": selected.has(id) ? "" : undefined,
      style: { "--ft-o": falloff(i) } as CSSProperties,
      onPointerEnter: () => setHover(i),
      onFocus: () => setActive(i),
      onClick: (e: ReactMouseEvent) => {
        if ((e.target as HTMLElement).closest("button, input, a, label")) return;
        setActive(i);
        if (detail) setOpen(id, !open);
      },
    };
  };

  const check = (row: T, i: number) => (
    <label className="focus-table__check" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" tabIndex={-1} checked={selected.has(ids[i])} onChange={() => {}} onClick={(e) => onCheck(i, e)} aria-label={`Select ${rowLabel(row)}`} />
      <span aria-hidden="true" />
    </label>
  );

  const chevron = (open: boolean) => (
    <svg className="focus-table__chev" data-open={open || undefined} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );

  const clear = () => setSelected(new Set());
  const selectedIds = ids.filter((id) => selected.has(id));
  const colCount = columns.length + (detail ? 2 : 1);

  const stateRow = (children: ReactNode) =>
    compact ? (
      <div className="focus-table__state" role="row">
        <div role="gridcell">{children}</div>
      </div>
    ) : (
      <tr className="focus-table__state">
        <td colSpan={colCount}>{children}</td>
      </tr>
    );

  const placeholder = Array.from({ length: 6 }, (_, i) =>
    compact ? (
      <div key={i} className="focus-table__card focus-table__card--ghost" aria-hidden="true">
        <span className="focus-table__bar" style={{ width: `${40 + ((i * 17) % 30)}%` }} />
        <span className="focus-table__bar focus-table__bar--faint" style={{ width: `${30 + ((i * 11) % 25)}%` }} />
      </div>
    ) : (
      <tr key={i} className="focus-table__ghost" aria-hidden="true">
        <td />
        {columns.map((c, j) => (
          <td key={c.key}>
            <span className="focus-table__bar" style={{ width: `${35 + ((i * 13 + j * 23) % 45)}%` }} />
          </td>
        ))}
        {detail && <td />}
      </tr>
    ),
  );

  const body = () => {
    if (status === "loading") return placeholder;
    if (status === "error")
      return stateRow(
        <div className="focus-table__message" role="alert">
          <strong>Couldn&rsquo;t load deployments.</strong>
          <span>The request timed out after 10 seconds.</span>
          {onRetry && (
            <button type="button" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>,
      );
    if (status === "empty" || !sorted.length) return stateRow(<div className="focus-table__message">{empty ?? <strong>Nothing here yet.</strong>}</div>);
    return sorted.map((row, i) => {
      const id = ids[i];
      const open = expanded.has(id);
      if (compact) {
        const primary = columns.find((c) => c.priority === "primary") ?? columns[0];
        const badge = columns.find((c) => c.priority === "badge");
        const secondary = columns.filter((c) => c.priority === "secondary");
        const meta = columns.filter((c) => c.priority === "meta" || (!c.priority && c !== primary));
        return (
          <div key={id} className="focus-table__card" {...rowProps(row, i)}>
            <div className="focus-table__c focus-table__card-grid">
              <div role="gridcell" className="focus-table__card-check">
                {check(row, i)}
              </div>
              <div role="gridcell" className="focus-table__card-main">
                <div className="focus-table__card-title">
                  {primary.render(row)}
                  {badge && <span className="focus-table__card-badge">{badge.render(row)}</span>}
                </div>
                <div className="focus-table__card-sub">
                  {secondary.map((c) => (
                    <span key={c.key}>{c.render(row)}</span>
                  ))}
                </div>
              </div>
              {detail && chevron(open)}
            </div>
            {detail && (
              <div className="focus-table__fold" data-open={open || undefined}>
                <div>
                  <dl className="focus-table__meta">
                    {meta.map((c) => (
                      <div key={c.key}>
                        <dt>{c.label}</dt>
                        <dd>{c.render(row)}</dd>
                      </div>
                    ))}
                  </dl>
                  {open && detail(row)}
                </div>
              </div>
            )}
          </div>
        );
      }
      return (
        <FragmentRows key={id}>
          <tr className="focus-table__row" {...rowProps(row, i)}>
            <td className="focus-table__td-check" role="gridcell">
              <div className="focus-table__c">{check(row, i)}</div>
            </td>
            {columns.map((c) => (
              <td key={c.key} role="gridcell" data-align={c.align} data-grow={c.grow || undefined} onPointerEnter={() => setHotCol(c.key)}>
                <div className="focus-table__c">{c.render(row)}</div>
              </td>
            ))}
            {detail && (
              <td className="focus-table__td-chev" role="gridcell">
                <div className="focus-table__c">{chevron(open)}</div>
              </td>
            )}
          </tr>
          {detail && (
            <tr className="focus-table__detail" aria-hidden={!open} style={{ "--ft-o": falloff(i) } as CSSProperties}>
              <td colSpan={colCount}>
                <div className="focus-table__fold" data-open={open || undefined}>
                  <div>{open && <div className="focus-table__c">{detail(row)}</div>}</div>
                </div>
              </td>
            </tr>
          )}
        </FragmentRows>
      );
    });
  };

  const sortable = columns.filter((c) => c.sort);

  return (
    <div
      ref={rootRef}
      className={`focus-table focus-table--${theme}`}
      data-compact={compact || undefined}
      onPointerLeave={() => {
        setHover(null);
        setHotCol(null);
      }}
    >
      <div className="focus-table__bar-top" data-selecting={selectedIds.length ? "" : undefined}>
        <div className="focus-table__selection" aria-live="polite">
          {selectedIds.length ? (
            <>
              <span>
                <b>{selectedIds.length}</b> selected
              </span>
              {bulkActions?.(selectedIds, clear)}
              <button type="button" className="focus-table__link" onClick={clear}>
                Clear
              </button>
            </>
          ) : (
            <span className="focus-table__caption">{caption}</span>
          )}
        </div>
        {compact && sortable.length > 0 && (
          <label className="focus-table__sort">
            <span>Sort</span>
            <select
              value={sort ? `${sort.key}:${sort.dir}` : ""}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":");
                setSort(key ? { key, dir: dir as "asc" | "desc" } : null);
              }}
            >
              <option value="">Default</option>
              {sortable.flatMap((c) => [
                <option key={`${c.key}a`} value={`${c.key}:asc`}>
                  {c.label} ↑
                </option>,
                <option key={`${c.key}d`} value={`${c.key}:desc`}>
                  {c.label} ↓
                </option>,
              ])}
            </select>
          </label>
        )}
      </div>

      {compact ? (
        <div
          className="focus-table__cards"
          role={detail ? "treegrid" : "grid"}
          aria-label={caption}
          aria-busy={status === "loading" || undefined}
          aria-multiselectable="true"
          onKeyDown={onKey}
          onFocus={() => setWithin(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setWithin(false)}
        >
          {body()}
        </div>
      ) : (
        <div className="focus-table__scroll">
          <table
            className="focus-table__table"
            role={detail ? "treegrid" : "grid"}
            aria-label={caption}
            aria-busy={status === "loading" || undefined}
            aria-multiselectable="true"
            aria-rowcount={ids.length + 1}
          >
            <thead>
              <tr role="row" aria-rowindex={1}>
                <th scope="col" className="focus-table__td-check">
                  <label className="focus-table__check">
                    <input
                      ref={headRef}
                      type="checkbox"
                      checked={allSelected}
                      disabled={status !== "ready" || !ids.length}
                      onChange={() => setSelected(allSelected ? new Set() : new Set(ids))}
                      aria-label="Select all rows"
                    />
                    <span aria-hidden="true" />
                  </label>
                </th>
                {columns.map((c) => {
                  const dir = sort?.key === c.key ? sort.dir : null;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      data-align={c.align}
                      data-grow={c.grow || undefined}
                      data-hot={hotCol === c.key && focusIndex !== null ? "" : undefined}
                      aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : c.sort ? "none" : undefined}
                    >
                      {c.sort ? (
                        <button type="button" className="focus-table__sortbtn" onClick={() => cycleSort(c.key)}>
                          {c.label}
                          <svg viewBox="0 0 16 16" data-dir={dir ?? undefined} aria-hidden="true">
                            <path d="M5 6.5L8 3.5l3 3M5 9.5l3 3 3-3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="focus-table__th">{c.label}</span>
                      )}
                    </th>
                  );
                })}
                {detail && (
                  <th scope="col">
                    <span className="focus-table__sr">Expand</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody
              onKeyDown={onKey}
              onFocus={() => setWithin(true)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setWithin(false)}
            >
              {body()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FragmentRows({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
