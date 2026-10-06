import type { ReactNode } from "react";

/* Ten solid glyphs drawn for this component on a 24-unit grid. */

export type TileIcon = "globe" | "redesign" | "cart" | "stack" | "send" | "puzzle" | "bolt" | "pointer" | "rocket" | "tools";

const P: Record<TileIcon, ReactNode> = {
  globe: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" />
      <path d="M4.8 7.2h14.4M4.8 16.8h14.4" strokeWidth="1.4" />
    </g>
  ),
  redesign: (
    <g fill="currentColor">
      <path d="M5 4h8.6l-2.2 2.2H5.6c-.3 0-.6.3-.6.6v11.6c0 .3.3.6.6.6h11.6c.3 0 .6-.3.6-.6v-5.8l2.2-2.2V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
      <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9l-8.7 8.7-3.9 1 1-3.9Z" />
    </g>
  ),
  cart: (
    <g fill="currentColor">
      <path d="M6.2 4h14.9c.6 0 1 .6.8 1.2l-2.3 7.3c-.2.6-.7.9-1.3.9H9.1l.5 2H19v2H8.1c-.5 0-.9-.3-1-.8L4.5 6H2V4h2.8c.5 0 .9.3 1 .8Z" />
      <circle cx="9.4" cy="20" r="1.6" /><circle cx="17.6" cy="20" r="1.6" />
    </g>
  ),
  stack: (
    <g fill="currentColor">
      <rect x="3" y="3.6" width="18" height="4.6" rx="1.3" /><rect x="3" y="9.7" width="18" height="4.6" rx="1.3" /><rect x="3" y="15.8" width="18" height="4.6" rx="1.3" />
    </g>
  ),
  send: <path fill="currentColor" d="M21.6 2.6 2.8 10.3c-.8.3-.8 1.4 0 1.7l6.5 2.4 2.4 6.5c.3.8 1.4.8 1.7 0ZM9.9 13.3l7.4-6.6-6.1 7.7Z" />,
  puzzle: (
    <path fill="currentColor" d="M9 3.6a2.4 2.4 0 0 1 4.8 0V5h4.1c.6 0 1.1.5 1.1 1.1v4.1h-1.4a2.4 2.4 0 0 0 0 4.8H19v4.9c0 .6-.5 1.1-1.1 1.1h-4.9v-1.4a2.4 2.4 0 0 0-4.8 0V21H4.1C3.5 21 3 20.5 3 19.9V15h1.6a2.4 2.4 0 0 0 0-4.8H3V6.1C3 5.5 3.5 5 4.1 5H9Z" />
  ),
  bolt: (
    <g fill="currentColor">
      <path d="M14.6 2 6.5 13.2h5.2L9.9 22l8.3-11.6H13Z" />
      <path d="M3 8.4h3.4M2 11.6h2.6M4 15h1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  pointer: <path fill="currentColor" d="M20.6 3.4 3.2 10.7c-.9.4-.8 1.6.1 1.9l6.8 1.4 1.4 6.8c.2.9 1.5 1 1.9.1Z" />,
  rocket: (
    <g fill="currentColor">
      <path d="M20.8 3.2c-4.4-.3-8.3 1.4-11 4.6L8 10 4.6 9.2 2.8 11l4.2 1.6 4.4 4.4 1.6 4.2 1.8-1.8-.8-3.4 2.2-1.8c3.2-2.7 4.9-6.6 4.6-11Zm-4.6 6.6a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Z" />
      <path d="M6.2 15.4c-1.6.4-2.6 2-2.8 4.4 2.4-.2 4-1.2 4.4-2.8Z" />
    </g>
  ),
  tools: (
    <g fill="currentColor">
      <path d="M15.3 2.4c-2.4 0-4.4 2-4.4 4.4 0 .5.1 1 .2 1.4l-8 8a2 2 0 0 0 2.8 2.8l8-8c.4.2.9.2 1.4.2 2.4 0 4.4-2 4.4-4.4 0-.6-.1-1.1-.3-1.6l-2.6 2.6-2.4-.5-.5-2.4 2.6-2.6c-.5-.2-1-.3-1.6-.3Z" />
      <path d="M3.4 3.4 5 2.6l4.1 4.1-1.5 1.5Zm8.1 10.4 1.5-1.5 6.2 6.2a1.1 1.1 0 0 1-1.5 1.5Z" />
    </g>
  ),
};

export function Icon({ name }: { name: TileIcon }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="sigt__icon">{P[name]}</svg>;
}
