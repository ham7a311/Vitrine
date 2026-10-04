"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "./icons";

const R = 20;
const C = 2 * Math.PI * R;

/** A small round button in the corner that returns to the top; its ring shows how far down the page you are. */
export function BackToTop() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShown(y > window.innerHeight * 1.2);
      ring.current?.setAttribute("stroke-dashoffset", String(C * (1 - (max > 0 ? Math.min(1, y / max) : 0))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [pathname]);

  // Full-window previews sit over the site and have their own scroll.
  if (pathname.startsWith("/preview") || pathname.endsWith("/preview")) return null;

  const top = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={top}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`group fixed z-40 grid size-11 place-items-center rounded-full border border-line-strong bg-plum-900/80 text-ink-2 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md transition-[opacity,transform,color,border-color] duration-300 ease-[var(--ease-gallery)] hover:border-frost/40 hover:text-cream motion-reduce:transition-none ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      style={{ right: "max(16px, env(safe-area-inset-right))", bottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle ref={ring} cx="22" cy="22" r={R} fill="none" stroke="var(--color-frost)" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
