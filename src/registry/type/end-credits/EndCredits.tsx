import type { CSSProperties } from "react";
import "./end-credits.css";

export type Credit = { role: string; names: string[] };

export function EndCredits({ credits, seconds = 28, accent = "#e8a24a", className = "" }: { credits: Credit[]; seconds?: number; accent?: string; className?: string }) {
  const list = (
    <div className="end-credits__list">
      {credits.map((c) => (
        <div key={c.role} className="end-credits__row">
          <p className="end-credits__role">{c.role}</p>
          <div className="end-credits__rule" aria-hidden="true" />
          <ul className="end-credits__names">{c.names.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      ))}
    </div>
  );
  return (
    <div className={`end-credits ${className}`} style={{ "--ec-s": `${seconds}s`, "--ec-accent": accent } as CSSProperties} tabIndex={0} role="region" aria-label="Credits">
      <div className="end-credits__track">{list}<div aria-hidden="true">{list}</div></div>
    </div>
  );
}
