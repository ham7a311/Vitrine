/* Sign-in provider marks, drawn inline. `mono` draws each in the current text colour. */
export type ProviderId = "google" | "github" | "microsoft" | "apple";

export const PROVIDER_NAMES: Record<ProviderId, string> = { google: "Google", github: "GitHub", microsoft: "Microsoft", apple: "Apple" };

const GOOGLE = [
  ["#FBBC05", "M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"],
  ["#EA4335", "M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"],
  ["#34A853", "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"],
  ["#4285F4", "M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"],
] as const;
const GITHUB = "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3";
const APPLE = "M16.4 1.4c0 1.1-.5 2.3-1.2 3.1-.7.9-2 1.6-3 1.6-.1 0-.2 0-.3-.1V5.7c0-1.1.6-2.3 1.2-3 .8-.9 2.1-1.6 3.2-1.7.1.2.1.3.1.4zm4.6 15.7c0 .1-.5 1.6-1.5 3.1-.9 1.3-1.9 2.7-3.4 2.7s-1.9-.9-3.6-.9c-1.7 0-2.3.9-3.7.9s-2.3-1.3-3.4-2.8C4 18.3 3 15.5 3 12.8c0-4.3 2.8-6.6 5.6-6.6 1.4 0 2.7 1 3.6 1 .9 0 2.2-1 3.9-1 .6 0 2.9.1 4.4 2.2-.1.1-2.4 1.4-2.4 4.2 0 3.3 2.9 4.4 2.9 4.5z";

export function ProviderMark({ id, mono = false, size = 18 }: { id: ProviderId; mono?: boolean; size?: number }) {
  if (id === "google") return (
    <svg width={size} height={size} viewBox="4 4 40 40" aria-hidden="true">{GOOGLE.map(([c, d]) => <path key={c} d={d} fill={mono ? "currentColor" : c} />)}</svg>
  );
  if (id === "github") return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={GITHUB} fill="currentColor" /></svg>;
  if (id === "apple") return <svg width={size} height={size} viewBox="2 0 20 24" aria-hidden="true"><path d={APPLE} fill="currentColor" /></svg>;
  const sq = mono ? ["currentColor", "currentColor", "currentColor", "currentColor"] : ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"];
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden="true">
      <rect x="0" y="0" width="10" height="10" fill={sq[0]} /><rect x="11" y="0" width="10" height="10" fill={sq[1]} opacity={mono ? 0.75 : 1} />
      <rect x="0" y="11" width="10" height="10" fill={sq[2]} opacity={mono ? 0.75 : 1} /><rect x="11" y="11" width="10" height="10" fill={sq[3]} opacity={mono ? 0.5 : 1} />
    </svg>
  );
}

/** A small spinner in the current colour. */
export const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg className="dsign__spin" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" /><path d="M8 1.5A6.5 6.5 0 0 1 14.5 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);
