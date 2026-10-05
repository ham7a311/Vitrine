"use client";
import { useId, useMemo, useState, type CSSProperties } from "react";
import type { RecoveryLink } from "../recovery";
import { traceRoute, normalisePath, type TraceRoute } from "./trace";
import "./trace-404.css";

export type Trace404Props = {
  /** The address that was requested, e.g. from your router's 404 handler. */
  path: string;
  /** Every real route on the site; the trace walks these to find where the request stopped. */
  routes: TraceRoute[];
  /** Shown on the first hop. */
  host?: string;
  home?: RecoveryLink;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  /** Called when the trace is run again, e.g. to log the miss. */
  onRetrace?: () => void;
  /** Turn a route path into a link, e.g. to add a locale or base path. Defaults to the path itself. */
  hrefFor?: (path: string) => string;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Trace 404
 * The missing page as a route trace: each segment of the address is a hop,
 * the hops that answer get a tick, and the first one that doesn't times out
 * with three probes. The routes that really live under the last good hop
 * are offered as the way on.
 */
export function Trace404({ path, routes, host = "masar.app", home = { label: "Home", href: "/" }, theme = "paper", motion = "auto", onRetrace, hrefFor = (p: string) => p, className = "" }: Trace404Props) {
  const titleId = useId();
  const [run, setRun] = useState(0);
  const { hops, lastGood, next } = useMemo(() => traceRoute(path, routes), [path, routes]);
  const requested = normalisePath(path);
  const failed = hops.find((h) => !h.found);
  const failedAt = failed ? hops.indexOf(failed) + 1 : 0;
  const goodLabel = hops.find((h) => h.path === lastGood)?.label;

  return (
    <section className={`tr404 tr404--${theme} ${className}`} data-motion={motion} aria-labelledby={titleId}>
      <div className="tr404__grid">
        <div className="tr404__copy">
          <p className="tr404__eyebrow">404 · Route trace</p>
          <h1 id={titleId} className="tr404__title">
            {failed ? <>The trail goes cold after <code>{lastGood}</code>.</> : <>Every hop answered, but the page is gone.</>}
          </h1>
          <p className="tr404__lede">
            {failed
              ? <>Nothing lives at <code>{requested}</code>. Hop {pad(failedAt - 1)} is the last address that answered.</>
              : <>Each part of <code>{requested}</code> exists, so the page itself was removed. Try the routes beside it.</>}
          </p>
          <div className="tr404__actions">
            <a className="tr404__primary" href={hrefFor(lastGood)}>Back to {goodLabel ?? lastGood}</a>
            <button type="button" className="tr404__secondary" onClick={() => { setRun((r) => r + 1); onRetrace?.(); }}>Trace again</button>
          </div>
        </div>

        <div className="tr404__panel">
          <p className="tr404__request"><span>GET</span> {host}{requested}</p>
          <ol className="tr404__hops" key={run} aria-label="Route trace">
            {hops.map((hop, i) => (
              <li key={hop.path} className="tr404__hop" data-found={hop.found} style={{ "--i": i } as CSSProperties}>
                <span className="tr404__no" aria-hidden="true">{pad(i + 1)}</span>
                <span className="tr404__node" aria-hidden="true" />
                <span className="tr404__path">{i === 0 ? host : hop.path}</span>
                <span className="tr404__label">{hop.found ? hop.label ?? (i === 0 ? "edge" : "route") : "no route"}</span>
                <span className="tr404__status">
                  {hop.found ? <><span aria-hidden="true">✓</span><span className="tr404__sr">answered</span></>
                    : <><span className="tr404__probe" aria-hidden="true"><b>*</b> <b>*</b> <b>*</b></span><span className="tr404__sr">did not answer</span></>}
                </span>
              </li>
            ))}
          </ol>

          {next.length > 0 && (
            <nav className="tr404__next" aria-label={`Routes under ${lastGood}`}>
              <p className="tr404__nextlabel">From hop {pad(hops.findIndex((h) => h.path === lastGood) + 1)}, these answer:</p>
              <ul>
                {next.map((route) => (
                  <li key={route.href}><a href={hrefFor(normalisePath(route.href))}><span>{route.label ?? route.href}</span><code>{normalisePath(route.href)}</code></a></li>
                ))}
              </ul>
            </nav>
          )}
          <a className="tr404__home" href={home.href}>{home.label}</a>
        </div>
      </div>
    </section>
  );
}
