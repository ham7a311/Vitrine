"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { RecoveryLink } from "../recovery";
import { followRedirects, normaliseAddress, type Redirect } from "./forwarding";
import "./forwarding-404.css";

export type Forwarding404Props = {
  /** The address that was requested. */
  path: string;
  /** Your redirect table: every retired address and where it went. */
  redirects: Redirect[];
  home?: RecoveryLink;
  /** Called with the query when nothing forwards; omit to hide the search field. */
  onSearch?: (query: string) => void;
  /** Turn an address into a link, e.g. to add a base path. */
  hrefFor?: (path: string) => string;
  /** Shown before the address when copying the new link, e.g. "https://masar.app". */
  origin?: string;
  locale?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

function formatDate(iso: string | undefined, locale?: string) {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(d);
}

/**
 * Forwarding 404
 * For addresses that used to work. The redirect table is followed from the
 * requested address to wherever it lives now, and the trail is drawn down a
 * single rail: each retired address struck through, each move dated and
 * explained, the live address last and actionable.
 */
export function Forwarding404({ path, redirects, home = { label: "Home", href: "/" }, onSearch, hrefFor = (p) => p, origin = "", locale, theme = "paper", motion = "auto", className = "" }: Forwarding404Props) {
  const titleId = useId();
  const { steps, final, loop } = useMemo(() => followRedirects(path, redirects), [path, redirects]);
  const requested = normaliseAddress(path);
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const state = loop ? "loop" : steps.length ? "moved" : "none";
  const retired = formatDate(steps[0]?.date, locale);

  const copyLink = async () => {
    clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(origin + final); setCopy("done"); }
    catch { setCopy("failed"); }
    timer.current = setTimeout(() => setCopy("idle"), 2400);
  };
  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    if (q) onSearch?.(q);
  };

  const stops = [requested, ...steps.map((s) => normaliseAddress(s.to))];

  return (
    <section className={`fw404 fw404--${theme} ${className}`} data-motion={motion} data-state={state} aria-labelledby={titleId}>
      <div className="fw404__column">
        <p className="fw404__eyebrow">404 · Forwarding record</p>
        <h1 id={titleId} className="fw404__title">
          {state === "moved" ? "This page moved on." : state === "loop" ? "This address goes round in circles." : "No forwarding address."}
        </h1>
        <p className="fw404__lede">
          {state === "moved" && <><code>{requested}</code> {retired ? <>was retired on {retired}</> : <>was retired</>}.{steps.length > 1 ? <> It has lived at {steps.length} addresses since; here is the trail.</> : <> Here is where it went.</>}</>}
          {state === "loop" && <>The redirects for <code>{requested}</code> lead back to an address already on the trail, so nothing can be forwarded. The site's redirect table needs fixing.</>}
          {state === "none" && <>There's no record of <code>{requested}</code> ever moving, so it may never have existed. Search for what you were after, or start from home.</>}
        </p>

        {state !== "none" && (
          <ol className="fw404__trail" aria-label="Forwarding trail">
            {stops.map((stop, i) => {
              const move = steps[i - 1];
              const last = i === stops.length - 1;
              const live = last && state === "moved";
              return (
                <li key={`${stop}-${i}`} className="fw404__stop" data-live={live || undefined} data-loop={last && loop || undefined} style={{ "--i": i } as CSSProperties}>
                  {move && <p className="fw404__move"><span>{move.reason ?? "Moved"}</span>{move.date && <time dateTime={move.date}>{formatDate(move.date, locale)}</time>}</p>}
                  <p className="fw404__address">
                    {live ? <a href={hrefFor(stop)}><code>{stop}</code></a> : <code><s>{stop}</s></code>}
                    {i === 0 && <span className="fw404__tag">You asked for this</span>}
                    {live && <span className="fw404__tag">Lives here now</span>}
                    {last && loop && <span className="fw404__tag">Back to an earlier stop</span>}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        <div className="fw404__actions">
          {state === "moved" && <>
            <a className="fw404__primary" href={hrefFor(final)}>Continue to {final}</a>
            <button type="button" className="fw404__secondary" onClick={copyLink}>{copy === "done" ? "Copied new link" : "Copy new link"}</button>
          </>}
          {state !== "moved" && <a className="fw404__primary" href={home.href}>{home.label}</a>}
        </div>
        <p className="fw404__status" role="status">{copy === "done" ? "New link copied." : copy === "failed" ? `Copying isn't available here. The new address is ${origin}${final}.` : ""}</p>

        {state !== "moved" && onSearch && (
          <form className="fw404__search" role="search" onSubmit={search}>
            <label htmlFor={`${titleId}-q`}>Search the site</label>
            <div><input id={`${titleId}-q`} name="q" type="search" placeholder="Pricing, invoices, API…" autoComplete="off" /><button type="submit">Search</button></div>
          </form>
        )}
        {state === "moved" && <a className="fw404__home" href={home.href}>{home.label}</a>}
      </div>
    </section>
  );
}
