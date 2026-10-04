import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><circle cx="9" cy="9" r="5.5" /><path d="m13 13 3.5 3.5" /></svg>
);
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M4 10h11M11 5.5 15.5 10 11 14.5" /></svg>
);
export const ArrowUp = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M10 16V5M5.5 9 10 4.5 14.5 9" /></svg>
);
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M16 10H5M9 5.5 4.5 10 9 14.5" /></svg>
);
export const CopyIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><rect x="6.5" y="6.5" width="9" height="9" rx="1.5" /><path d="M13.5 4.5H5.8c-.7 0-1.3.6-1.3 1.3v7.7" /></svg>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M4.5 10.5 8.2 14 15.5 6.5" pathLength={1} /></svg>
);
export const ReplayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1M4.5 4v3.5H8" /></svg>
);
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M3.5 7h13M3.5 13h13" /></svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="m5 5 10 10M15 5 5 15" /></svg>
);
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="m10 3 2.1 4.4 4.8.6-3.5 3.3.9 4.7L10 13.7 5.7 16l.9-4.7L3.1 8l4.8-.6L10 3Z" /></svg>
);
export const GitHubIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);
export const DesktopIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><rect x="2.5" y="4" width="15" height="10" rx="1.2" /><path d="M7 17h6" /></svg>
);
export const TabletIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><rect x="4.5" y="2.5" width="11" height="15" rx="1.5" /><path d="M9 15h2" /></svg>
);
export const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><rect x="6" y="2.5" width="8" height="15" rx="1.5" /><path d="M9.2 15h1.6" /></svg>
);
export const ExpandIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...base} {...p}><path d="M12 3.5h4.5V8M8 16.5H3.5V12M16.5 3.5l-5 5M3.5 16.5l5-5" /></svg>
);
