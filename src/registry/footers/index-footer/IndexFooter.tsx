"use client";

import type { CSSProperties } from "react";
import "./index-footer.css";

/**
 * Index Footer
 * Links as index entries: term, a dotted leader, a number (a count, a page,
 * a year — whatever means something for that link). Hovering or focusing an
 * entry dims every other entry, the way your eye isolates a line in a real
 * index. The colophon underneath says what it's set in.
 */

export type IndexEntry = { term: string; ref: string; href?: string };
export type IndexColumn = { letter: string; entries: IndexEntry[] };

type Props = { columns: IndexColumn[]; owner: string; colophon?: string; accent?: string; className?: string };

export function IndexFooter({ columns, owner, colophon, accent = "#e8a24a", className = "" }: Props) {
  return (
    <footer className={`index-footer ${className}`} style={{ "--if-accent": accent } as CSSProperties}>
      <div className="index-footer__head">
        <h2 className="index-footer__title">Index</h2>
        <p className="index-footer__note">Everything on this site, alphabetised.</p>
      </div>

      <div className="index-footer__cols">
        {columns.map((col) => (
          <section key={col.letter} className="index-footer__col" aria-label={`Entries under ${col.letter}`}>
            <p className="index-footer__letter" aria-hidden="true">{col.letter}</p>
            <ul>
              {col.entries.map((e) => (
                <li key={e.term}>
                  <a href={e.href ?? "#"} className="index-footer__entry" onClick={(ev) => !e.href && ev.preventDefault()}>
                    <span className="index-footer__term">{e.term}</span>
                    <span className="index-footer__leader" aria-hidden="true" />
                    <span className="index-footer__ref">{e.ref}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="index-footer__colophon">
        <span>© {new Date().getFullYear()} {owner}</span>
        {colophon && <span>{colophon}</span>}
      </div>
    </footer>
  );
}
