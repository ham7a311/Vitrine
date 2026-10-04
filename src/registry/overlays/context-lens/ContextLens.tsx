"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import "./context-lens.css";

/**
 * Context Lens
 * A contextual menu that is the selected object opened up rather than a box
 * floating beside it. The row itself becomes the lens's header: it takes on
 * the lens surface and joins the panel through a narrow neck, so row and panel
 * read as one piece of material. The panel grows out of that neck toward the
 * side with room.
 */

export type LensAction = {
  id: string;
  label: string;
  shortcut?: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};
export type LensMeta = { label: string; value: ReactNode };

type TriggerApi = {
  open: boolean;
  /** Spread on the object (row, card). Right-click, Shift+F10 and the Menu key open the lens. */
  rowProps: {
    ref: (el: HTMLElement | null) => void;
    onContextMenu: (e: ReactMouseEvent) => void;
    onKeyDown: (e: ReactKeyboardEvent) => void;
    "data-lens-open"?: "";
    "data-lens-theme": string;
  };
  /** Spread on an explicit "more" button. */
  buttonProps: {
    type: "button";
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-label": string;
    onClick: (e: ReactMouseEvent<HTMLElement>) => void;
  };
};

type Props = {
  /** Name of the object, used for labels. */
  label: string;
  meta?: LensMeta[];
  actions: LensAction[];
  children: (api: TriggerApi) => ReactNode;
  width?: number;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
};

