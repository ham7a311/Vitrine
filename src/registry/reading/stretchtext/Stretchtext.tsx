"use client";
import { Children, createContext, isValidElement, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from "react";
import "./stretchtext.css";

type Depth = { level: number; prev: number };
const DepthContext = createContext<Depth>({ level: 0, prev: 0 });

/** Text that appears from depth `level` upward. */
export function More({ level, children }: { level: number; children: ReactNode }) {
  const { level: now, prev } = useContext(DepthContext);
  if (now < level) return null;
  return <span className="stx__more" data-fresh={prev < level ? true : undefined}>{children}</span>;
}
/** Shorter wording shown only below depth `below`, replaced by a <More level={below}> there. */
export function Less({ below, children }: { below: number; children: ReactNode }) {
  const { level } = useContext(DepthContext);
  return level < below ? <>{children}</> : null;
}

export type StretchtextProps = {
  levels?: string[];
  defaultLevel?: number;
  title?: string;
  onLevelChange?: (level: number) => void;
  /** Words per minute for the reading-time estimate. */
  wpm?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
  children: ReactNode;
};

// Count the words a reader would see at a given depth, by walking the same tree that renders.
function words(node: ReactNode, level: number): number {
  if (typeof node === "string" || typeof node === "number") return String(node).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  if (Array.isArray(node)) return node.reduce((a: number, n) => a + words(n, level), 0);
  if (!isValidElement(node)) return 0;
  const el = node as ReactElement<{ level?: number; below?: number; children?: ReactNode }>;
  if (el.type === More && level < (el.props.level ?? 0)) return 0;
  if (el.type === Less && level >= (el.props.below ?? 0)) return 0;
  return words(el.props.children, level);
}
function deepest(node: ReactNode): number {
  if (Array.isArray(node)) return Math.max(0, ...node.map(deepest));
  if (!isValidElement(node)) return 0;
  const el = node as ReactElement<{ level?: number; children?: ReactNode }>;
  return Math.max(el.type === More ? el.props.level ?? 0 : 0, deepest(el.props.children));
}

/**
 * Stretchtext
 * One article at several depths. Pick Gist, Normal or Full and the detail
 * grows inside the sentences themselves; what's new is washed with a
 * highlighter and the paragraph you were reading stays where it was.
 */
export function Stretchtext({ levels = ["Gist", "Normal", "Full"], defaultLevel = 1, title, onLevelChange, wpm = 230, theme = "light", motion = true, className = "", children }: StretchtextProps) {
  const id = useId();
  const [depth, setDepth] = useState<Depth>({ level: defaultLevel, prev: defaultLevel });
  const [message, setMessage] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const snap = useRef<{ height: number; anchor: Element | null; top: number } | null>(null);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);

  const counts = useMemo(() => levels.map((_, i) => words(children, i)), [children, levels]);
  const blocks = Children.toArray(children);

  const change = (next: number) => {
    const level = Math.max(0, Math.min(levels.length - 1, next));
    if (level === depth.level || !body.current) return;
    // Hold the paragraph being read (the one a third of the way down the view) at the same screen position.
    const view = viewOf(body.current);
    const eye = view.top + view.height * 0.3;
    const blocks = [...body.current.children];
    const anchor = blocks.find((el) => { const r = el.getBoundingClientRect(); return r.top <= eye && r.bottom > eye; }) ?? blocks.find((el) => el.getBoundingClientRect().top > eye) ?? null;
    snap.current = { height: body.current.offsetHeight, anchor, top: anchor?.getBoundingClientRect().top ?? 0 };
    setDepth({ level, prev: depth.level });
    onLevelChange?.(level);
    setMessage(`${levels[level]}: ${counts[level]} words, about ${Math.max(1, Math.round(counts[level] / wpm))} min.`);
  };

  useLayoutEffect(() => {
    const s = snap.current, el = body.current;
    snap.current = null;
    if (!s || !el) return;
    if (s.anchor && s.anchor.isConnected) {
      const shift = s.anchor.getBoundingClientRect().top - s.top;
      if (Math.abs(shift) > 1) scrollerOf(el).scrollBy({ top: shift, behavior: "instant" as ScrollBehavior });
    }
    if (reduced.current) return;
    // Reveal the extra length with a clip rather than a height change, so layout
    // and scroll range are final immediately and the anchor correction above holds.
    const grew = el.offsetHeight - s.height;
    if (grew > 2) el.animate([{ clipPath: `inset(0 0 ${grew}px 0)` }, { clipPath: "inset(0 0 0 0)" }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
  }, [depth]);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if ((e.target as Element).closest("input:not([type=radio]), textarea")) return;
    if (e.key === "]") { e.preventDefault(); change(depth.level + 1); }
    if (e.key === "[") { e.preventDefault(); change(depth.level - 1); }
  };

  return (
    <article className={`stx stx--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={title ? `${id}-t` : undefined} onKeyDown={onKey}>
      <div className="stx__bar">
        <fieldset className="stx__depth">
          <legend className="stx__legend">Depth</legend>
          {levels.map((name, i) => (
            <label key={name} className="stx__seg" data-on={depth.level === i || undefined}>
              <input type="radio" name={`${id}-d`} checked={depth.level === i} onChange={() => change(i)} aria-keyshortcuts="[ ]" />
              <span className="stx__seg-name">{name}</span>
              <span className="stx__seg-count">{counts[i]} words</span>
            </label>
          ))}
        </fieldset>
        <span className="stx__time" aria-hidden="true">{Math.max(1, Math.round(counts[depth.level] / wpm))} min read</span>
      </div>
      {title && <h2 id={`${id}-t`} className="stx__title">{title}</h2>}
      <DepthContext.Provider value={depth}>
        <div ref={body} className="stx__body">
          {blocks.map((b, i) => (
            <div key={isValidElement(b) && b.key != null ? b.key : i} className="stx__block" data-more={deepest(b) > depth.level || undefined}>{b}</div>
          ))}
        </div>
      </DepthContext.Provider>
      <p className="stx__sr" aria-live="polite">{message}</p>
    </article>
  );
}

function scrollingParent(el: Element): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}
function scrollerOf(el: Element): { scrollBy: (o: ScrollToOptions) => void } {
  return scrollingParent(el) ?? window;
}
function viewOf(el: Element) {
  const p = scrollingParent(el);
  if (!p) return { top: 0, height: window.innerHeight };
  const r = p.getBoundingClientRect();
  return { top: r.top, height: r.height };
}
