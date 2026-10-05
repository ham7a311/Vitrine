"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./board-view.css";

export type PillColor = "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";
export type BoardColumn = { id: string; label: string; color: PillColor };
export type BoardCard = {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  /** ISO date, e.g. "2026-10-14". */
  due?: string;
  tags?: { label: string; color: PillColor }[];
};
export type BoardViewProps = {
  columns: BoardColumn[];
  defaultCards: BoardCard[];
  onChange?: (cards: BoardCard[]) => void;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

type Drag = { id: string; x: number; y: number; ox: number; oy: number; w: number; column: string; index: number };
const uid = () => Math.random().toString(36).slice(2, 9);
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const HUES: PillColor[] = ["blue", "green", "purple", "orange", "pink", "brown"];
const hueOf = (name: string) => HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

/**
 * Board View
 * A database grouped by status. Cards carry a title, an owner, a date and
 * coloured tags; drag one into another column (a blue line shows where it
 * will land) or move it from the keyboard with Shift and the arrows.
 */
export function BoardView({ columns, defaultCards, onChange, locale, theme = "light", className = "" }: BoardViewProps) {
  const id = useId();
  const [cards, setCards] = useState(defaultCards);
  const [drag, setDragState] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const setDrag = (d: Drag | null) => { dragRef.current = d; setDragState(d); };
  const [adding, setAdding] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const lists = useRef(new Map<string, HTMLOListElement>());
  const before = useRef<Map<string, DOMRect> | null>(null);
  const press = useRef<{ id: string; x: number; y: number; pointer: number; rect: DOMRect } | null>(null);
  const focusAfter = useRef<string | null>(null);
  const date = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" });

  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (focusAfter.current) { nodes.current.get(focusAfter.current)?.focus({ preventScroll: false }); focusAfter.current = null; }
    if (!prev || reduced()) return;
    nodes.current.forEach((el, key) => {
      const was = prev.get(key);
      if (!was) return;
      const r = el.getBoundingClientRect();
      const dx = was.left - r.left, dy = was.top - r.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }, [cards]);

  const commit = (next: BoardCard[]) => {
    before.current = new Map([...nodes.current].map(([k, el]) => [k, el.getBoundingClientRect()]));
    setCards(next);
    onChange?.(next);
  };
  const inColumn = (col: string, list = cards) => list.filter((c) => c.status === col);
  const label = (col: string) => columns.find((c) => c.id === col)?.label ?? col;

  /** Move a card to a column at an index within that column. */
  const place = (cardId: string, column: string, index: number) => {
    const card = cards.find((c) => c.id === cardId)!;
    const rest = cards.filter((c) => c.id !== cardId);
    const target = inColumn(column, rest);
    const anchor = target[index];
    const moved = { ...card, status: column };
    const at = anchor ? rest.indexOf(anchor) : (target.length ? rest.indexOf(target[target.length - 1]) + 1 : rest.length);
    rest.splice(at, 0, moved);
    commit(rest);
    setAnnounce(`“${card.title}” moved to ${label(column)}, position ${Math.min(index, target.length) + 1} of ${target.length + 1}.`);
  };

  const onCardKey = (card: BoardCard, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const colIndex = columns.findIndex((c) => c.id === card.status);
    const siblings = inColumn(card.status);
    const index = siblings.indexOf(card);
    const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!arrows.includes(e.key)) return;
    e.preventDefault();
    if (e.shiftKey) {
      focusAfter.current = card.id;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const next = columns[colIndex + (e.key === "ArrowLeft" ? -1 : 1)];
        if (next) place(card.id, next.id, Math.min(index, inColumn(next.id).length));
      } else {
        const to = index + (e.key === "ArrowUp" ? -1 : 1);
        if (to >= 0 && to < siblings.length) place(card.id, card.status, to);
      }
      return;
    }
    // Plain arrows move focus around the board.
    let target: BoardCard | undefined;
    if (e.key === "ArrowUp") target = siblings[index - 1];
    else if (e.key === "ArrowDown") target = siblings[index + 1];
    else {
      for (let c = colIndex + (e.key === "ArrowLeft" ? -1 : 1); c >= 0 && c < columns.length && !target; c += e.key === "ArrowLeft" ? -1 : 1) {
        const col = inColumn(columns[c].id);
        target = col[Math.min(index, col.length - 1)];
      }
    }
    if (target) nodes.current.get(target.id)?.focus();
  };

  // Pointer drag: the card follows the pointer as a fixed ghost; the target is the column under it.
  const dropTarget = (x: number, y: number, dragged: string) => {
    for (const col of columns) {
      const list = lists.current.get(col.id);
      if (!list) continue;
      const r = list.parentElement!.getBoundingClientRect();
      if (x < r.left || x > r.right) continue;
      const others = inColumn(col.id).filter((c) => c.id !== dragged);
      const index = others.filter((c) => { const n = nodes.current.get(c.id)!.getBoundingClientRect(); return y > n.top + n.height / 2; }).length;
      return { column: col.id, index };
    }
    return null;
  };
  const onPointerDown = (card: BoardCard, e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as Element).closest("button, input, a, select, label")) return;
    press.current = { id: card.id, x: e.clientX, y: e.clientY, pointer: e.pointerId, rect: e.currentTarget.getBoundingClientRect() };
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p || p.pointer !== e.pointerId) return;
      if (!dragRef.current && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 5) return;
      e.preventDefault();
      const target = dropTarget(e.clientX, e.clientY, p.id);
      const d = dragRef.current;
      setDrag({ id: p.id, x: e.clientX, y: e.clientY, ox: p.x - p.rect.left, oy: p.y - p.rect.top, w: p.rect.width, column: target?.column ?? d?.column ?? cards.find((c) => c.id === p.id)!.status, index: target?.index ?? d?.index ?? 0 });
    };
    const up = (e: PointerEvent) => {
      const p = press.current;
      if (!p || p.pointer !== e.pointerId) return;
      press.current = null;
      const d = dragRef.current;
      setDrag(null);
      if (d) place(d.id, d.column, d.index);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  });

  const addCard = (column: string, title: string) => {
    setAdding(null);
    const t = title.trim();
    if (!t) return;
    const card: BoardCard = { id: uid(), title: t, status: column };
    commit([...cards, card]);
    setAnnounce(`Added “${t}” to ${label(column)}.`);
  };

  const dragged = drag && cards.find((c) => c.id === drag.id);

  const renderCard = (card: BoardCard, ghost = false) => (
    <>
      <p className="bview__title">{card.title}</p>
      {(card.assignee || card.due) && (
        <p className="bview__meta">
          {card.assignee && <span className="bview__person"><span className="bview__avatar" data-color={hueOf(card.assignee)} aria-hidden="true">{initials(card.assignee)}</span>{card.assignee}</span>}
          {card.due && <time dateTime={card.due}>{date.format(new Date(`${card.due}T00:00:00Z`))}</time>}
        </p>
      )}
      {card.tags && card.tags.length > 0 && <p className="bview__tags">{card.tags.map((t) => <span key={t.label} className="bview__pill" data-color={t.color}>{t.label}</span>)}</p>}
      {!ghost && (
        <label className="bview__move">
          <span className="bview__sr">Move “{card.title}” to</span>
          <select value={card.status} onChange={(e) => { focusAfter.current = card.id; place(card.id, e.target.value, inColumn(e.target.value).length); }}>
            {columns.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
      )}
    </>
  );

  return (
    <div className={`bview bview--${theme} ${className}`} data-dragging={drag ? "" : undefined}>
      <p id={`${id}-how`} className="bview__sr">Arrow keys move between cards. Shift with Left or Right moves the card to another status; Shift with Up or Down reorders it.</p>
      <div className="bview__board">
        {columns.map((col) => {
          const list = inColumn(col.id);
          const lineAt = drag?.column === col.id ? drag.index : -1;
          const visible = list.filter((c) => c.id !== drag?.id);
          return (
            <section key={col.id} className="bview__column" aria-labelledby={`${id}-${col.id}`} data-over={drag?.column === col.id || undefined}>
              <h3 id={`${id}-${col.id}`} className="bview__head">
                <span className="bview__pill bview__pill--status" data-color={col.color}><span aria-hidden="true" className="bview__dot" />{col.label}</span>
                <span className="bview__count">{list.length}<span className="bview__sr"> cards</span></span>
              </h3>
              <ol ref={(el) => { if (el) lists.current.set(col.id, el); else lists.current.delete(col.id); }} className="bview__cards">
                {list.map((card) => {
                  const i = visible.indexOf(card);
                  return (
                    <li key={card.id} data-line={i === lineAt && i >= 0 || undefined}>
                      <div
                        ref={(el) => { if (el) nodes.current.set(card.id, el); else nodes.current.delete(card.id); }}
                        className="bview__card"
                        tabIndex={0}
                        aria-describedby={`${id}-how`}
                        data-lifted={drag?.id === card.id || undefined}
                        onKeyDown={(e) => onCardKey(card, e)}
                        onPointerDown={(e) => onPointerDown(card, e)}
                      >
                        {renderCard(card)}
                      </div>
                    </li>
                  );
                })}
                {lineAt >= 0 && lineAt >= visible.length && <li className="bview__end" data-line="" aria-hidden="true" />}
              </ol>
              {adding === col.id ? (
                <input
                  className="bview__new"
                  autoFocus
                  aria-label={`New card in ${col.label}`}
                  placeholder="Type a name, Enter to add"
                  onKeyDown={(e) => { if (e.key === "Enter") addCard(col.id, e.currentTarget.value); if (e.key === "Escape") setAdding(null); }}
                  onBlur={(e) => addCard(col.id, e.currentTarget.value)}
                />
              ) : (
                <button type="button" className="bview__add" onClick={() => setAdding(col.id)}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg> New<span className="bview__sr"> card in {col.label}</span>
                </button>
              )}
            </section>
          );
        })}
      </div>
      {drag && dragged && (
        <div className="bview__ghost bview__card" aria-hidden="true" style={{ "--gx": `${drag.x - drag.ox}px`, "--gy": `${drag.y - drag.oy}px`, width: drag.w } as CSSProperties}>
          {renderCard(dragged, true)}
        </div>
      )}
      <p className="bview__sr" aria-live="polite">{announce}</p>
    </div>
  );
}
