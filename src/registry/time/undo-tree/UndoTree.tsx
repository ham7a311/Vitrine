"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { commit as commitTo, create, goTo as goToNode, lanes, path, redo as redoIn, route, undo as undoIn, type History } from "./tree";
import "./undo-tree.css";

export type { History, HistoryNode } from "./tree";

export type UndoTreeStep<T> = { value: T; label: string } | "undo";
/**
 * History you can branch. `commit` records a state (repeats of one label
 * within `mergeMs` merge, so typing is one step); undo then change keeps
 * the old future as a branch.
 */
export function useUndoTree<T>(initial: T, { mergeMs = 900, steps = [] as UndoTreeStep<T>[] } = {}) {
  const [history, setHistory] = useState<History<T>>(() => steps.reduce<History<T>>((h, s, i) => (s === "undo" ? undoIn(h) : commitTo(h, s.value, s.label, i * 10_000)), create(initial)));
  const commit = useCallback((value: T, label: string) => setHistory((h) => commitTo(h, value, label, Date.now(), mergeMs)), [mergeMs]);
  const undo = useCallback(() => setHistory(undoIn), []);
  const redo = useCallback(() => setHistory(redoIn), []);
  const goTo = useCallback((id: number) => setHistory((h) => goToNode(h, id)), []);
  const cur = history.nodes[history.current];
  return { history, value: cur.value, commit, undo, redo, goTo, canUndo: cur.parent !== null, canRedo: cur.children.length > 0 };
}

export type UndoTreeProps<T> = {
  history: History<T>;
  onSelect: (id: number) => void;
  /** Shown while a state is hovered or focused, before it's restored. */
  renderPreview?: (value: T) => ReactNode;
  label?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const ROW = 34, LANE = 22, PAD = 14, R = 5;

/**
 * Undo Tree
 * Every state you've been through, drawn as a branching line. The path to
 * where you are is inked, abandoned futures stay in pencil, and any of them
 * can be previewed and restored.
 */
export function UndoTree<T>({ history, onSelect, renderPreview, label = "History", theme = "light", motion = true, className = "" }: UndoTreeProps<T>) {
  const id = useId();
  const { nodes, current } = history;
  const lane = useMemo(() => lanes(history), [history]);
  const live = useMemo(() => new Set(path(history, current)), [history, current]);
  const width = PAD * 2 + (Math.max(...lane) + 1) * LANE;
  const [focus, setFocus] = useState(current);
  const [peek, setPeek] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const rows = useRef(new Map<number, HTMLLIElement>());
  const ring = useRef<SVGCircleElement>(null);
  const prev = useRef(current);
  const known = useRef(nodes.length);

  const x = (n: number) => PAD + lane[n] * LANE + LANE / 2;
  const y = (n: number) => n * ROW + ROW / 2;

  // The current-state ring travels the branches to its new place instead of jumping.
  useEffect(() => {
    const from = prev.current;
    prev.current = current;
    setFocus(current);
    const el = ring.current;
    if (!el || from === current || from >= nodes.length || !motion || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const via = route(history, from, current);
    if (via.length < 2) return;
    el.animate(via.map((n) => ({ transform: `translate(${x(n)}px, ${y(n)}px)` })), { duration: Math.min(900, 160 + via.length * 70), easing: "cubic-bezier(.2,.8,.2,1)" });
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { known.current = nodes.length; }, [nodes.length]);
  const fresh = (n: number) => n >= known.current;

  const edge = (n: number) => {
    const p = nodes[n].parent!;
    if (lane[p] === lane[n]) return `M${x(p)} ${y(p)}V${y(n)}`;
    const mid = y(p) + ROW / 2;
    return `M${x(p)} ${y(p)}V${mid - 8}Q${x(p)} ${mid} ${x(p) + 8} ${mid}H${x(n) - 8}Q${x(n)} ${mid} ${x(n)} ${mid + 8}V${y(n)}`;
  };

  const restore = (n: number) => {
    if (n === current) return;
    onSelect(n);
    setMessage(`Restored step ${n}: ${nodes[n].label}.`);
  };
  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const node = nodes[focus];
    let to: number | undefined;
    if (e.key === "ArrowUp") to = node.parent ?? undefined;
    else if (e.key === "ArrowDown") to = node.next ?? node.children[0];
    else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const sib = node.parent === null ? [0] : nodes[node.parent].children;
      to = sib[sib.indexOf(focus) + (e.key === "ArrowLeft" ? -1 : 1)];
    } else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = current;
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); restore(focus); return; }
    if (to !== undefined) { e.preventDefault(); setFocus(to); setPeek(to); rows.current.get(to)?.focus(); }
  };

  const shown = peek ?? null;

  return (
    <div className={`utree utree--${theme} ${className}`} data-motion={motion ? undefined : "off"}>
      <p id={`${id}-l`} className="utree__label">{label}<span>{nodes.length} states · {Math.max(...lane) + 1} {Math.max(...lane) ? "branches" : "branch"}</span></p>
      <div className="utree__scroll">
        <div className="utree__grid" style={{ height: nodes.length * ROW }}>
          <svg className="utree__svg" width={width} height={nodes.length * ROW} aria-hidden="true">
            {nodes.slice(1).map((n) => (
              <path key={n.id} d={edge(n.id)} className="utree__edge" data-live={live.has(n.id) || undefined} data-fresh={fresh(n.id) || undefined} pathLength={1} />
            ))}
            {nodes.map((n) => (
              <circle key={n.id} cx={x(n.id)} cy={y(n.id)} r={R} className="utree__node" data-live={live.has(n.id) || undefined} data-peek={shown === n.id || undefined} />
            ))}
            <circle ref={ring} r={R + 4} className="utree__ring" style={{ transform: `translate(${x(current)}px, ${y(current)}px)` }} />
          </svg>
          <ul className="utree__rows" role="tree" aria-labelledby={`${id}-l`} onKeyDown={onKey} style={{ paddingLeft: width }}>
            {nodes.map((n) => (
              <li
                key={n.id}
                ref={(el) => { if (el) rows.current.set(n.id, el); else rows.current.delete(n.id); }}
                role="treeitem"
                aria-level={path(history, n.id).length}
                aria-selected={n.id === current}
                aria-current={n.id === current ? "step" : undefined}
                tabIndex={n.id === focus ? 0 : -1}
                className="utree__row"
                data-live={live.has(n.id) || undefined}
                data-current={n.id === current || undefined}
                onFocus={() => { setFocus(n.id); setPeek(n.id); }}
                onBlur={() => setPeek((p) => (p === n.id ? null : p))}
                onPointerEnter={() => setPeek(n.id)}
                onPointerLeave={() => setPeek((p) => (p === n.id ? null : p))}
                onClick={() => restore(n.id)}
              >
                <span className="utree__step">{n.id}</span>
                <span className="utree__name">{n.label}</span>
                {n.id === current ? <span className="utree__tag">Now</span> : !live.has(n.id) && n.children.length === 0 ? <span className="utree__tag utree__tag--alt">Branch end</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {renderPreview && (
        <div className="utree__preview" data-on={shown !== null && shown !== current ? true : undefined} aria-hidden="true">
          <span className="utree__preview-label">{shown !== null && shown !== current ? `Step ${shown} · click or Enter to restore` : "Hover a step to preview it"}</span>
          {shown !== null && shown !== current && <div className="utree__preview-body">{renderPreview(nodes[shown].value)}</div>}
        </div>
      )}
      <p className="utree__sr" aria-live="polite">{message}</p>
    </div>
  );
}
