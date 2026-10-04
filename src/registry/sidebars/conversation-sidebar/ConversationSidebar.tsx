"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./conversation-sidebar.css";

/**
 * Conversation Sidebar
 * History grouped by recency (Today / Yesterday / Previous 7 days / Older).
 * Collapsing animates the width to a rail; titles don't vanish — they compress
 * into two-letter initials in the same row, so the list keeps its shape and
 * you can still find a conversation by position. Search filters in place;
 * double-click (or the pencil) renames a title inline.
 */

export type Chat = { id: string; title: string; when: "today" | "yesterday" | "week" | "older"; pinned?: boolean };

type Props = { chats: Chat[]; theme?: "paper" | "night"; className?: string };

const GROUPS: [Chat["when"], string][] = [["today", "Today"], ["yesterday", "Yesterday"], ["week", "Previous 7 days"], ["older", "Older"]];
const initials = (t: string) => t.split(/\s+/).filter((w) => /\w/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export function ConversationSidebar({ chats: initial, theme = "paper", className = "" }: Props) {
  const [chats, setChats] = useState(initial);
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(initial[0]?.id);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const draft = useRef("");

  const visible = useMemo(() => chats.filter((c) => !q || c.title.toLowerCase().includes(q.toLowerCase())), [chats, q]);

  const commit = (id: string) => {
    const t = draft.current.trim();
    if (t) setChats((cs) => cs.map((c) => (c.id === id ? { ...c, title: t } : c)));
    setEditing(null);
  };
  const onEditKey = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") commit(id);
    if (e.key === "Escape") setEditing(null);
  };

  const pinned = visible.filter((c) => c.pinned);

  const row = (c: Chat, i: number) => (
    <li key={c.id} style={{ "--i": i } as CSSProperties}>
      {editing === c.id ? (
        <input
          className="conversation-sidebar__edit"
          defaultValue={c.title}
          autoFocus
          aria-label="Rename conversation"
          onChange={(e) => (draft.current = e.target.value)}
          onFocus={(e) => { draft.current = c.title; e.target.select(); }}
          onBlur={() => commit(c.id)}
          onKeyDown={(e) => onEditKey(e, c.id)}
        />
      ) : (
        <button
          type="button"
          className="conversation-sidebar__item"
          aria-current={active === c.id ? "page" : undefined}
          title={open ? undefined : c.title}
          onClick={() => setActive(c.id)}
          onDoubleClick={() => open && setEditing(c.id)}
        >
          <span className="conversation-sidebar__ini" aria-hidden="true">{initials(c.title)}</span>
          <span className="conversation-sidebar__title">{c.title}</span>
        </button>
      )}
      {open && editing !== c.id && (
        <button type="button" className="conversation-sidebar__rename" aria-label={`Rename ${c.title}`} onClick={() => setEditing(c.id)}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13l.8-2.8 6.7-6.7 2 2-6.7 6.7L3 13Z" /></svg>
        </button>
      )}
    </li>
  );

  return (
    <aside className={`conversation-sidebar conversation-sidebar--${theme} ${className}`} data-open={open || undefined} aria-label="Conversations">
      <div className="conversation-sidebar__top">
        <button type="button" className="conversation-sidebar__icon" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Collapse sidebar" : "Expand sidebar"}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="2.5" /><path d="M8 4v12" /></svg>
        </button>
        <button type="button" className="conversation-sidebar__new" aria-label="New chat">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 5v10M5 10h10" /></svg>
          <span>New chat</span>
        </button>
      </div>

      <label className="conversation-sidebar__search">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" aria-label="Search chats" tabIndex={open ? 0 : -1} />
      </label>

      <nav className="conversation-sidebar__scroll">
        {pinned.length > 0 && (
          <section>
            <p className="conversation-sidebar__group">Pinned</p>
            <ul>{pinned.map(row)}</ul>
          </section>
        )}
        {GROUPS.map(([k, label]) => {
          const list = visible.filter((c) => c.when === k && !c.pinned);
          if (!list.length) return null;
          return (
            <section key={k}>
              <p className="conversation-sidebar__group">{label}</p>
              <ul>{list.map(row)}</ul>
            </section>
          );
        })}
        {!visible.length && <p className="conversation-sidebar__empty">No chats match “{q}”.</p>}
      </nav>

      <div className="conversation-sidebar__me">
        <span className="conversation-sidebar__avatar" aria-hidden="true">H</span>
        <span className="conversation-sidebar__who"><b>Hamza Al-Bulushi</b><i>Pro plan</i></span>
      </div>
    </aside>
  );
}
