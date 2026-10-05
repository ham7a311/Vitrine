"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import "./insert-menu.css";

export type BlockType = "text" | "h1" | "h2" | "todo" | "bullet" | "quote" | "callout" | "divider";
export type Block = { id: string; type: BlockType; text: string; checked?: boolean };

export type InsertMenuProps = {
  defaultBlocks: Block[];
  onChange?: (blocks: Block[]) => void;
  theme?: "light" | "dark";
  className?: string;
};

type Option = { type: BlockType; name: string; hint: string; glyph: string; keywords: string };
const OPTIONS: Option[] = [
  { type: "text", name: "Text", hint: "Plain writing", glyph: "Aa", keywords: "paragraph plain" },
  { type: "h1", name: "Heading 1", hint: "Large section heading", glyph: "H1", keywords: "title big h1" },
  { type: "h2", name: "Heading 2", hint: "Medium section heading", glyph: "H2", keywords: "subtitle h2" },
  { type: "todo", name: "To-do", hint: "Track a task with a checkbox", glyph: "☐", keywords: "checkbox task check" },
  { type: "bullet", name: "Bulleted list", hint: "A simple list", glyph: "•", keywords: "list ul dot" },
  { type: "quote", name: "Quote", hint: "Set a passage apart", glyph: "❝", keywords: "blockquote citation" },
  { type: "callout", name: "Callout", hint: "Make a note stand out", glyph: "✳", keywords: "note tip info" },
  { type: "divider", name: "Divider", hint: "Separate sections", glyph: "—", keywords: "line rule hr separator" },
];
const PLACEHOLDER: Partial<Record<BlockType, string>> = { h1: "Heading 1", h2: "Heading 2", todo: "To-do", bullet: "List item", quote: "Quote", callout: "Note" };
const uid = () => Math.random().toString(36).slice(2, 9);

