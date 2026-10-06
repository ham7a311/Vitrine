"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import "./tuck-banner.css";

/**
 * Tuck Banner
 * An announcement strip that can be put away without being lost. Dismissing it
 * folds the message down into a thin rail along the top with a small tab that
 * names it; the tab brings it back. The choice is remembered per announcement,
 * and a new announcement opens again.
 */

type Props = {
  /** Short name for the rail tab: "Release 4.2". */
  label: string;
  children: ReactNode;
  action?: { label: string; href: string };
  /** Remember the choice under this key. Change it to announce something new. Omit for no memory. */
  storageKey?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

function read(key?: string) {
  if (!key) return false;
  try { return localStorage.getItem(key) === "tucked"; } catch { return false; }
}
function write(key: string | undefined, tucked: boolean) {
  if (!key) return;
  try { tucked ? localStorage.setItem(key, "tucked") : localStorage.removeItem(key); } catch {}
}

export function TuckBanner({ label, children, action, storageKey, theme = "paper", motion = "auto", className = "" }: Props) {
  const id = useId();
  const [tucked, setTucked] = useState(false);
  const [ready, setReady] = useState(false);
  const moved = useRef<"tab" | "action" | null>(null);
  const tab = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);

  // Storage is only read after mounting, so the server and first client render agree. Nothing animates until then.
  useEffect(() => {
    setTucked(read(storageKey));
    setReady(true);
  }, [storageKey]);

  // Keep keyboard users where they were: the control they used has just been put away.
  useEffect(() => {
    if (moved.current === "tab") tab.current?.focus();
    else if (moved.current === "action") body.current?.querySelector<HTMLElement>("a, button")?.focus();
    moved.current = null;
  }, [tucked]);

  const set = (next: boolean) => {
    moved.current = next ? "tab" : "action";
    setTucked(next);
    write(storageKey, next);
  };

  return (
    <aside
      className={`tuck-banner tuck-banner--${theme} ${className}`}
      data-tucked={tucked || undefined}
      data-ready={ready || undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
      aria-label="Announcement"
    >
      <div className="tuck-banner__fold tuck-banner__fold--open">
        <div id={id} ref={body} className="tuck-banner__strip">
          <p className="tuck-banner__text">
            <span className="tuck-banner__tag">{label}</span>
            <span>{children}</span>
          </p>
          {action && <a className="tuck-banner__action" href={action.href}>{action.label}</a>}
          <button type="button" className="tuck-banner__tuck" onClick={() => set(true)} aria-controls={id}>
            Tuck away
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6.5L8 11l4.5-4.5" /></svg>
          </button>
        </div>
      </div>
      <div className="tuck-banner__fold tuck-banner__fold--rail">
        <div className="tuck-banner__rail">
          <button ref={tab} type="button" className="tuck-banner__tab" onClick={() => set(false)} aria-expanded={!tucked} aria-controls={id}>
            <i aria-hidden="true" />
            {label}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 9.5L8 5l4.5 4.5" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