const NECK = 12;
const EDGE = 12;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function ContextLens({ label, meta = [], actions, children, width = 288, theme = "paper", motion = "auto" }: Props) {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const rowRef = useRef<HTMLElement | null>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const anchorX = useRef(0);
  const returnTo = useRef<HTMLElement | null>(null);
  const menuId = useId();
  const metaId = useId();

  const openAt = useCallback((x: number, from: HTMLElement | null) => {
    anchorX.current = x;
    returnTo.current = from;
    setState("open");
  }, []);

  const close = useCallback((restore = true) => {
    setState((s) => (s === "open" ? "closing" : s));
    if (restore) returnTo.current?.focus({ preventScroll: true });
  }, []);

  /** Place the lens under (or over) the row, with the neck at the anchor point. */
  const place = useCallback(() => {
    const row = rowRef.current;
    const lens = lensRef.current;
    if (!row || !lens) return;
    const r = row.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // On a phone the lens takes the row's own width, so the two edges line up.
    const narrow = vw < 480;
    const pw = narrow ? Math.min(r.width, vw - EDGE * 2) : Math.min(width, vw - EDGE * 2);
    const panel = lens.querySelector<HTMLElement>(".context-lens__panel")!;
    panel.style.maxHeight = "";
    const natural = panel.offsetHeight;
    const left = narrow ? clamp(r.left, EDGE, vw - EDGE - pw) : clamp(clamp(anchorX.current - 56, r.left, r.right - pw), EDGE, vw - EDGE - pw);
    // Prefer below; flip above only when that side has more room. Cap to the room there is.
    const roomBelow = vh - EDGE - r.bottom - NECK;
    const roomAbove = r.top - NECK - EDGE;
    const below = natural <= roomBelow || roomBelow >= roomAbove;
    const ph = Math.min(natural, Math.max(120, below ? roomBelow : roomAbove));
    if (ph < natural) panel.style.maxHeight = `${ph}px`;
    const top = below ? r.bottom : r.top - NECK - ph;
    lens.style.left = `${left}px`;
    lens.style.top = `${top}px`;
    lens.style.width = `${pw}px`;
    lens.style.setProperty("--cl-neck-x", `${clamp(anchorX.current - left, 30, pw - 30)}px`);
    lens.dataset.side = below ? "below" : "above";
  }, [width]);

  useLayoutEffect(() => {
    if (state !== "open") return;
    place();
    const first = itemRefs.current.find((b) => b && b.getAttribute("aria-disabled") !== "true");
    first?.focus({ preventScroll: true });
  }, [state, place]);

  useEffect(() => {
    if (state !== "open") return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (lensRef.current?.contains(t)) return;
      if (returnTo.current?.contains(t) && returnTo.current !== rowRef.current) return; // its own button toggles
      if (rowRef.current?.contains(t) && e.button === 2) return; // a fresh right-click re-anchors
      close(false);
    };
    const onScroll = () => place();
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [state, place, close]);

  useEffect(() => {
    if (state !== "closing") return;
    const t = window.setTimeout(() => setState("closed"), 140);
    return () => window.clearTimeout(t);
  }, [state]);

  const onRowKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      const r = rowRef.current!.getBoundingClientRect();
      openAt(r.left + 56, e.currentTarget as HTMLElement);
    }
  };

  const onMenuKey = (e: ReactKeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => items[(n + items.length) % items.length]?.focus();
    if (e.key === "ArrowDown") (e.preventDefault(), go(i + 1));
    else if (e.key === "ArrowUp") (e.preventDefault(), go(i - 1));
    else if (e.key === "Home") (e.preventDefault(), go(0));
    else if (e.key === "End") (e.preventDefault(), go(items.length - 1));
    else if (e.key === "Escape") (e.preventDefault(), close());
    else if (e.key === "Tab") close();
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      const order = [...items.slice(i + 1), ...items.slice(0, i + 1)];
      order.find((b) => b.textContent?.trim().toLowerCase().startsWith(k))?.focus();
    }
  };

  const select = (a: LensAction) => {
    if (a.disabled) return;
    close();
    a.onSelect?.();
  };

  const open = state === "open";
  const api: TriggerApi = {
    open,
    rowProps: {
      ref: (el) => {
        rowRef.current = el;
      },
      onContextMenu: (e) => {
        e.preventDefault();
        openAt(e.clientX, e.currentTarget as HTMLElement);
      },
      onKeyDown: onRowKey,
      "data-lens-open": state !== "closed" ? "" : undefined,
      "data-lens-theme": theme,
    },
    buttonProps: {
      type: "button",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": menuId,
      "aria-label": `Actions for ${label}`,
      onClick: (e) => {
        e.stopPropagation();
        if (open) return close();
        const b = e.currentTarget.getBoundingClientRect();
        openAt(b.left + b.width / 2, e.currentTarget);
      },
    },
  };

  const lens =
    state !== "closed" &&
    createPortal(
      <div
        ref={lensRef}
        className={`context-lens context-lens--${theme}`}
        data-lens-theme={theme}
        data-state={state}
        data-motion={motion === "reduced" ? "reduced" : undefined}
        style={{ width } as CSSProperties}
      >
        <svg className="context-lens__neck" viewBox="0 0 48 14" preserveAspectRatio="none" aria-hidden="true">
          <path className="context-lens__neck-fill" d="M0 0H48C35 0 35 14 48 14H0C13 14 13 0 0 0Z" />
          <path className="context-lens__neck-edge" d="M0 0C13 0 13 14 0 14M48 0C35 0 35 14 48 14" />
        </svg>
        <div className="context-lens__panel">
          {meta.length > 0 && (
            <dl id={metaId} className="context-lens__meta">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div id={menuId} role="menu" aria-label={`Actions for ${label}`} aria-describedby={meta.length ? metaId : undefined} className="context-lens__menu" onKeyDown={onMenuKey}>
            {actions.map((a, i) => (
              <button
                key={a.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-disabled={a.disabled || undefined}
                data-danger={a.danger || undefined}
                className="context-lens__item"
                onClick={() => select(a)}
              >
                {a.icon && (
                  <span className="context-lens__icon" aria-hidden="true">
                    {a.icon}
                  </span>
                )}
                <span className="context-lens__label">{a.label}</span>
                {a.shortcut && (
                  <kbd className="context-lens__kbd" aria-hidden="true">
                    {a.shortcut}
                  </kbd>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {children(api)}
      {lens}
    </>
  );
}
