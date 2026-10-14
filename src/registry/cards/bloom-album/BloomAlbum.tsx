"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { rest, slots } from "./bloom";
import "./bloom-album.css";

export type BloomItem = {
  id: string;
  title: string;
  /** An illustration or picture element… */
  picture?: ReactNode;
  /** …or an image URL. */
  src?: string;
  alt?: string;
};

export type BloomAlbumProps = {
  /** The face of the album: a poster, a cover image, anything. */
  cover: ReactNode;
  /** Accessible name for the album. */
  label: string;
  items: BloomItem[];
  /** Cover size in pixels; scene cards are 78% of it. */
  size?: number;
  /** How far the cards travel, relative to the cover. */
  spread?: number;
  onSelect?: (item: BloomItem) => void;
  theme?: "night" | "paper";
  className?: string;
};

export function BloomAlbum({ cover, label, items, size = 340, spread = 1, onSelect, theme = "night", className = "" }: BloomAlbumProps) {
  const root = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [fine, setFine] = useState(true);
  const closer = useRef<number | undefined>(undefined);
  // focus returned by Escape shouldn't bloom it again
  const quiet = useRef(false);
  useEffect(() => setFine(matchMedia("(hover: hover) and (pointer: fine)").matches), []);

  const card = Math.round(size * 0.78);
  const place = slots(items.length, size, size, spread);

  const openNow = useCallback(() => { clearTimeout(closer.current); setOpen(true); }, []);
  const closeSoon = useCallback(() => { clearTimeout(closer.current); closer.current = window.setTimeout(() => setOpen(false), 180); }, []);
  useEffect(() => () => clearTimeout(closer.current), []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); quiet.current = true; coverRef.current?.focus(); quiet.current = false; } };
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);

  return (
    <div
      ref={root}
      className={`bloom bloom--${theme} ${open ? "bloom--open" : ""} ${className}`}
      style={{ width: size, height: size, ["--bloom-card" as string]: `${card}px` } as CSSProperties}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") openNow(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") closeSoon(); }}
      onFocus={() => { if (!quiet.current) openNow(); }}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) closeSoon(); }}
    >
      <ul className="bloom__items" aria-label={`${label}: photos`} aria-hidden={!open}>
        {items.map((it, i) => {
          const s = place[i], r = rest(i, size);
          const style = {
            "--bloom-x": `${open ? s.x : r.x}px`,
            "--bloom-y": `${open ? s.y : r.y}px`,
            "--bloom-r": `${open ? s.rotate : r.rotate}deg`,
            "--bloom-o": open ? 1 : r.opacity,
            "--bloom-s": open ? 1 : 0.9,
            zIndex: open ? s.z : 0,
            transitionDelay: open ? `${s.delay}ms` : `${(items.length - i) * 14}ms`,
          } as CSSProperties;
          return (
            <li key={it.id} className="bloom__slot" style={style}>
              <button type="button" className="bloom__card" tabIndex={open ? 0 : -1} aria-label={it.title} onClick={() => onSelect?.(it)}>
                {it.src ? <img src={it.src} alt={it.alt ?? ""} /> : <span className="bloom__pic" aria-hidden="true">{it.picture}</span>}
                <span className="bloom__tag" aria-hidden="true">{it.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        ref={coverRef}
        type="button"
        className="bloom__cover"
        aria-expanded={open}
        aria-label={`${label}, ${items.length} photos`}
        onClick={() => { if (!fine) setOpen((o) => !o); else setOpen(true); }}
      >
        {cover}
      </button>
    </div>
  );
}

export default BloomAlbum;
