"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./league-table.css";

export type LeagueRow = { id: string; name: string; xp: number; you?: boolean };
export type LeagueTableProps = {
  league: string;
  daysLeft: number;
  rows: LeagueRow[];
  /** How many top places move up a league. */
  promote?: number;
  /** How many bottom places move down. */
  demote?: number;
  onRankChange?: (rank: number, previous: number) => void;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

const HUES = ["#ff9600", "#1cb0f6", "#ce82ff", "#ff4b4b", "#58cc02", "#ff86d0", "#2b70c9"];
const hue = (name: string) => HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ordinal(n: number, locale?: string) {
  const rule = new Intl.PluralRules(locale ?? "en", { type: "ordinal" }).select(n);
  return `${n}${({ one: "st", two: "nd", few: "rd", other: "th" } as Record<string, string>)[rule] ?? "th"}`;
}

/**
 * League Table
 * A weekly leaderboard with its stakes drawn in: a green line under the
 * places that move up, a red line over the places that move down, and your
 * row raised. When the points change, the rows slide into their new order.
 */
export function LeagueTable({ league, daysLeft, rows, promote = 3, demote = 2, onRankChange, locale, theme = "light", className = "" }: LeagueTableProps) {
  const ranked = useMemo(() => [...rows].sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name)), [rows]);
  const nodes = useRef(new Map<string, HTMLLIElement>());
  const youRank = ranked.findIndex((r) => r.you) + 1;
  const lastRank = useRef(youRank);
  const [moved, setMoved] = useState<number>(0);
  const [announce, setAnnounce] = useState("");
  const xpFmt = new Intl.NumberFormat(locale);

  // FLIP with offsetTop, which running transforms don't affect: compare with where rows sat last commit.
  const last = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const prev = last.current;
    const now = new Map([...nodes.current].map(([k, el]) => [k, el.offsetTop]));
    last.current = now;
    if (reduced()) return;
    nodes.current.forEach((el, key) => {
      const was = prev.get(key), is = now.get(key);
      if (was === undefined || is === undefined || Math.abs(was - is) < 1) return;
      el.animate([{ transform: `translateY(${was - is}px)` }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }, [ranked]);

  useEffect(() => {
    const prev = lastRank.current;
    if (!youRank || prev === youRank) return;
    lastRank.current = youRank;
    setMoved(prev - youRank);
    setAnnounce(prev > youRank ? `You moved up to ${ordinal(youRank, locale)} place.` : `You dropped to ${ordinal(youRank, locale)} place.`);
    onRankChange?.(youRank, prev);
    const t = setTimeout(() => setMoved(0), 2600);
    return () => clearTimeout(t);
  }, [youRank, locale, onRankChange]);

  const zone = (rank: number) => (rank <= promote ? "up" : rank > ranked.length - demote ? "down" : "stay");

  return (
    <section className={`league league--${theme} ${className}`} aria-label={`${league}, weekly leaderboard`}>
      <header className="league__head">
        <svg className="league__badge" viewBox="0 0 48 52" aria-hidden="true"><path d="M24 2l20 7v15c0 13-8.5 22-20 26C12.5 46 4 37 4 24V9z" /><path className="league__badge-mark" d="M24 14l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L24 31.5l-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z" /></svg>
        <div className="league__title-wrap">
          <h3 className="league__title">{league}</h3>
          <p className="league__rule">Top {promote} advance to the next league</p>
        </div>
        <p className="league__days"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>{daysLeft} {daysLeft === 1 ? "day" : "days"}</p>
      </header>

      <ol className="league__list">
        {ranked.map((row, i) => {
          const rank = i + 1;
          const z = zone(rank);
          return (
            <Fragment key={row.id}>
              {rank === ranked.length - demote + 1 && demote > 0 && (
                <li className="league__zone" data-zone="down" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 3v10M4 9l4 4 4-4" /></svg>Demotion zone</li>
              )}
              <li
                ref={(el) => { if (el) nodes.current.set(row.id, el); else nodes.current.delete(row.id); }}
                className="league__row"
                data-you={row.you || undefined}
                data-zone={z}
                aria-current={row.you ? "true" : undefined}
              >
                <span className="league__rank" data-medal={rank <= 3 ? rank : undefined}>{rank}</span>
                <span className="league__avatar" style={{ background: hue(row.name) }} aria-hidden="true">{initials(row.name)}</span>
                <span className="league__name">
                  <span className="league__who">{row.name}{row.you && <span className="league__you"> (you)</span>}</span>
                  {row.you && moved !== 0 && <span className="league__moved" data-dir={moved > 0 ? "up" : "down"} aria-hidden="true">{moved > 0 ? "▲" : "▼"}{Math.abs(moved)}</span>}
                </span>
                <span className="league__xp">{xpFmt.format(row.xp)} XP</span>
                <span className="league__sr">{`, ${ordinal(rank, locale)} place${z === "up" ? ", in the promotion zone" : z === "down" ? ", in the demotion zone" : ""}`}</span>
              </li>
              {rank === promote && promote < ranked.length && (
                <li className="league__zone" data-zone="up" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 13V3M4 7l4-4 4 4" /></svg>Promotion zone</li>
              )}
            </Fragment>
          );
        })}
      </ol>
      <p className="league__sr" aria-live="polite">{announce}</p>
    </section>
  );
}
