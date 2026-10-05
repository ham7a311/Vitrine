"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import "./page-header.css";

export type PageColor = "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";
export type PageOption = { id: string; label: string; color: PageColor };
export type PageCover = { id: string; label: string; color?: string; image?: string };
export type PageState = {
  icon: string;
  title: string;
  cover: string;
  /** Vertical focus of an image cover, 0–100. */
  coverY: number;
  status: string;
  owner: string;
  due: string;
  tags: string[];
};
export type PageHeaderProps = {
  defaultValue: PageState;
  covers: PageCover[];
  statuses: PageOption[];
  people: string[];
  tagOptions: PageOption[];
  icons?: string[];
  onChange?: (page: PageState) => void;
  theme?: "light" | "dark";
  className?: string;
};

const COLORS: PageColor[] = ["blue", "green", "orange", "purple", "pink", "yellow", "brown", "red", "gray"];
const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/** A small listbox popover: focus moves into it, arrows choose, Escape returns focus to the trigger. */
function Picker({ idBase, label, options, selected, onPick, onClose, render }: { idBase: string; label: string; options: string[]; selected?: string; onPick: (v: string) => void; onClose: () => void; render: (v: string) => ReactNode }) {
  const [active, setActive] = useState(Math.max(0, options.indexOf(selected ?? "")));
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => { list.current?.focus(); }, []);
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(options[active]); }
    else if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); onClose(); }
  };
  const optionId = (i: number) => `${idBase}-${label.replace(/\W/g, "")}-${i}`;
  return (
    <ul ref={list} className="phead__picker" role="listbox" aria-label={label} tabIndex={-1} aria-activedescendant={optionId(active)} onKeyDown={key} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose(); }}>
      {options.map((o, i) => (
        <li key={o} id={optionId(i)} role="option" aria-selected={o === selected} data-active={i === active || undefined} onMouseDown={(e) => e.preventDefault()} onMouseMove={() => setActive(i)} onClick={() => onPick(o)}>
          {render(o)}
          {o === selected && <svg className="phead__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>}
        </li>
      ))}
    </ul>
  );
}

/**
 * Page Header
 * The top of a document: a cover you can change and reposition, an emoji
 * icon that overlaps it, an editable title, and property rows — status,
 * owner, due date and tags — each edited in place with a small picker.
 */
