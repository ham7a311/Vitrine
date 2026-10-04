"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import "./thumbed-edge.css";

/**
 * Thumbed Edge
 * A long document's contents drawn as the fore-edge of a well-used book. Each
 * section is a band whose thickness is the section's real length. The sections
 * you spend time in wear darker, and a ribbon hangs out of the edge at the place
 * you left off, so coming back to a page is one press.
 */

export type EdgeSection = { id: string; title: string };
type Memory = { wear: Record<string, number>; ribbon: { id: string; at: number } | null };

type Props = {
  /** The element that scrolls the document. Sections are found inside it by id. */
  scroller: RefObject<HTMLElement | null>;
  sections: EdgeSection[];
  /** localStorage key; omit to keep the memory for this visit only. */
  storageKey?: string;
  /** Seconds already spent per section (a demo, or a memory that came from a server). */
  seedWear?: Record<string, number>;
  /** Where the last visit ended, for a demo or a memory that came from a server. */
  seedRibbon?: { id: string; at: number };
  /** vertical: down the side of the document. horizontal: across its top, for narrow screens. */
  orientation?: "vertical" | "horizontal";
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const empty = (): Memory => ({ wear: {}, ribbon: null });

function load(key?: string, seed?: Record<string, number>, ribbon?: { id: string; at: number }): Memory {
  try {
    if (key) {
      const raw = window.localStorage.getItem(key);
      if (raw) return { ...empty(), ...(JSON.parse(raw) as Memory) };
    }
  } catch {}
  return { wear: { ...seed }, ribbon: ribbon ?? null };
}

export function ThumbedEdge({ scroller, sections, storageKey, seedWear, seedRibbon, orientation = "vertical", theme = "paper", motion = "full", className = "" }: Props) {

  const [memory, setMemory] = useState<Memory>(empty);
  const [ready, setReady] = useState(false);
  const [weights, setWeights] = useState<number[]>(() => sections.map(() => 1));
  const [here, setHere] = useState({ index: 0, frac: 0 });
  const [hot, setHot] = useState<string | null>(null);
  const hotTimer = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState("");
  const memRef = useRef(memory);
  memRef.current = memory;
  const hereRef = useRef(here);
  hereRef.current = here;

  useEffect(() => {
    setMemory(load(storageKey, seedWear, seedRibbon));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = useCallback(
    (m: Memory) => {
      try {
        if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(m));
      } catch {}
    },
    [storageKey],
  );

  // Geometry: each band is as thick as its section is long.
  const measure = useCallback(() => {
    const root = scroller.current;
    if (!root) return;
    const hs = sections.map((s) => root.querySelector<HTMLElement>(`#${CSS.escape(s.id)}`)?.offsetHeight ?? 1);
    setWeights(hs);
  }, [scroller, sections]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    root.querySelectorAll(":scope > *").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [scroller, measure]);

  // Where you are: the last section whose top is above the reading line, and how far through it.
  const locate = useCallback(() => {
    const root = scroller.current;
    if (!root) return;
    const line = root.scrollTop + root.clientHeight * 0.3;
    let index = 0;
    let frac = 0;
    sections.forEach((s, i) => {
      const el = root.querySelector<HTMLElement>(`#${CSS.escape(s.id)}`);
      if (el && el.offsetTop <= line) {
        index = i;
        frac = Math.min(1, Math.max(0, (line - el.offsetTop) / Math.max(1, el.offsetHeight)));
      }
    });
    setHere({ index, frac });
  }, [scroller, sections]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    locate();
    root.addEventListener("scroll", locate, { passive: true });
    return () => root.removeEventListener("scroll", locate);
  }, [scroller, locate]);

  // The ribbon marks where you left off *last time*. It only moves when you leave, so it stays put
  // while you read and is still there when you come back.
  useEffect(() => {
    const leave = () => {
      const h = hereRef.current;
      if (h.index === 0 && h.frac < 0.02) return;
      persist({ ...memRef.current, ribbon: { id: sections[h.index].id, at: h.frac } });
    };
    const onVis = () => document.visibilityState === "hidden" && leave();
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      leave();
      window.removeEventListener("pagehide", leave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [sections, persist]);

  // Time spent: a second of wear for the section under the reading line, only while the tab is visible.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const key = sections[hereRef.current.index]?.id;
      if (!key) return;
      const m = memRef.current;
      const next = { ...m, wear: { ...m.wear, [key]: (m.wear[key] ?? 0) + 1 } };
      setMemory(next);
      if ((next.wear[key] ?? 0) % 5 === 0) persist(next);
    }, 1000);
    return () => window.clearInterval(id);
  }, [sections, persist]);

  const goTo = (id: string, at = 0) => {
    const root = scroller.current;
    const el = root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!root || !el) return;
    const top = el.offsetTop + el.offsetHeight * at - root.clientHeight * 0.3;
    root.scrollTo({ top: Math.max(0, top), behavior: motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const t = sections.find((s) => s.id === id)?.title;
    setStatus(t ? `Went to ${t}.` : "");
    // No hover on touch: show the section's tab for a moment after the jump.
    setHot(id);
    window.clearTimeout(hotTimer.current);
    hotTimer.current = window.setTimeout(() => setHot((h) => (h === id ? null : h)), 1400);
  };

  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const max = Math.max(1, ...sections.map((s) => memory.wear[s.id] ?? 0));
  const level = (id: string) => {
    const w = memory.wear[id] ?? 0;
    return w < 3 ? 0 : Math.min(4, Math.ceil((w / max) * 4));
  };
  const pos = (index: number, frac: number) => ((weights.slice(0, index).reduce((a, b) => a + b, 0) + (weights[index] ?? 0) * frac) / total) * 100;
  const ribbonIndex = memory.ribbon ? sections.findIndex((s) => s.id === memory.ribbon!.id) : -1;
  const ribbonAt = ribbonIndex >= 0 ? pos(ribbonIndex, memory.ribbon!.at) : null;
  const hereAt = pos(here.index, here.frac);
  const away = ribbonAt !== null && Math.abs(ribbonAt - hereAt) > 4;

  const onKey = (e: React.KeyboardEvent<HTMLOListElement>) => {
    const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    if (e.key !== next && e.key !== prev && e.key !== "Home" && e.key !== "End") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const i = links.indexOf(document.activeElement as HTMLButtonElement);
    const to = e.key === "Home" ? 0 : e.key === "End" ? links.length - 1 : Math.min(links.length - 1, Math.max(0, i + (e.key === next ? 1 : -1)));
    e.preventDefault();
    links[to]?.focus();
  };

  return (
    <nav className={`thumbed-edge thumbed-edge--${theme} ${className}`} data-orient={orientation} data-motion={motion} data-ready={ready || undefined} aria-label="Sections">
      <div className="thumbed-edge__stack">
        <ol className="thumbed-edge__bands" onKeyDown={onKey}>
        {sections.map((s, i) => (
          <li key={s.id} className="thumbed-edge__band" data-wear={level(s.id)} data-current={i === here.index || undefined} data-hot={hot === s.id || undefined} style={{ flexGrow: weights[i] ?? 1 }}>
            <button type="button" className="thumbed-edge__page" aria-current={i === here.index ? "location" : undefined} onClick={() => goTo(s.id)} onPointerEnter={() => setHot(s.id)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(s.id)} onBlur={() => setHot(null)}>
              <span className="thumbed-edge__tab">{s.title}</span>
              <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
                {level(s.id) > 1 ? ", well read" : ""}
              </span>
            </button>
          </li>
        ))}
        </ol>
        <span className="thumbed-edge__here" style={{ [orientation === "vertical" ? "top" : "left"]: `${hereAt}%` }} aria-hidden="true" />
        {ribbonAt !== null && (
          <button type="button" className="thumbed-edge__ribbon" style={{ [orientation === "vertical" ? "top" : "left"]: `${ribbonAt}%` }} onClick={() => goTo(memory.ribbon!.id, memory.ribbon!.at)} aria-label={`Back to where you left off, in ${sections[ribbonIndex].title}`} title="Back to where you left off" data-away={away || undefined}>
            <span className="thumbed-edge__silk" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="thumbed-edge__sr" role="status">
        {status}
      </p>
    </nav>
  );
}
