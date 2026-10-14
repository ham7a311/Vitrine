"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { columnsFor, estimate, place, shortDate } from "./masonry";
import "./mention-wall.css";

export type Mention = {
  id: string;
  author: { name: string; handle: string; avatar?: string; verified?: boolean };
  /** Plain text; blank lines start new paragraphs. Emoji stay as text. */
  body: string;
  /** ISO date of the original post. */
  date: string;
  /** Link to the original. */
  href: string;
  /** Network name, e.g. "Chirp". */
  source: string;
  /** The original was removed; the card stays but no longer links out. */
  archived?: boolean;
};

export type MentionWallProps = {
  posts: Mention[];
  /** Posts shown at first and added by each "Show more". */
  pageSize?: number;
  look?: "paper" | "night" | "pressed";
  label?: string;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const HUES = [[24, 330], [200, 250], [150, 190], [40, 10], [265, 300], [90, 160]];
function Avatar({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) return <img className="mwall__avatar" src={src} alt="" onError={() => setFailed(true)} />;
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = HUES[code % HUES.length];
  const letters = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="mwall__avatar mwall__avatar--made" aria-hidden="true"
      style={{ background: `linear-gradient(135deg, hsl(${a} 62% 50%), hsl(${b} 58% 36%))` }}>{letters}</span>
  );
}

const Tick = () => (
  <svg className="mwall__tick" viewBox="0 0 20 20" width="18" height="18" role="img" aria-label="Verified">
    <path d="M10 1.2 12.3 3l2.9-.3.9 2.8 2.5 1.5-.9 2.8.9 2.8-2.5 1.5-.9 2.8-2.9-.3L10 18.8 7.7 17l-2.9.3-.9-2.8-2.5-1.5.9-2.8-.9-2.8 2.5-1.5.9-2.8 2.9.3Z" fill="var(--mwall-tick)" />
    <path d="m6.6 10.2 2.3 2.3 4.6-4.9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Bubble = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 16 14H9l-4 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
);

function Post({ p, onSize, go }: { p: Mention; onSize: (id: string, h: number) => void; go: (href: string) => (e: React.MouseEvent) => void }) {
  const el = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [clamped, setClamped] = useState(false);
  useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    const report = () => {
      onSize(p.id, node.getBoundingClientRect().height);
      const b = body.current;
      if (b) setClamped(b.scrollHeight > b.clientHeight + 2);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(node);
    return () => ro.disconnect();
  }, [p.id, onSize]);
  const paras = p.body.split(/\n\s*\n/);
  const id = `mwall-${p.id}`;
  return (
    <article ref={el} className="mwall__post" aria-labelledby={`${id}-n`} tabIndex={-1}>
      <div className="mwall__face">
        <header className="mwall__head">
          <Avatar name={p.author.name} src={p.author.avatar} />
          <div className="mwall__who">
            <span className="mwall__name" id={`${id}-n`}>{p.author.name}{p.author.verified && <Tick />}</span>
            <span className="mwall__handle">@{p.author.handle}</span>
          </div>
          {!p.archived && (
            <a className="mwall__src" href={p.href} onClick={go(p.href)} aria-label={`View ${p.author.name}'s post on ${p.source}`}><Bubble /></a>
          )}
        </header>
        <div ref={body} className="mwall__body">
          {paras.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <footer className="mwall__foot">
          <time dateTime={p.date}>{shortDate(p.date, "en-US")}</time>
          <span aria-hidden="true">·</span>
          {p.archived ? <span>Original removed</span> : clamped
            ? <a href={p.href} onClick={go(p.href)}>Read on {p.source}</a>
            : <span>{p.source}</span>}
        </footer>
      </div>
    </article>
  );
}

export function MentionWall({ posts, pageSize = 12, look = "paper", label = "What people are saying", onNavigate, className = "" }: MentionWallProps) {
  const root = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(1200);
  const [shown, setShown] = useState(pageSize);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const firstNew = useRef<string | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width || 1200);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onSize = useCallback((id: string, h: number) => {
    setHeights((prev) => (Math.abs((prev[id] ?? 0) - h) < 1 ? prev : { ...prev, [id]: h }));
  }, []);
  const go = (href: string) => (e: React.MouseEvent) => onNavigate?.(href, e);

  const cols = columnsFor(width);
  const gap = cols === 1 ? 14 : 22;
  const colWidth = (width - gap * (cols - 1)) / cols;
  const visible = posts.slice(0, shown);
  const layout = place(visible.map((p) => heights[p.id] ?? estimate(p.body, colWidth)), cols, gap);
  const more = shown < posts.length;

  useEffect(() => {
    const id = firstNew.current;
    if (!id) return;
    firstNew.current = null;
    root.current?.querySelector<HTMLElement>(`[aria-labelledby="mwall-${CSS.escape(id)}-n"]`)?.focus();
  }, [shown]);

  if (posts.length === 0) return null;
  return (
    <section ref={root} className={`mwall mwall--${look} ${className}`} aria-label={label}>
      <div className={`mwall__wall ${more ? "mwall__wall--more" : ""}`} style={{ gap }}>
        {layout.map((col, c) => (
          <div key={c} className="mwall__col" style={{ gap }}>
            {col.map((i) => <Post key={visible[i].id} p={visible[i]} onSize={onSize} go={go} />)}
          </div>
        ))}
      </div>
      {more && (
        <div className="mwall__more">
          <button type="button" className="mwall__btn" onClick={() => { firstNew.current = posts[shown]?.id ?? null; setShown((s) => s + pageSize); }}>
            Show more
            <span className="mwall__left">{posts.length - shown} more</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default MentionWall;
