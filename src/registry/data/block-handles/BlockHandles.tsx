"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./block-handles.css";

export type HandleBlock = { id: string; text: string; kind?: "text" | "heading" | "todo"; done?: boolean };
export type BlockHandlesProps = {
  defaultBlocks: HandleBlock[];
  onChange?: (blocks: HandleBlock[]) => void;
  theme?: "light" | "dark";
  className?: string;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const preview = (text: string) => (text.length > 40 ? `${text.slice(0, 40)}…` : text || "empty block");

/**
 * Block Handles
 * A document's blocks, each with a gutter that appears on hover or focus: a
 * "+" that inserts a block below, and a ⋮⋮ handle that moves it. Drag the
 * handle and a blue line shows where it will land; or pick it up with the
 * keyboard and walk it with the arrow keys.
 */
export function BlockHandles({ defaultBlocks, onChange, theme = "light", className = "" }: BlockHandlesProps) {
  const id = useId();
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [editing, setEditing] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ id: string; from: number } | null>(null);
  const [drag, setDrag] = useState<{ id: string; dy: number; target: number } | null>(null);
  const [announce, setAnnounce] = useState("");
  const list = useRef<HTMLOListElement>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const handles = useRef(new Map<string, HTMLButtonElement>());
  const before = useRef<Map<string, DOMRect> | null>(null);
  // Moving a focused node in the DOM can blur it; keyboard moves must not drop the block.
  const moving = useRef(false);
  const start = useRef<{ id: string; y: number; pointer: number; mids: number[]; index: number; moved: boolean } | null>(null);

  // FLIP: blocks slide from where they were to where the new order puts them.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev || reduced()) return;
    rows.current.forEach((el, key) => {
      const was = prev.get(key);
      if (!was) return;
      const dy = was.top - el.getBoundingClientRect().top;
      if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }, [blocks]);

  const measure = () => { before.current = new Map([...rows.current].map(([k, el]) => [k, el.getBoundingClientRect()])); };
  const commit = (next: HandleBlock[]) => { measure(); setBlocks(next); onChange?.(next); };
  const moveTo = (blockId: string, to: number) => {
    const from = blocks.findIndex((b) => b.id === blockId);
    if (from < 0 || to === from) return blocks;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next);
    return next;
  };

  useEffect(() => { if (picked) handles.current.get(picked.id)?.focus(); moving.current = false; }, [blocks, picked]);

  const onHandleKey = (block: HandleBlock, e: KeyboardEvent<HTMLButtonElement>) => {
    const index = blocks.findIndex((b) => b.id === block.id);
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (picked?.id === block.id) { setPicked(null); setAnnounce(`Dropped “${preview(block.text)}” at position ${index + 1} of ${blocks.length}.`); }
      else { setPicked({ id: block.id, from: index }); setAnnounce(`Picked up “${preview(block.text)}”. Use the arrow keys to move it, Space to drop, Escape to cancel.`); }
    } else if (picked?.id === block.id && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const to = Math.max(0, Math.min(blocks.length - 1, index + (e.key === "ArrowUp" ? -1 : 1)));
      if (to !== index) { moving.current = true; moveTo(block.id, to); setAnnounce(`Position ${to + 1} of ${blocks.length}.`); }
    } else if (picked?.id === block.id && e.key === "Escape") {
      e.preventDefault();
      moving.current = true;
      moveTo(block.id, picked.from);
      setPicked(null);
      requestAnimationFrame(() => handles.current.get(block.id)?.focus());
      setAnnounce(`Move cancelled. “${preview(block.text)}” is back at position ${picked.from + 1}.`);
    }
  };

  const onPointerDown = (block: HandleBlock, e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const ordered = blocks.map((b) => rows.current.get(b.id)!.getBoundingClientRect());
    start.current = { id: block.id, y: e.clientY, pointer: e.pointerId, mids: ordered.map((r) => r.top + r.height / 2), index: blocks.indexOf(block), moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s || s.pointer !== e.pointerId) return;
    const dy = e.clientY - s.y;
    if (!s.moved && Math.abs(dy) < 4) return;
    s.moved = true;
    // The gap the pointer is over, counting the dragged block as already removed.
    let target = s.mids.filter((m, i) => i !== s.index && e.clientY > m).length;
    target = Math.max(0, Math.min(blocks.length - 1, target));
    setDrag({ id: s.id, dy, target });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s || s.pointer !== e.pointerId) return;
    start.current = null;
    if (drag && s.moved) {
      const block = blocks[s.index];
      moveTo(drag.id, drag.target);
      setAnnounce(`Moved “${preview(block.text)}” to position ${drag.target + 1} of ${blocks.length}.`);
    }
    setDrag(null);
  };

  const insertBelow = (index: number) => {
    const fresh = { id: uid(), text: "", kind: "text" as const };
    const next = [...blocks];
    next.splice(index + 1, 0, fresh);
    commit(next);
    setEditing(fresh.id);
  };
  const finishEdit = (blockId: string, text: string, cancel = false) => {
    if (editing !== blockId) return;
    setEditing(null);
    const trimmed = text.trim();
    if (!trimmed || cancel) { commit(blocks.filter((b) => b.id !== blockId)); return; }
    commit(blocks.map((b) => (b.id === blockId ? { ...b, text: trimmed } : b)));
  };

  // Where the drop line sits: above the block that will follow the dragged one.
  const lineIndex = drag ? (drag.target >= blocks.findIndex((b) => b.id === drag.id) ? drag.target + 1 : drag.target) : -1;

  return (
    <div className={`bkh bkh--${theme} ${className}`} data-dragging={drag ? "" : undefined}>
      <p id={`${id}-how`} className="bkh__sr">Press Space to pick up a block, the arrow keys to move it, Space to drop it, or Escape to cancel.</p>
      <ol ref={list} className="bkh__list" aria-label="Blocks">
        {blocks.map((block, index) => (
          <li
            key={block.id}
            ref={(el) => { if (el) rows.current.set(block.id, el); else rows.current.delete(block.id); }}
            className="bkh__row"
            data-kind={block.kind ?? "text"}
            data-picked={picked?.id === block.id || undefined}
            data-dragged={drag?.id === block.id || undefined}
            data-line-before={lineIndex === index || undefined}
            data-line-after={lineIndex === blocks.length && index === blocks.length - 1 || undefined}
            style={drag?.id === block.id ? { transform: `translateY(${drag.dy}px)` } : undefined}
          >
            <span className="bkh__gutter">
              <button type="button" className="bkh__add" aria-label={`Add a block below “${preview(block.text)}”`} onClick={() => insertBelow(index)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
              </button>
              <button
                type="button"
                ref={(el) => { if (el) handles.current.set(block.id, el); else handles.current.delete(block.id); }}
                className="bkh__handle"
                aria-label={`Move “${preview(block.text)}”, position ${index + 1} of ${blocks.length}`}
                aria-describedby={`${id}-how`}
                aria-pressed={picked?.id === block.id}
                onKeyDown={(e) => onHandleKey(block, e)}
                onBlur={() => { if (picked?.id === block.id && !moving.current) setPicked(null); }}
                onPointerDown={(e) => onPointerDown(block, e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <svg viewBox="0 0 10 16" aria-hidden="true">{[3, 8, 13].map((y) => <g key={y}><circle cx="2.5" cy={y} r="1.3" /><circle cx="7.5" cy={y} r="1.3" /></g>)}</svg>
              </button>
            </span>
            <div className="bkh__content">
              {block.kind === "todo" && <input type="checkbox" aria-label={`Done: ${block.text}`} checked={!!block.done} onChange={(e) => commit(blocks.map((b) => (b.id === block.id ? { ...b, done: e.target.checked } : b)))} />}
              {editing === block.id ? (
                <input
                  className="bkh__edit"
                  autoFocus
                  aria-label="New block"
                  placeholder="Write something, Enter to keep it"
                  defaultValue={block.text}
                  onKeyDown={(e) => { if (e.key === "Enter") finishEdit(block.id, e.currentTarget.value); if (e.key === "Escape") finishEdit(block.id, "", true); }}
                  onBlur={(e) => finishEdit(block.id, e.currentTarget.value)}
                />
              ) : block.kind === "heading" ? <h3 className="bkh__text">{block.text}</h3> : <p className="bkh__text">{block.text}</p>}
            </div>
          </li>
        ))}
      </ol>
      <p className="bkh__sr" aria-live="assertive">{announce}</p>
    </div>
  );
}
