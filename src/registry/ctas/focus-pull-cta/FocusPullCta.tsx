"use client";

import { useState, type ReactNode } from "react";
import "./focus-pull-cta.css";

/**
 * Focus Pull
 * The block has three planes: the headline, the primary action, the
 * secondary action. At rest the headline is the subject. Move toward an
 * action and focus racks onto it — it overshoots, softens a touch, then
 * locks (a lens hunting) — while the other planes fall back and blur.
 */

type Action = { label: string; href?: string; onClick?: () => void };

type Props = {
  eyebrow?: string;
  title: ReactNode;
  note?: ReactNode;
  primary: Action;
  secondary: Action;
  accent?: string;
  className?: string;
};

type Plane = "title" | "primary" | "secondary";

export function FocusPullCta({ eyebrow, title, note, primary, secondary, accent = "#e8a24a", className = "" }: Props) {
  const [subject, setSubject] = useState<Plane>("title");
  const [shot, setShot] = useState(0); // bumps on every rack so the hunt replays

  const rack = (p: Plane) => {
    if (p === subject) return;
    setSubject(p);
    setShot((s) => s + 1);
  };

  const act = (a: Action, plane: Plane) => (
    <a
      key={plane}
      href={a.href ?? "#"}
      className={`focus-pull-cta__action focus-pull-cta__action--${plane}`}
      data-plane={plane}
      data-subject={subject === plane || undefined}
      data-shot={subject === plane ? shot % 2 : undefined}
      onMouseEnter={() => rack(plane)}
      onFocus={() => rack(plane)}
      onClick={(e) => { if (!a.href) e.preventDefault(); a.onClick?.(); }}
    >
      <span>{a.label}</span>
      {plane === "primary" && (
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8.5 4l4 4-4 4" /></svg>
      )}
    </a>
  );

  return (
    <section
      className={`focus-pull-cta ${className}`}
      data-subject={subject}
      style={{ ["--fp-accent" as string]: accent }}
      onMouseLeave={() => rack("title")}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) rack("title"); }}
    >
      <div className="focus-pull-cta__plane" data-plane="title" data-subject={subject === "title" || undefined} data-shot={subject === "title" ? shot % 2 : undefined}>
        {eyebrow && <p className="focus-pull-cta__eyebrow">{eyebrow}</p>}
        <h2 className="focus-pull-cta__title">{title}</h2>
      </div>
      <div className="focus-pull-cta__row">
        {act(primary, "primary")}
        {act(secondary, "secondary")}
      </div>
      {note && <p className="focus-pull-cta__note" data-plane="note">{note}</p>}
    </section>
  );
}