/** Ranks options by name prefix, then word prefix, then keyword match. */
function filter(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return OPTIONS;
  return OPTIONS.map((o) => {
    const name = o.name.toLowerCase();
    const score = name.startsWith(q) ? 3 : name.split(/[\s-]/).some((w) => w.startsWith(q)) ? 2 : o.keywords.includes(q) ? 1 : 0;
    return { o, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.o);
}

/**
 * Insert Menu
 * A page of plain-text blocks. Type "/" at the start of a line or after a
 * space and a menu of block types opens under the line; keep typing to
 * filter, then Enter turns the line into that block.
 */
export function InsertMenu({ defaultBlocks, onChange, theme = "light", className = "" }: InsertMenuProps) {
  const id = useId();
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [menu, setMenu] = useState<{ blockId: string; slash: number; query: string } | null>(null);
  const [active, setActive] = useState(0);
  const fields = useRef(new Map<string, HTMLTextAreaElement>());
  const pendingFocus = useRef<{ id: string; caret: number | "end" } | null>(null);
  const options = useMemo(() => (menu ? filter(menu.query) : []), [menu]);

  const commit = (next: Block[]) => { setBlocks(next); onChange?.(next); };

  // Resize every field to its content, and place the caret after structural edits.
  useLayoutEffect(() => {
    fields.current.forEach((el) => { el.style.height = "0px"; el.style.height = `${el.scrollHeight}px`; });
    const p = pendingFocus.current;
    if (p) {
      const el = fields.current.get(p.id);
      if (el) { el.focus(); const at = p.caret === "end" ? el.value.length : p.caret; el.setSelectionRange(at, at); }
      pendingFocus.current = null;
    }
  });
  useEffect(() => setActive(0), [menu?.query]);

  const update = (blockId: string, patch: Partial<Block>) => commit(blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)));

  const onInput = (block: Block, el: HTMLTextAreaElement) => {
    const text = el.value;
    const caret = el.selectionStart;
    let next = menu;
    if (menu?.blockId === block.id) {
      const query = text.slice(menu.slash + 1, caret);
      next = caret <= menu.slash || text[menu.slash] !== "/" || /\s/.test(query) ? null : { ...menu, query };
    } else if (text[caret - 1] === "/" && (caret === 1 || /\s/.test(text[caret - 2]))) {
      next = { blockId: block.id, slash: caret - 1, query: "" };
    }
    setMenu(next);
    update(block.id, { text });
  };

  const choose = (option: Option) => {
    if (!menu) return;
    const index = blocks.findIndex((b) => b.id === menu.blockId);
    const block = blocks[index];
    const text = block.text.slice(0, menu.slash) + block.text.slice(menu.slash + 1 + menu.query.length);
    const next = [...blocks];
    if (option.type === "divider") {
      const fresh: Block = { id: uid(), type: "text", text: "" };
      const before = text.trim() ? [{ ...block, text }] : [];
      next.splice(index, 1, ...before, { id: uid(), type: "divider", text: "" }, fresh);
      pendingFocus.current = { id: fresh.id, caret: 0 };
    } else {
      next[index] = { ...block, type: option.type, text, checked: option.type === "todo" ? false : undefined };
      pendingFocus.current = { id: block.id, caret: menu.slash };
    }
    setMenu(null);
    commit(next);
  };

  const onKeyDown = (block: Block, e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (menu?.blockId === block.id) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (options.length) setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        return;
      }
      if ((e.key === "Enter" || e.key === "Tab") && options[active]) { e.preventDefault(); choose(options[active]); return; }
      if (e.key === "Escape") { e.preventDefault(); setMenu(null); return; }
    }
    const index = blocks.findIndex((b) => b.id === block.id);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // An empty list item ends the list, as in most editors.
      if (!block.text && (block.type === "bullet" || block.type === "todo")) { update(block.id, { type: "text", checked: undefined }); return; }
      const caret = el.selectionStart;
      const carry: BlockType = block.type === "bullet" || block.type === "todo" ? block.type : "text";
      const fresh: Block = { id: uid(), type: carry, text: block.text.slice(caret), checked: carry === "todo" ? false : undefined };
      const next = [...blocks];
      next.splice(index, 1, { ...block, text: block.text.slice(0, caret) }, fresh);
      pendingFocus.current = { id: fresh.id, caret: 0 };
      setMenu(null);
      commit(next);
    } else if (e.key === "Backspace" && el.selectionStart === 0 && el.selectionEnd === 0) {
      if (block.type !== "text") { e.preventDefault(); update(block.id, { type: "text", checked: undefined }); return; }
      const above = blocks[index - 1];
      if (!above) return;
      e.preventDefault();
      // Backspace at the start removes a divider above, or joins this line onto the one above.
      if (above.type === "divider") { pendingFocus.current = { id: block.id, caret: 0 }; commit(blocks.filter((b) => b.id !== above.id)); return; }
      pendingFocus.current = { id: above.id, caret: above.text.length };
      commit(blocks.filter((b) => b.id !== block.id).map((b) => (b.id === above.id ? { ...b, text: b.text + block.text } : b)));
    } else if ((e.key === "ArrowUp" && el.selectionStart === 0) || (e.key === "ArrowDown" && el.selectionEnd === el.value.length)) {
      const step = e.key === "ArrowUp" ? -1 : 1;
      let i = index + step;
      while (blocks[i]?.type === "divider") i += step;
      const target = blocks[i] && fields.current.get(blocks[i].id);
      if (target) { e.preventDefault(); target.focus(); const at = step < 0 ? target.value.length : 0; target.setSelectionRange(at, at); }
    }
  };

  const listId = `${id}-menu`;
  const optionId = (i: number) => `${id}-opt-${i}`;

  return (
    <div className={`imenu imenu--${theme} ${className}`}>
      {blocks.map((block) => {
        if (block.type === "divider") return <hr key={block.id} className="imenu__divider" />;
        const open = menu?.blockId === block.id;
        return (
          <div key={block.id} className="imenu__block" data-type={block.type} data-checked={block.checked || undefined}>
            <span className="imenu__marker">
              {block.type === "todo" && <input type="checkbox" aria-label="Done" checked={!!block.checked} onChange={(e) => update(block.id, { checked: e.target.checked })} />}
              {block.type === "callout" && <span aria-hidden="true">✳</span>}
            </span>
            <textarea
              ref={(el) => { if (el) fields.current.set(block.id, el); else fields.current.delete(block.id); }}
              className="imenu__field"
              rows={1}
              value={block.text}
              spellCheck
              placeholder={PLACEHOLDER[block.type] ?? "Write, or press / to insert a block"}
              aria-label={OPTIONS.find((o) => o.type === block.type)?.name ?? "Text"}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? listId : undefined}
              aria-activedescendant={open && options[active] ? optionId(active) : undefined}
              onChange={(e) => onInput(block, e.currentTarget)}
              onKeyDown={(e) => onKeyDown(block, e)}
              onBlur={() => setMenu((m) => (m?.blockId === block.id ? null : m))}
            />
            {open && (
              <div className="imenu__menu">
                <p className="imenu__group" aria-hidden="true">{menu.query ? `Blocks matching “${menu.query}”` : "Basic blocks"}</p>
                <ul id={listId} role="listbox" aria-label="Insert a block">
                  {options.map((o, i) => (
                    <li
                      key={o.type}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      className="imenu__option"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseMove={() => setActive(i)}
                      onClick={() => choose(o)}
                    >
                      <span className="imenu__glyph" aria-hidden="true">{o.glyph}</span>
                      <span className="imenu__name">{o.name}<span className="imenu__hint">{o.hint}</span></span>
                    </li>
                  ))}
                </ul>
                {options.length === 0 && <p className="imenu__empty">No blocks match. Press Esc to keep the text.</p>}
              </div>
            )}
          </div>
        );
      })}
      <p className="imenu__sr" aria-live="polite">{menu ? `${options.length} block types` : ""}</p>
    </div>
  );
}
