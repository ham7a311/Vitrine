"use client";

import { useEffect, useState, type CSSProperties } from "react";
import "./sign-off-footer.css";

/**
 * Sign-off Footer
 * Minimal, but every element is live: the local time ticks (with the offset
 * from the visitor's own time, so they know when you'll reply), availability
 * is a single dot, and the email is a pill that copies itself and says so.
 */

type Props = {
  line: string;
  email: string;
  city: string;
  timeZone: string;
  available?: boolean;
  links?: { label: string; href: string }[];
  owner: string;
  accent?: string;
  className?: string;
};

function useClock(timeZone: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return { time: "--:--:--", diff: "" };
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
  const there = new Date(now.toLocaleString("en-US", { timeZone }));
  const hours = Math.round((there.getTime() - new Date(now.toLocaleString("en-US")).getTime()) / 36e5);
  const diff = hours === 0 ? "same time as you" : `${Math.abs(hours)}h ${hours > 0 ? "ahead of" : "behind"} you`;
  return { time, diff };
}

export function SignOffFooter({ line, email, city, timeZone, available = true, links = [], owner, accent = "#b9cce4", className = "" }: Props) {
  const { time, diff } = useClock(timeZone);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard?.writeText(email); } catch { /* still confirm */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className={`sign-off-footer ${className}`} style={{ "--so-accent": accent } as CSSProperties}>
      <p className="sign-off-footer__line">{line}</p>

      <div className="sign-off-footer__row">
        <button type="button" className="sign-off-footer__email" onClick={copy} data-copied={copied || undefined} aria-label={`Copy email address ${email}`}>
          <span className="sign-off-footer__stage" aria-hidden="true">
            <span>{email}</span>
            <span>Copied — talk soon</span>
          </span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path className="sign-off-footer__copy" d="M5.5 5.5h7v7h-7zM10.5 5.5V3.5h-7v7h2" />
            <path className="sign-off-footer__tick" d="M3.5 8.5l3 3 6-7" />
          </svg>
        </button>

        <div className="sign-off-footer__meta">
          <p><i data-on={available || undefined} aria-hidden="true" />{available ? "Available for new work" : "Booked until spring"}</p>
          <p className="sign-off-footer__clock">
            <b>{time}</b> in {city} <span>· {diff}</span>
          </p>
        </div>
      </div>

      <div className="sign-off-footer__base">
        <span>© {new Date().getFullYear()} {owner}</span>
        <nav aria-label="Elsewhere">
          {links.map((l) => <a key={l.label} href={l.href} onClick={(e) => l.href === "#" && e.preventDefault()}>{l.label}</a>)}
        </nav>
        <a href="#top" className="sign-off-footer__top" onClick={(e) => { e.preventDefault(); (e.currentTarget.closest("[data-scroll]") ?? window).scrollTo?.({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a>
      </div>
      <p className="sign-off-footer__sr" aria-live="polite">{copied ? "Email copied" : ""}</p>
    </footer>
  );
}
