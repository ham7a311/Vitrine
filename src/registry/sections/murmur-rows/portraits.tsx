// Original monoline portraits for the demo: white busts with ink detail on a dark disc.
type Hair = "crop" | "bun" | "curls" | "long" | "cap" | "beard" | "side" | "bob";
type Top = "collar" | "tie" | "dots" | "hoodie" | "turtle" | "stripes";

const INK = "#0d0d0d";
const SKIN = "#f7f6f2";

function hair(kind: Hair) {
  switch (kind) {
    case "crop": return <path d="M21.5 27c-.8-8.3 4.3-14 10.5-14s11.5 5.2 10.5 14c-1.4-4.6-5.4-7.6-10.5-7.6S22.9 22.4 21.5 27Z" fill={INK} />;
    case "bun": return <><circle cx="32" cy="13" r="4.2" fill={INK} /><path d="M21.6 27.5c-.6-8 4.6-13.6 10.4-13.6s11 5.6 10.4 13.6c-2-5.4-5.8-8.4-10.4-8.4s-8.4 3-10.4 8.4Z" fill={INK} /></>;
    case "curls": return <g fill={INK}>{[[23.5, 21], [25.5, 16.5], [29.5, 14], [34.5, 13.8], [38.6, 16], [41, 20.5], [42.2, 25], [21.8, 25.5]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.9" />)}</g>;
    case "long": return <path d="M19.5 46c-1.6-6.2-.6-14 .8-20.5C22 17.4 26.6 13 32 13s10 4.4 11.7 12.5c1.4 6.5 2.4 14.3.8 20.5h-4.3V27.8c-1.3-4.6-4-7.4-8.2-7.4s-6.9 2.8-8.2 7.4V46Z" fill={INK} />;
    case "cap": return <><path d="M21 25c0-7.4 5-12 11-12s11 4.6 11 12Z" fill={INK} /><path d="M38 24.5h10.5c0 1.8-1.4 3-3.2 3H38Z" fill={INK} /></>;
    case "beard": return <><path d="M22.4 25.5c.3-6.8 4.6-11.2 9.6-11.2s9.3 4.4 9.6 11.2c-2.6-3-5.8-4.4-9.6-4.4s-7 1.4-9.6 4.4Z" fill={INK} /><path d="M22.5 31c.6 6.8 4.6 11.4 9.5 11.4s8.9-4.6 9.5-11.4c-1.8 2.2-3.6 3.2-5.2 3.2-1.4-1.2-2.6-1.6-4.3-1.6s-2.9.4-4.3 1.6c-1.6 0-3.4-1-5.2-3.2Z" fill={INK} /></>;
    case "side": return <path d="M21.6 28c-1-8.6 4.2-14.6 10.8-14.6 5.8 0 10.6 4.6 10 12.4-3.2-1.4-6.4-3.8-8.6-7-2.4 4.4-6.8 7.6-12.2 9.2Z" fill={INK} />;
    case "bob": return <path d="M20.6 36c-1.4-12.2 3.6-22.6 11.4-22.6S44.8 23.8 43.4 36h-4.6c.6-3 .6-6 0-8.8-3.2-.4-6.2-2.6-8-5.6-1.6 3-4.4 5.2-7.6 5.6-.6 2.8-.6 5.8 0 8.8Z" fill={INK} />;
  }
}

function top(kind: Top) {
  const body = "M12.5 64c0-11.6 8.8-18.2 19.5-18.2S51.5 52.4 51.5 64Z";
  const base = <path d={body} fill={SKIN} stroke={INK} strokeWidth="1.8" />;
  switch (kind) {
    case "collar": return <>{base}<path d="M25.5 47.5 32 55l6.5-7.5" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" /></>;
    case "tie": return <>{base}<path d="M27 47.4 32 52l5-4.6" fill="none" stroke={INK} strokeWidth="1.8" /><path d="m32 52-2.2 3 2.2 9 2.2-9Z" fill={INK} /></>;
    case "dots": return <>{base}<g fill={INK}>{[[22, 56], [28, 60], [36, 59], [42, 55], [31, 52.5], [45, 61], [18.5, 61]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" />)}</g></>;
    case "hoodie": return <>{base}<path d="M23 47c2.4 4.6 5.6 6.8 9 6.8s6.6-2.2 9-6.8" fill="none" stroke={INK} strokeWidth="1.8" /><path d="M29.5 53.5v6M34.5 53.5v6" stroke={INK} strokeWidth="1.6" strokeLinecap="round" /></>;
    case "turtle": return <>{base}<path d="M26.5 44.6h11v4.6c-3.6 1.4-7.4 1.4-11 0Z" fill={INK} /></>;
    case "stripes": return <>{base}<path d="M15.6 55.5h32.8M13.8 60.5h36.4" stroke={INK} strokeWidth="1.8" /></>;
  }
}

export function portrait(h: Hair, t: Top, glasses = false) {
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" fill="#141414" />
      <circle cx="32" cy="32" r="31.2" fill="none" stroke="#2a2a2a" strokeWidth="1.2" />
      <g transform="translate(32 66) scale(1.08) translate(-32 -66)">
      {h === "long" && <g stroke={SKIN} strokeWidth="1.6" paintOrder="stroke">{hair(h)}</g>}
      {top(t)}
      <path d="M28.6 38.5h6.8v8.6c-2.2 1.4-4.6 1.4-6.8 0Z" fill={SKIN} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <ellipse cx="32" cy="28.5" rx="9.8" ry="11.8" fill={SKIN} stroke={INK} strokeWidth="1.8" />
      {h !== "long" && <g stroke={SKIN} strokeWidth="1.6" paintOrder="stroke">{hair(h)}</g>}
      {h === "long" && <path d="M22.4 27.4c1.6-4.6 5-7.2 9.6-7.2s8 2.6 9.6 7.2c-3.6-.8-6.8-2.6-9.6-5.4-2.8 2.8-6 4.6-9.6 5.4Z" fill={INK} />}
      <circle cx="28.3" cy="29" r="1.25" fill={INK} />
      <circle cx="35.7" cy="29" r="1.25" fill={INK} />
      {glasses && <g fill="none" stroke={INK} strokeWidth="1.4"><circle cx="28.3" cy="29" r="3.2" /><circle cx="35.7" cy="29" r="3.2" /><path d="M31.5 29h1" /></g>}
      {h !== "beard" && <path d="M29.6 34.6c1.5 1.3 3.3 1.3 4.8 0" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />}
      </g>
    </svg>
  );
}
