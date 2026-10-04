"use client";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import "./roll-call.css";

export type Person = { name: string; role: string; color: string };

export function RollCall({ people, className = "" }: { people: Person[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const key = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };
  return (
    <ul className={`roll-call ${className}`} data-active={active ?? undefined} onKeyDown={key} onMouseLeave={() => setActive(null)}>
      {people.map((p, i) => (
        <li key={p.name} className="roll-call__item" data-on={active === i || undefined} style={{ "--rc": p.color } as CSSProperties}>
          <button type="button" className="roll-call__btn" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(active === i ? null : i)}>
            <span className="roll-call__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="roll-call__name">{p.name}</span>
            <span className="roll-call__role">{p.role}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
