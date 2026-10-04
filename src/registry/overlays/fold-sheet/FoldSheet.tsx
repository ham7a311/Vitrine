"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./fold-sheet.css";

/**
 * Fold Sheet
 * A sheet that arrives folded flat against its edge and swings open on that
 * hinge, the way a page is opened rather than a drawer pulled. Its content
 * becomes legible as the surface comes square to you. On a phone, dragging the
 * handle folds it back down under your finger; let go past a third and it
 * closes, short of that and it opens flat again.
 */

type Side = "right" | "left" | "bottom";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** "auto" = right from 640px wide, bottom below. */
  side?: Side | "auto";
  /** Position inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
};

type Phase = "closed" | "open" | "closing";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLOSE_MS = 300;

export function FoldSheet({ open, onClose, title, description, children, footer, side = "auto", contained = false, theme = "paper", motion = "auto" }: Props) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [resolved, setResolved] = useState<Side>("right");
  const [drag, setDrag] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);
  const phaseRef = useRef<Phase>("closed");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const inerted = useRef<Element[]>([]);
  const dragStart = useRef<{ y: number; h: number } | null>(null);
  const moved = useRef(false);
  const angle = useRef(0);
  const titleId = useId();
  const descId = useId();

  phaseRef.current = phase;

  const resolveSide = useCallback(() => {
    if (side !== "auto") return setResolved(side);
    const w = contained ? rootRef.current?.parentElement?.clientWidth ?? window.innerWidth : window.innerWidth;
    setResolved(w >= 640 ? "right" : "bottom");
  }, [side, contained]);

  useEffect(() => {
    if (open && phaseRef.current !== "open") {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setSettled(false);
      setPhase("open");
    } else if (!open && phaseRef.current === "open") {
      setPhase("closing");
    }
  }, [open]);

  // Mount: pick the edge, make everything else inert, take focus.
  useLayoutEffect(() => {
    if (phase !== "open") return;
    resolveSide();
    const root = rootRef.current;
    const parent = contained ? root?.parentElement : document.body;
    inerted.current = parent ? Array.from(parent.children).filter((el) => el !== root && !el.hasAttribute("inert")) : [];
    inerted.current.forEach((el) => el.setAttribute("inert", ""));
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      inerted.current.forEach((el) => el.removeAttribute("inert"));
      inerted.current = [];
    };
  }, [phase, contained, resolveSide]);

  useEffect(() => {
    if (phase !== "open" || side !== "auto") return;
    window.addEventListener("resize", resolveSide);
    return () => window.removeEventListener("resize", resolveSide);
  }, [phase, side, resolveSide]);

  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      setDrag(null);
      const target = restoreRef.current;
      if (target?.isConnected) target.focus({ preventScroll: true });
    }, CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Drag the handle down: the top edge follows the finger by folding, not sliding.
  const onHandleDown = (e: React.PointerEvent) => {
    if (resolved !== "bottom" || !panelRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, h: panelRef.current.offsetHeight };
    moved.current = false;
    angle.current = 0;
    setDrag(0);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    const s = dragStart.current;
    if (!s) return;
    const dy = Math.max(0, e.clientY - s.y);
    if (dy > 4) moved.current = true;
    // Projected height is h·cos(θ): choose θ so the top edge stays under the pointer.
    const theta = Math.acos(Math.max(-1, 1 - Math.min(dy, s.h) / s.h)) * (180 / Math.PI);
    angle.current = Math.min(88, theta);
    setDrag(angle.current);
  };
  const onHandleUp = () => {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s) return;
    if (angle.current > 50) onClose(); // cos 50° ≈ 0.64 → about a third folded away
    else setDrag(null);
  };
  const onHandleClick = () => {
    // A tap (no drag) on the handle closes the sheet; keyboard users get the same.
    if (!moved.current) onClose();
    moved.current = false;
  };

  if (phase === "closed") return null;

  const style = drag !== null && drag > 0 ? ({ "--fs-drag": `${drag}deg`, "--fs-shade": drag / 90 } as CSSProperties) : undefined;

  const node = (
    <div
      ref={rootRef}
      className={`fold-sheet fold-sheet--${resolved} fold-sheet--${theme}${contained ? " fold-sheet--contained" : ""}`}
      data-phase={phase}
      data-dragging={drag !== null && dragStart.current ? "" : undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
      data-settled={settled ? "" : undefined}
    >
      <div className="fold-sheet__scrim" aria-hidden="true" onPointerDown={onClose} />
      <div className="fold-sheet__hinge">
        <section
          ref={panelRef}
          className="fold-sheet__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          onKeyDown={trapTab}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && phaseRef.current === "open") setSettled(true);
          }}
          style={style}
        >
          <header className="fold-sheet__spine">
            {resolved === "bottom" && (
              <button
                type="button"
                className="fold-sheet__handle"
                aria-label="Close sheet"
                onPointerDown={onHandleDown}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
                onPointerCancel={onHandleUp}
                onClick={onHandleClick}
              >
                <span />
              </button>
            )}
            <div className="fold-sheet__heading">
              <h2 id={titleId} className="fold-sheet__title">
                {title}
              </h2>
              {description && (
                <p id={descId} className="fold-sheet__desc">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="fold-sheet__close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </header>
          <div className="fold-sheet__body">{children}</div>
          {footer && <footer className="fold-sheet__footer">{footer}</footer>}
          <div className="fold-sheet__crease" aria-hidden="true" />
        </section>
      </div>
    </div>
  );

  return contained ? node : createPortal(node, document.body);
}
