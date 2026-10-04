"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./workspace-sidebar.css";

/**
 * Workspace Sidebar
 * A single indicator (a soft pill plus a short accent tick) is positioned over
 * whichever row is active, including rows nested inside expandable sections.
 * Moving between rows animates its top, height and left inset — so going into
 * a sub-item visibly steps it inward. Sections expand with grid rows.
 */

export type NavItem = { id: string; label: string; icon?: ReactNode; count?: number; children?: { id: string; label: string }[] };

type Props = { workspace: string; items: NavItem[]; pinned?: { id: string; label: string; color: string }[]; className?: string };

export function WorkspaceSidebar({ workspace, items, pinned = [], className = "" }: Props) {
  const [active, setActive] = useState("inbox");
  const [open, setOpen] = useState<Record<string, boolean>>({ projects: true });
  const [ind, setInd] = useState<{ t: number; h: number; l: number } | null>(null);
  const nav = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const place = () => {
      const el = nav.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      const n = nav.current;
      if (!el || !n || el.offsetParent === null) return setInd(null);
      const a = el.getBoundingClientRect(), b = n.getBoundingClientRect();
      setInd({ t: a.top - b.top + n.scrollTop, h: a.height, l: a.left - b.left });
    };
    place();
    const id = setTimeout(place, 480); // after a section finishes opening
    return () => clearTimeout(id);
  }, [active, open]);

  const row = (id: string, label: ReactNode, extra?: ReactNode, depth = 0) => (
    <button key={id} type="button" data-id={id} className="workspace-sidebar__row" data-depth={depth} aria-current={active === id ? "page" : undefined} onClick={() => setActive(id)}>
      {label}
      {extra}
    </button>
  );

  return (
    <aside className={`workspace-sidebar ${className}`} aria-label="Workspace">
      <button type="button" className="workspace-sidebar__ws">
        <span className="workspace-sidebar__logo" aria-hidden="true">{workspace.charAt(0)}</span>
        <span>{workspace}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 6.5l3 3 3-3" /></svg>
      </button>

      <nav ref={nav} className="workspace-sidebar__nav">
        {ind && <span className="workspace-sidebar__ind" aria-hidden="true" style={{ "--t": `${ind.t}px`, "--h": `${ind.h}px`, "--l": `${ind.l}px` } as CSSProperties} />}

        {items.map((it) =>
          it.children ? (
            <div key={it.id} className="workspace-sidebar__section">
              <button type="button" className="workspace-sidebar__row workspace-sidebar__row--head" aria-expanded={!!open[it.id]} onClick={() => setOpen((o) => ({ ...o, [it.id]: !o[it.id] }))}>
                {it.icon}
                <span>{it.label}</span>
                <svg className="workspace-sidebar__chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" /></svg>
              </button>
              <div className="workspace-sidebar__kids" data-open={open[it.id] || undefined}>
                <div>
                  {it.children.map((c) => row(c.id, <span>{c.label}</span>, undefined, 1))}
                </div>
              </div>
            </div>
          ) : (
            row(it.id, <>{it.icon}<span>{it.label}</span></>, it.count ? <em>{it.count}</em> : undefined)
          ),
        )}

        {pinned.length > 0 && <p className="workspace-sidebar__label">Favourites</p>}
        {pinned.map((p) => row(p.id, <><i className="workspace-sidebar__dot" style={{ background: p.color }} /><span>{p.label}</span></>))}
      </nav>

      <div className="workspace-sidebar__foot">
        <span className="workspace-sidebar__avatar" aria-hidden="true">H</span>
        <span>Hamza</span>
        <kbd>⌘ ,</kbd>
      </div>
    </aside>
  );
}
