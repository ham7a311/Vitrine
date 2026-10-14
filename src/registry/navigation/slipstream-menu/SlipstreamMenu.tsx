"use client";
import { useRef, type ReactNode } from "react";
import { edge, offset } from "./edge";
import "./slipstream-menu.css";

export type SlipItem = { label: string; href: string; /** Pictures that ride in the band. */ pictures?: ReactNode[] };

export type SlipstreamMenuProps = {
  items: SlipItem[];
  /** Accessible name for the navigation. */
  label?: string;
  theme?: "night" | "paper";
  /** Seconds for the band's marquee to travel one copy. */
  speed?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const EASE = "cubic-bezier(0.2, 0, 0, 1)";

function Row({ item, speed, onNavigate }: { item: SlipItem; speed: number; onNavigate?: SlipstreamMenuProps["onNavigate"] }) {
  const row = useRef<HTMLAnchorElement>(null);
  const band = useRef<HTMLSpanElement>(null);
  const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slide = (from: number, to: number) => {
    const b = band.current;
    if (!b) return;
    if (reduced()) { b.style.transform = `translateY(${to}%)`; return; }
    b.getAnimations().forEach((a) => a.cancel());
    b.animate([{ transform: `translateY(${from}%)` }, { transform: `translateY(${to}%)` }], { duration: 480, easing: EASE, fill: "forwards" });
  };
  const show = (side: "top" | "bottom") => { row.current?.classList.add("slip__row--on"); slide(offset(side), 0); };
  const hide = (side: "top" | "bottom") => { row.current?.classList.remove("slip__row--on"); slide(0, offset(side)); };
  const at = (e: React.PointerEvent) => edge(e.clientY, row.current!.getBoundingClientRect());

  const strip = (copy: number) => (
    <span className="slip__strip" aria-hidden={copy > 0 || undefined} key={copy}>
      {Array.from({ length: 3 }, (_, k) => (
        <span className="slip__seg" key={k}>
          <span className="slip__word">{item.label}</span>
          {item.pictures?.[k % (item.pictures.length || 1)] && <span className="slip__pic">{item.pictures[k % item.pictures.length]}</span>}
        </span>
      ))}
    </span>
  );

  return (
    <li className="slip__item">
      <a
        ref={row}
        className="slip__row"
        href={item.href}
        onClick={(e) => onNavigate?.(item.href, e)}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") show(at(e)); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hide(at(e)); }}
        onFocus={() => show("top")}
        onBlur={() => hide("bottom")}
      >
        <span className="slip__label">{item.label}</span>
        <span ref={band} className="slip__band" aria-hidden="true" style={{ transform: "translateY(101%)" }}>
          <span className="slip__track" style={{ animationDuration: `${speed}s` }}>{strip(0)}{strip(1)}</span>
        </span>
      </a>
    </li>
  );
}

/** Full-width menu rows; pointing at one slides in a band from the edge you came through, carrying a marquee. */
export function SlipstreamMenu({ items, label = "Menu", theme = "night", speed = 14, onNavigate, className = "" }: SlipstreamMenuProps) {
  return (
    <nav className={`slip slip--${theme} ${className}`} aria-label={label}>
      <ul className="slip__list">
        {items.map((it) => <Row key={it.href} item={it} speed={speed} onNavigate={onNavigate} />)}
      </ul>
    </nav>
  );
}

export default SlipstreamMenu;
