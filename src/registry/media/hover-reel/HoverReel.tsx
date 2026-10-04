"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { studyURL } from "../art-gallery/studies";
import "./hover-reel.css";

/**
 * Hover Reel
 * A list of projects. Point at a title and a picture blooms under the cursor and follows it;
 * move to another row and the pictures roll past inside the frame instead of swapping.
 */

export type ReelProject = { title: string; label: string; href?: string; image?: string };

const DEFAULT: ReelProject[] = [
  { title: "Masar", label: "Trip planning for Oman" },
  { title: "Wally", label: "A household wallet" },
  { title: "TransOcean", label: "Logistics platform" },
  { title: "OCS", label: "Website and design system" },
  { title: "Vitrine", label: "Component library" },
];

type Props = { projects?: ReelProject[]; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string; style?: CSSProperties };

export function HoverReel({ projects = DEFAULT, theme = "paper", motion = "full", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  // Painted on the client: the studies are canvases.
  useEffect(() => {
    setImages(projects.map((p, i) => p.image ?? studyURL(i * 3 + 2, 640, 400)));
  }, [projects]);

  // The frame chases the pointer with an eased lerp, and sleeps when it arrives.
  useEffect(() => {
    const el = host.current, t = thumb.current;
    if (!el || !t) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, placed: false };
    const write = () => (t.style.translate = `${s.x}px ${s.y}px`);
    const tick = () => {
      s.raf = 0;
      const k = reduced ? 1 : 0.16;
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      write();
      if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.3) s.raf = requestAnimationFrame(tick);
    };
    const aim = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth || 1;
      const w = t.offsetWidth, h = t.offsetHeight, inset = 16;
      s.tx = Math.max(w / 2 + inset, Math.min(el.offsetWidth - w / 2 - inset, (cx - r.left) / k)) - w / 2;
      s.ty = Math.max(h / 2 + inset, Math.min(el.offsetHeight - h / 2 - inset, (cy - r.top) / k)) - h / 2;
      if (!s.placed) {
        s.x = s.tx;
        s.y = s.ty;
        s.placed = true;
        write();
      }
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => e.pointerType === "mouse" && aim(e.clientX, e.clientY);
    const onLeave = () => {
      s.placed = false;
      setOpen(false);
    };
    // Keyboard focus parks the frame at the right of the focused row.
    const onFocus = (e: FocusEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
      if (!row || !row.matches(":focus-visible")) return;
      const r = row.getBoundingClientRect();
      s.placed = false;
      aim(r.right - t.offsetWidth / 2 - 24, r.top + r.height / 2);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(s.raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocus);
    };
  }, [motion]);

  return (
    <div ref={host} className={`hr hr--${theme} ${className}`} style={style} data-motion={motion}>
      <ul className="hr__list" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}>
        {projects.map((p, i) => (
          <li key={p.title}>
            <a
              data-row
              href={p.href ?? "#"}
              className="hr__row"
              data-active={open && active === i ? "" : undefined}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setActive(i);
                setOpen(true);
              }}
              onFocus={() => {
                setActive(i);
                setOpen(true);
              }}
              onClick={(e) => !p.href && e.preventDefault()}
            >
              <span className="hr__inline" aria-hidden="true">
                {images[i] && <img src={images[i]} alt="" />}
              </span>
              <span className="hr__title">{p.title}</span>
              <span className="hr__label">{p.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div ref={thumb} className="hr__thumb" data-open={open ? "" : undefined} aria-hidden="true">
        <div className="hr__strip" style={{ translate: `0 ${-100 * Math.max(0, active)}%` }}>
          {projects.map((p, i) => (
            <div className="hr__shot" key={p.title}>
              {images[i] && <img src={images[i]} alt="" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
