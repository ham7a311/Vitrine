/**
 * The Vitrine mark: an object with its pane of glass hinged at the corner and
 * tilted open — the collection is on display, and no longer locked away.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="4" y="12" width="16" height="9" rx="2.2" fill="currentColor" />
      <g transform="rotate(-22 4 10.6)">
        <rect x="4" y="8" width="16.5" height="2.6" rx="1.3" fill="#b9cce4" />
      </g>
    </svg>
  );
}

/**
 * The wordmark, outlined from Newsreader (opsz 72). The second tittle is the pane, lifted and in frost.
 * The outline is drawn by CSS (.site-wordmark in globals.css, as a mask held once in the cached stylesheet), so
 * it is not repeated in every page's HTML and React payload; the lettering takes the current text colour.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`site-wordmark ${className}`} role="img" aria-label="Vitrine">
      <span className="site-wordmark__ink" />
    </span>
  );
}
