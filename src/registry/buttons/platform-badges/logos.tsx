import { useId } from "react";

/* Platform marks drawn for this component, simplified to read at 16–32px. All but the Play mark use currentColor. */

export function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark">
      <path fill="currentColor" d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.2 3.09 3.79 3.04 1.52-.07 2.09-.99 3.93-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.63-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09ZM15.53 3.83c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.67.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.71-.69 3.55-1.7Z" />
    </svg>
  );
}

export function WindowsMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark">
      <path fill="currentColor" d="M2.5 2.5h9.1v9.1H2.5zM12.4 2.5h9.1v9.1h-9.1zM2.5 12.4h9.1v9.1H2.5zM12.4 12.4h9.1v9.1h-9.1z" />
    </svg>
  );
}

export function StoreBagMark() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="#fff" />
          <path fill="#000" d="M8.2 10.6h3.5v3.5H8.2zM12.3 10.6h3.5v3.5h-3.5zM8.2 14.7h3.5v3.5H8.2zM12.3 14.7h3.5v3.5h-3.5z" />
        </mask>
      </defs>
      <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M8.6 7.6V6.1a3.4 3.4 0 0 1 6.8 0v1.5" />
      <rect x="3" y="7.4" width="18" height="14" rx="1.6" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

export function PenguinMark() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="#fff" />
          <ellipse cx="12" cy="15.6" rx="3.9" ry="4.9" fill="#000" />
          <ellipse cx="10.3" cy="5.7" rx="1.05" ry="1.35" fill="#000" />
          <ellipse cx="13.7" cy="5.7" rx="1.05" ry="1.35" fill="#000" />
          <path d="M9.9 8.1 12 7.2l2.1.9L12 10Z" fill="#000" />
        </mask>
      </defs>
      <g fill="currentColor">
        <path mask={`url(#${id})`} d="M12 1.2c-2.6 0-4.3 2.1-4.3 4.9 0 1.2.3 2.2.1 3.1-.3 1.5-2.6 3.6-3.1 6.4-.4 2.3.6 4.6 2.5 5.4h9.6c1.9-.8 2.9-3.1 2.5-5.4-.5-2.8-2.8-4.9-3.1-6.4-.2-.9.1-1.9.1-3.1 0-2.8-1.7-4.9-4.3-4.9Z" />
        <path d="M10.4 8.2 12 7.6l1.6.6L12 9.5Z" />
        <path d="M4.3 20.2c.3-1.3 1.6-1.9 2.8-1.5l1.7 1.4c.7.6.5 1.7-.4 1.9-1.3.3-3.1.3-3.8-.4-.3-.4-.4-.9-.3-1.4ZM19.7 20.2c-.3-1.3-1.6-1.9-2.8-1.5l-1.7 1.4c-.7.6-.5 1.7.4 1.9 1.3.3 3.1.3 3.8-.4.3-.4.4-.9.3-1.4Z" />
      </g>
    </svg>
  );
}

export function RobotMark() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="#fff" />
          <circle cx="8.9" cy="13.6" r="1.05" fill="#000" />
          <circle cx="15.1" cy="13.6" r="1.05" fill="#000" />
        </mask>
      </defs>
      <path fill="currentColor" mask={`url(#${id})`} d="M3.8 17.6a8.2 8.2 0 0 1 16.4 0Z" />
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M7.4 10.6 5.6 7.6M16.6 10.6l1.8-3" />
    </svg>
  );
}

/** The play triangle in its four colours; it stays coloured on every badge style. */
export function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="pbdg__mark pbdg__mark--color">
      <path fill="#4285f4" d="M3.6 1.9 13.4 12l-9.8 10.1c-.3-.2-.5-.6-.5-1.1V3c0-.5.2-.9.5-1.1Z" />
      <path fill="#34a853" d="M3.6 1.9c.4-.3 1-.3 1.6 0L16.8 8.6 13.4 12Z" />
      <path fill="#fbbc04" d="M16.8 8.6l3.3 1.9c1.2.7 1.2 2.3 0 3l-3.3 1.9L13.4 12Z" />
      <path fill="#ea4335" d="M13.4 12l3.4 3.4-11.6 6.7c-.6.3-1.2.3-1.6 0Z" />
    </svg>
  );
}
