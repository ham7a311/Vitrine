"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import "./curtain-footer.css";

/**
 * Curtain Footer
 * The footer is sticky at the bottom behind the page; the page's last section
 * has rounded lower corners and a shadow, so reaching the end reads as a sheet
 * being lifted off something underneath. Reveal progress (0→1) also lifts the
 * cropped wordmark and brings the footer's contents up to full contrast.
 */

type Props = {
  children: ReactNode;
  wordmark: string;
  columns: { title: string; links: string[] }[];
  scrollRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export function CurtainFooter({ children, wordmark, columns, scrollRef, className = "" }: Props) {
  const foot = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = foot.current!;
    const root = scrollRef?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = root ? root.clientHeight : window.innerHeight;
      const sheet = el.previousElementSibling as HTMLElement | null;
      if (!sheet) return;
      const bottom = sheet.getBoundingClientRect().bottom - (root ? root.getBoundingClientRect().top : 0);
      const p = Math.max(0, Math.min(1, (vh - bottom) / el.offsetHeight));
      el.style.setProperty("--cf-p", p.toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    target.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { target.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [scrollRef]);

  return (
    <div className={`curtain-footer ${className}`}>
      <div className="curtain-footer__sheet">{children}</div>
      <footer ref={foot} className="curtain-footer__foot" style={{ "--cf-p": 0 } as CSSProperties}>
        <div className="curtain-footer__cols">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p>{c.title}</p>
              {c.links.map((l) => <a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>)}
            </nav>
          ))}
        </div>
        <p className="curtain-footer__word" aria-hidden="true">{wordmark}</p>
      </footer>
    </div>
  );
}