export function PageHeader({ defaultValue, covers, statuses, people, tagOptions, icons = ["🗺️", "📐", "🧭", "🌙", "🏔️", "📦", "🧪", "🪴"], onChange, theme = "light", className = "" }: PageHeaderProps) {
  const id = useId();
  const [page, setPage] = useState(defaultValue);
  const [open, setOpen] = useState<null | "cover" | "icon" | "status" | "owner" | "tags">(null);
  const [tagList, setTagList] = useState(tagOptions);
  const [tagQuery, setTagQuery] = useState("");
  const [reposition, setReposition] = useState<{ from: number } | null>(null);
  const triggers = useRef(new Map<string, HTMLElement>());
  const coverRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const dragY = useRef<{ y: number; start: number; pointer: number } | null>(null);
  const cover = covers.find((c) => c.id === page.cover) ?? covers[0];
  const status = statuses.find((s) => s.id === page.status);

  const set = (patch: Partial<PageState>) => { const next = { ...page, ...patch }; setPage(next); onChange?.(next); };
  const close = (which = open) => { setOpen(null); if (which) requestAnimationFrame(() => triggers.current.get(which)?.focus()); };
  const ref = (key: string) => (el: HTMLElement | null) => { if (el) triggers.current.set(key, el); else triggers.current.delete(key); };

  useEffect(() => {
    const el = titleRef.current;
    if (el) { el.style.height = "0px"; el.style.height = `${el.scrollHeight}px`; }
  }, [page.title]);

  // Close popovers on an outside press.
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!(e.target as Element).closest(`[data-pop="${id}"]`)) setOpen(null); };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open, id]);

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!reposition) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragY.current = { y: e.clientY, start: page.coverY, pointer: e.pointerId };
  };
  const moveDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragY.current;
    if (!d || d.pointer !== e.pointerId || !coverRef.current) return;
    const h = coverRef.current.getBoundingClientRect().height;
    set({ coverY: Math.round(Math.min(100, Math.max(0, d.start - ((e.clientY - d.y) / h) * 100))) });
  };
  const coverKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!reposition) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); set({ coverY: Math.min(100, Math.max(0, page.coverY + (e.key === "ArrowUp" ? 5 : -5))) }); }
    if (e.key === "Enter") { e.preventDefault(); setReposition(null); }
    if (e.key === "Escape") { e.preventDefault(); set({ coverY: reposition.from }); setReposition(null); }
  };

  const toggleTag = (label: string) => set({ tags: page.tags.includes(label) ? page.tags.filter((t) => t !== label) : [...page.tags, label] });
  const createTag = () => {
    const label = tagQuery.trim();
    if (!label) return;
    if (!tagList.some((t) => t.label.toLowerCase() === label.toLowerCase())) setTagList((l) => [...l, { id: label, label, color: COLORS[l.length % COLORS.length] }]);
    if (!page.tags.includes(label)) set({ tags: [...page.tags, label] });
    setTagQuery("");
  };
  const tagColor = (label: string) => tagList.find((t) => t.label === label)?.color ?? "gray";
  const matches = tagList.filter((t) => t.label.toLowerCase().includes(tagQuery.trim().toLowerCase()));

  return (
    <header className={`phead phead--${theme} ${className}`}>
      <div
        ref={coverRef}
        className="phead__cover"
        data-repositioning={reposition ? "" : undefined}
        style={cover.image ? { backgroundImage: `url("${cover.image}")`, backgroundPosition: `50% ${page.coverY}%` } : { background: cover.color }}
        tabIndex={reposition ? 0 : -1}
        role={reposition ? "slider" : undefined}
        aria-label={reposition ? "Cover position" : undefined}
        aria-valuemin={reposition ? 0 : undefined}
        aria-valuemax={reposition ? 100 : undefined}
        aria-valuenow={reposition ? page.coverY : undefined}
        aria-valuetext={reposition ? `Showing the image at ${page.coverY}% of its height` : undefined}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => { dragY.current = null; }}
        onKeyDown={coverKey}
      >
        {reposition && <p className="phead__hint">Drag image to reposition · ↑ ↓ · Enter to save</p>}
        <div className="phead__cover-tools" data-pop={id}>
          {reposition ? (
            <>
              <button type="button" onClick={() => setReposition(null)}>Save position</button>
              <button type="button" onClick={() => { set({ coverY: reposition.from }); setReposition(null); }}>Cancel</button>
            </>
          ) : (
            <>
              <button type="button" ref={ref("cover")} aria-expanded={open === "cover"} onClick={() => setOpen(open === "cover" ? null : "cover")}>Change cover</button>
              {cover.image && <button type="button" onClick={() => { setReposition({ from: page.coverY }); requestAnimationFrame(() => coverRef.current?.focus()); }}>Reposition</button>}
            </>
          )}
          {open === "cover" && (
            <Picker idBase={id} label="Cover" options={covers.map((c) => c.id)} selected={page.cover} onPick={(v) => { set({ cover: v, coverY: 50 }); close("cover"); }} onClose={() => close("cover")}
              render={(v) => { const c = covers.find((x) => x.id === v)!; return <><span className="phead__swatch" style={c.image ? { backgroundImage: `url("${c.image}")` } : { background: c.color }} />{c.label}</>; }} />
          )}
        </div>
      </div>

      <div className="phead__body">
        <div className="phead__icon-wrap" data-pop={id}>
          <button type="button" ref={ref("icon")} className="phead__icon" aria-label={`Page icon ${page.icon}, change`} aria-expanded={open === "icon"} onClick={() => setOpen(open === "icon" ? null : "icon")}>{page.icon}</button>
          {open === "icon" && (
            <Picker idBase={id} label="Icon" options={icons} selected={page.icon} onPick={(v) => { set({ icon: v }); close("icon"); }} onClose={() => close("icon")} render={(v) => <span className="phead__emoji">{v}</span>} />
          )}
        </div>

        <textarea ref={titleRef} className="phead__title" rows={1} value={page.title} placeholder="Untitled" aria-label="Page title"
          onChange={(e) => set({ title: e.target.value.replace(/\n/g, "") })}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); triggers.current.get("status")?.focus(); } }} />

        <dl className="phead__props">
          <div className="phead__row" data-pop={id}>
            <dt id={`${id}-status`}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></svg>Status</dt>
            <dd>
              <button type="button" ref={ref("status")} className="phead__value" aria-labelledby={`${id}-status ${id}-status-v`} aria-expanded={open === "status"} onClick={() => setOpen(open === "status" ? null : "status")}>
                <span id={`${id}-status-v`} className="phead__pill phead__pill--status" data-color={status?.color ?? "gray"}><span className="phead__dot" aria-hidden="true" />{status?.label ?? "Empty"}</span>
              </button>
              {open === "status" && <Picker idBase={id} label="Status" options={statuses.map((s) => s.id)} selected={page.status} onPick={(v) => { set({ status: v }); close("status"); }} onClose={() => close("status")}
                render={(v) => { const s = statuses.find((x) => x.id === v)!; return <span className="phead__pill phead__pill--status" data-color={s.color}><span className="phead__dot" aria-hidden="true" />{s.label}</span>; }} />}
            </dd>
          </div>
          <div className="phead__row" data-pop={id}>
            <dt id={`${id}-owner`}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.5" r="2.5" /><path d="M3 13.5c.6-2.5 2.6-4 5-4s4.4 1.5 5 4" /></svg>Owner</dt>
            <dd>
              <button type="button" ref={ref("owner")} className="phead__value" aria-labelledby={`${id}-owner ${id}-owner-v`} aria-expanded={open === "owner"} onClick={() => setOpen(open === "owner" ? null : "owner")}>
                <span id={`${id}-owner-v`} className="phead__person">{page.owner ? <><span className="phead__avatar" aria-hidden="true">{initials(page.owner)}</span>{page.owner}</> : <span className="phead__empty">Empty</span>}</span>
              </button>
              {open === "owner" && <Picker idBase={id} label="Owner" options={people} selected={page.owner} onPick={(v) => { set({ owner: v }); close("owner"); }} onClose={() => close("owner")}
                render={(v) => <span className="phead__person"><span className="phead__avatar" aria-hidden="true">{initials(v)}</span>{v}</span>} />}
            </dd>
          </div>
          <div className="phead__row">
            <dt><label htmlFor={`${id}-due`}><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></svg>Due</label></dt>
            <dd><input id={`${id}-due`} className="phead__date" type="date" value={page.due} onChange={(e) => set({ due: e.target.value })} /></dd>
          </div>
          <div className="phead__row" data-pop={id}>
            <dt id={`${id}-tags`}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.2V3.5a1 1 0 0 1 1-1h4.7l5.3 5.3-5.7 5.7z" /><circle cx="5.5" cy="5.5" r="1" /></svg>Tags</dt>
            <dd>
              <div className="phead__tags">
                {page.tags.map((t) => (
                  <span key={t} className="phead__pill" data-color={tagColor(t)}>{t}<button type="button" aria-label={`Remove tag ${t}`} onClick={() => toggleTag(t)}>×</button></span>
                ))}
                <button type="button" ref={ref("tags")} className="phead__add" aria-labelledby={`${id}-tags`} aria-expanded={open === "tags"} onClick={() => setOpen(open === "tags" ? null : "tags")}>{page.tags.length ? "+" : <span className="phead__empty">Empty</span>}</button>
              </div>
              {open === "tags" && (
                <div className="phead__tagpop">
                  <input autoFocus aria-label="Find or create a tag" placeholder="Search or create…" value={tagQuery} onChange={(e) => setTagQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const exact = matches.find((m) => m.label.toLowerCase() === tagQuery.trim().toLowerCase()); if (exact) { toggleTag(exact.label); setTagQuery(""); } else createTag(); } if (e.key === "Escape") { e.preventDefault(); setTagQuery(""); close("tags"); } }} />
                  <ul aria-label="Tags">
                    {matches.map((t) => (
                      <li key={t.id}><button type="button" aria-pressed={page.tags.includes(t.label)} onClick={() => toggleTag(t.label)}><span className="phead__pill" data-color={t.color}>{t.label}</span>{page.tags.includes(t.label) && <svg className="phead__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>}</button></li>
                    ))}
                    {tagQuery.trim() && !matches.some((m) => m.label.toLowerCase() === tagQuery.trim().toLowerCase()) && (
                      <li><button type="button" onClick={createTag}>Create <span className="phead__pill" data-color={COLORS[tagList.length % COLORS.length]}>{tagQuery.trim()}</span></button></li>
                    )}
                  </ul>
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
