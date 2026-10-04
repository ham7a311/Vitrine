"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./chapter-numeral.css";

type Props = { number: string; name: string; role?: string; color?: string; className?: string };

export function ChapterNumeral({ number, name, role, color = "#5fd6e8", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className={`chapter-numeral ${className}`} data-on={on || undefined} style={{ "--cn": color } as CSSProperties}>
      <div className="chapter-numeral__digits" aria-hidden="true">
        <span className="chapter-numeral__line">{number}</span>
        <span className="chapter-numeral__fill">{number}</span>
      </div>
      <figcaption className="chapter-numeral__cap">
        <span className="chapter-numeral__name">{name}</span>
        {role && <span className="chapter-numeral__role">{role}</span>}
      </figcaption>
    </figure>
  );
}
