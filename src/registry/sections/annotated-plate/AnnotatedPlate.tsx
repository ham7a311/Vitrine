"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./annotated-plate.css";

/**
 * Annotated Plate
 * A figure plate with numbered notes beside it, the way a field guide or an anatomy
 * book explains a picture. Point at or focus a note and the plate dims everything
 * but the part it is about, outlines it, and a leader line runs from the note
 * to it. Tap a note to pin it. On a narrow screen the notes stack under the
 * plate and the numbers stay on the figure.
 */

export type PlatePart = {
  id: string;
  /** What the note is called. */
  term: string;
  note: ReactNode;
  /** [x, y, width, height] in the figure's own coordinate space. */
  box: [number, number, number, number];
};

type Props = {
  /** "Fig. 2" */
  figure: string;
  caption?: ReactNode;
  /** Coordinate space of the figure: the plate keeps this aspect ratio and the parts' boxes are in it. */
  size: [number, number];
  /** The figure itself. Fills the plate. */
  children: ReactNode;
  parts: PlatePart[];
  title?: ReactNode;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

export function AnnotatedPlate({ figure, caption, size, children, parts, title, theme = "paper", motion = "auto", className = "" }: Props) {
  const [W, H] = size;
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [leader, setLeader] = useState<string | null>(null);
  const uid = useId();

  const activeId = pinned ?? hover ?? focus;
  const active = parts.find((p) => p.id === activeId);

  // The leader is measured from the real note to the real marker, so it is right at any width.
  const draw = useCallback(() => {
    const r = root.current, pl = plate.current;
    if (!r || !pl || !activeId) return setLeader(null);
    const note = r.querySelector<HTMLElement>(`[data-part="${CSS.escape(activeId)}"]`);
    const marker = pl.querySelector<HTMLElement>(`[data-marker="${CSS.escape(activeId)}"]`);
    if (!note || !marker) return setLeader(null);
    const c = r.getBoundingClientRect(), n = note.getBoundingClientRect(), p = pl.getBoundingClientRect(), m = marker.getBoundingClientRect();
    if (p.left < n.right) return setLeader(null); // stacked: the numbers alone carry it
    const sx = n.right - c.left + 6, sy = n.top + 18 - c.top;
    const ex = m.left + m.width / 2 - c.left, ey = m.top + m.height / 2 - c.top;
    const gx = (n.right + p.left) / 2 - c.left;
    setLeader(`M${sx} ${sy}H${gx}L${ex} ${ey}`);
  }, [activeId]);

  useLayoutEffect(draw, [draw]);
  useEffect(() => {
    const ro = new ResizeObserver(draw);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pinned]);

  const box = active?.box ?? [0, 0, 0, 0];
  const maskId = `${uid}-cut`;

  return (
    <figure
      ref={root}
      className={`annotated-plate annotated-plate--${theme} ${className}`}
      data-active={active ? "" : undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      <div className="annotated-plate__grid">
      <div className="annotated-plate__notes">
        {title && <h3 className="annotated-plate__title">{title}</h3>}
        <ol>
          {parts.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className="annotated-plate__note"
                data-part={p.id}
                data-on={activeId === p.id || undefined}
                aria-pressed={pinned === p.id}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(p.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setFocus(p.id)}
                onBlur={() => setFocus(null)}
                onClick={() => setPinned((v) => (v === p.id ? null : p.id))}
              >
                <span className="annotated-plate__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="annotated-plate__term">{p.term}</span>
                <span className="annotated-plate__body">{p.note}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="annotated-plate__plate">
        <div ref={plate} className="annotated-plate__frame" style={{ aspectRatio: `${W} / ${H}` }}>
          <div className="annotated-plate__art">{children}</div>
          <svg className="annotated-plate__veil" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <mask id={maskId}>
                <rect width={W} height={H} fill="#fff" />
                <rect className="annotated-plate__cut" width="1" height="1" fill="#000" style={{ transform: `translate(${box[0]}px, ${box[1]}px) scale(${box[2]}, ${box[3]})` }} />
              </mask>
            </defs>
            <rect className="annotated-plate__dim" width={W} height={H} mask={`url(#${maskId})`} />
            <rect className="annotated-plate__outline" width="1" height="1" vectorEffect="non-scaling-stroke" style={{ transform: `translate(${box[0]}px, ${box[1]}px) scale(${box[2]}, ${box[3]})` }} />
          </svg>
          {parts.map((p, i) => (
            <span
              key={p.id}
              className="annotated-plate__marker"
              data-marker={p.id}
              data-on={activeId === p.id || undefined}
              style={{ left: `${(p.box[0] / W) * 100}%`, top: `${(p.box[1] / H) * 100}%` } as CSSProperties}
              aria-hidden="true"
            >
              {i + 1}
            </span>
          ))}
        </div>
        <figcaption className="annotated-plate__caption">
          <span>{figure}</span>
          {caption && <span>{caption}</span>}
        </figcaption>
      </div>
      </div>

      <svg className="annotated-plate__leader" aria-hidden="true">
        {leader && <path key={activeId} d={leader} pathLength={1} />}
      </svg>
      <p className="annotated-plate__sr" role="status">{active ? `${active.term}: highlighted on ${figure}` : ""}</p>
    </figure>
  );
}
