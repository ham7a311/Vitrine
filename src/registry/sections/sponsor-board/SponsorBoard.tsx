"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { balance, cards, crowd, money, progress } from "./board";
import "./sponsor-board.css";

export type BoardSponsor = {
  name: string;
  /** Inline mark, usually an SVG; its viewBox sets the proportions. */
  logo?: ReactNode;
  /** Image URL; the name is shown instead if it fails to load. */
  src?: string;
  href?: string;
  /** e.g. "Since May 2025". */
  since?: string;
};

export type BoardTier = {
  id: string;
  name: string;
  /** lg: two across, md: three, sm: four. */
  size: "lg" | "md" | "sm";
  price: string;
  perks?: string[];
  /** Total places; omit for an open-ended tier. */
  slots?: number;
  sponsors: BoardSponsor[];
  href: string;
};

export type SponsorBoardProps = {
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** Monthly funding, in cents. */
  goal?: { raised: number; target: number; note?: string; currency?: string };
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tiers: BoardTier[];
  backers?: { label: string; price?: string; people: { name: string; avatar?: string }[]; total?: number; href: string };
  theme?: "night" | "paper";
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const AREA = { lg: { a: 13000, w: 220, h: 72 }, md: { a: 7600, w: 170, h: 54 }, sm: { a: 4200, w: 128, h: 40 } };

function Mark({ s, size }: { s: BoardSponsor; size: BoardTier["size"] }) {
  const box = useRef<HTMLSpanElement>(null);
  const [ratio, setRatio] = useState(3);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [s.src]);
  useLayoutEffect(() => {
    const vb = box.current?.querySelector("svg")?.viewBox?.baseVal;
    if (vb && vb.width && vb.height) setRatio(vb.width / vb.height);
  }, [s.logo]);
  const a = AREA[size], b = balance(ratio, a.a, a.w, a.h);
  const style = { width: `calc(${b.width}px * var(--sboard-scale, 1))`, height: `calc(${b.height}px * var(--sboard-scale, 1))` };
  if (s.src && !failed) {
    return <img className="sboard__img" src={s.src} alt="" draggable={false} style={style}
      onLoad={(e) => { const i = e.currentTarget; if (i.naturalWidth && i.naturalHeight) setRatio(i.naturalWidth / i.naturalHeight); }}
      onError={() => setFailed(true)} />;
  }
  if (s.logo && !s.src) return <span ref={box} className="sboard__svg" style={style} aria-hidden="true">{s.logo}</span>;
  return <span className="sboard__word" aria-hidden="true">{s.name}</span>;
}

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const HUES = [22, 200, 150, 280, 45, 330, 100, 240];

export function SponsorBoard({
  eyebrow, title = "Sponsors", lede, goal, primary, secondary, tiers, backers, theme = "night", onNavigate, className = "",
}: SponsorBoardProps) {
  const id = useId();
  const go = (href: string) => (e: React.MouseEvent) => onNavigate?.(href, e);
  const share = goal ? progress(goal.raised, goal.target) : 0;
  const pct = Math.round(share * 100);
  const group = backers ? crowd(backers.people, backers.total, 9) : null;

  return (
    <section className={`sboard sboard--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <div className="sboard__intro">
        {eyebrow && <p className="sboard__eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-t`} className="sboard__title">{title}</h2>
        {lede && <p className="sboard__lede">{lede}</p>}

        {goal && (
          <div className="sboard__goal">
            <p className="sboard__raised"><b>{money(goal.raised, goal.currency)}</b><span>a month</span></p>
            <div className="sboard__bar" role="progressbar" aria-label="Monthly goal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
              aria-valuetext={`${money(goal.raised, goal.currency)} of ${money(goal.target, goal.currency)} a month, ${pct}%`}>
              <i style={{ width: `${share * 100}%` }} />
            </div>
            <p className="sboard__goalmeta">
              <span><b>{pct}%</b> of the {money(goal.target, goal.currency)} goal</span>
              {goal.note && <span>{goal.note}</span>}
            </p>
          </div>
        )}

        <div className="sboard__actions">
          <a className="sboard__primary" href={primary.href} onClick={go(primary.href)}>
            {primary.label}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          {secondary && <a className="sboard__secondary" href={secondary.href} onClick={go(secondary.href)}>{secondary.label}</a>}
        </div>
      </div>

      <div className="sboard__tiers">
        {tiers.map((t) => {
          const detail = `${t.id}-d`;
          return (
            <section key={t.id} className={`sboard__tier sboard__tier--${t.size}`} aria-labelledby={`${id}-${t.id}`}>
              <header className="sboard__tierhead">
                <h3 id={`${id}-${t.id}`}>{t.name}</h3>
                <span>{t.price}</span>
              </header>
              <span id={`${id}-${detail}`} hidden>{[t.price, ...(t.perks ?? [])].join(". ")}</span>
              <ul className="sboard__grid">
                {cards(t.sponsors, t.slots).map((c, i) => c.kind === "filled" ? (
                  <li key={c.sponsor.name}>
                    <a className="sboard__card sboard__card--filled" href={c.sponsor.href} onClick={c.sponsor.href ? go(c.sponsor.href) : undefined}
                      aria-label={`${c.sponsor.name}, ${t.name} sponsor${c.sponsor.since ? `, ${c.sponsor.since.toLowerCase()}` : ""}`}>
                      <Mark s={c.sponsor} size={t.size} />
                      {c.sponsor.since && <span className="sboard__since" aria-hidden="true">{c.sponsor.since}</span>}
                    </a>
                  </li>
                ) : (
                  <li key={`open-${i}`}>
                    <a className="sboard__card sboard__card--open" href={t.href} onClick={go(t.href)} aria-describedby={`${id}-${detail}`}>
                      <span className="sboard__swap">
                        <span className="sboard__invite">
                          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          {t.sponsors.length === 0 && i === 0 ? `Be the first ${t.name} sponsor` : "Your logo here"}
                        </span>
                        {t.perks?.length ? <span className="sboard__perks" aria-hidden="true">{t.perks.join(" · ")}</span> : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {backers && group && (
          <section className="sboard__tier sboard__tier--backers" aria-labelledby={`${id}-backers`}>
            <header className="sboard__tierhead">
              <h3 id={`${id}-backers`}>{backers.label}</h3>
              {backers.price && <span>{backers.price}</span>}
            </header>
            <div className="sboard__crowd">
              <ul className="sboard__faces">
                {group.shown.map((p, i) => (
                  <li key={p.name} title={p.name}>
                    {p.avatar ? <img src={p.avatar} alt={p.name} /> : <span role="img" aria-label={p.name} style={{ background: `hsl(${HUES[i % HUES.length]} 40% 34%)` }}>{initials(p.name)}</span>}
                  </li>
                ))}
              </ul>
              {group.more > 0 && <span className="sboard__more">and {group.more.toLocaleString("en-US")} others</span>}
              <a className="sboard__join" href={backers.href} onClick={go(backers.href)}>Join them</a>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default SponsorBoard;
