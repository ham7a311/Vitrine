"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type MouseEvent, type KeyboardEvent } from "react";

/** Demo-only: preserve local interactions without letting example links leave the preview. */
export function DemoBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const originals = useRef(new WeakMap<Element, string>());
  const [message, setMessage] = useState("");
  const anchorFor = (target: EventTarget | null) => target instanceof Element ? target.closest("a[href]") : null;
  const originalHref = (anchor: Element) => originals.current.get(anchor) ?? anchor.getAttribute("href") ?? "#";
  const protect = (anchor: Element) => {
    const href = anchor.getAttribute("href") ?? "#";
    if (href !== "#" && !href.startsWith("#")) {
      originals.current.set(anchor, href);
      anchor.setAttribute("href", "#");
    }
    // A demo is not a route. Neutralise native modified-click/context-menu targets too.
    if (anchor.hasAttribute("target")) anchor.removeAttribute("target");
  };
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const scan = () => element.querySelectorAll("a[href]").forEach(protect);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(element, { subtree: true, childList: true, attributes: true, attributeFilter: ["href", "target"] });
    return () => observer.disconnect();
  }, []);
  const activate = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = anchorFor(event.target);
    if (!anchor) return;
    const href = originalHref(anchor);
    protect(anchor);
    event.preventDefault();
    if (href.startsWith("#") && href.length > 1) {
      let id: string;
      try { id = decodeURIComponent(href.slice(1)); } catch { id = href.slice(1); }
      const target = [...(root.current?.querySelectorAll<HTMLElement>("[id]") ?? [])].find(element => element.id === id);
      if (target) {
        target.scrollIntoView?.({ block: "nearest", behavior: "auto" });
        if (target.matches("button, a, input, select, textarea, [tabindex]")) target.focus({ preventScroll: true });
      }
    }
    setMessage(`${anchor.getAttribute("aria-label") ?? anchor.textContent?.trim() ?? "Link"}: demonstrated here; no navigation.`);
  };
  const prepare = (event: { target: EventTarget | null }) => {
    const anchor = anchorFor(event.target);
    if (anchor) protect(anchor);
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Enter") prepare(event); };
  return <div ref={root} data-demo-boundary className="contents" style={{ display: "contents" }}
    onClickCapture={activate} onAuxClickCapture={activate} onPointerDownCapture={prepare} onFocusCapture={prepare} onKeyDownCapture={key}
    onContextMenuCapture={event => { if (anchorFor(event.target)) event.preventDefault(); }}
    onSubmitCapture={event => event.preventDefault()}>
    {children}
    <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, padding: 0, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>{message}</span>
  </div>;
}
