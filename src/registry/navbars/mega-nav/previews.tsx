/* Small schematic drawings of what is behind a link: enough to recognise the kind of page, nothing more. */

export type PreviewKind = "form" | "map" | "chart" | "flow" | "list" | "code" | "people" | "doc";

export function Schematic({ kind }: { kind: PreviewKind }) {
  return (
    <svg className="mgnv__schem" viewBox="0 0 240 132" aria-hidden="true" data-kind={kind}>
      <rect className="mgnv__s-bg" x="0.5" y="0.5" width="239" height="131" rx="8" />
      {kind === "form" && (
        <g>
          {[22, 54, 86].map((y, i) => (
            <g key={y}>
              <rect className="mgnv__s-ink" x="20" y={y} width={[38, 52, 30][i]} height="4" rx="2" />
              <rect className="mgnv__s-box" x="20" y={y + 9} width="132" height="14" rx="3" />
            </g>
          ))}
          <rect className="mgnv__s-acc" x="168" y="96" width="52" height="16" rx="4" />
          <rect className="mgnv__s-box" x="168" y="31" width="52" height="46" rx="4" />
          <path className="mgnv__s-line" d="M176 66l10-12 8 7 8-10 10 15" />
        </g>
      )}
      {kind === "map" && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} className="mgnv__s-line" d={`M${-10 + i * 8} ${120 - i * 6}C${50 + i * 6} ${60 - i * 9} ${110 - i * 4} ${130 - i * 14} ${250} ${40 + i * 12}`} />
          ))}
          <circle className="mgnv__s-acc" cx="82" cy="58" r="5" />
          <circle className="mgnv__s-ink" cx="152" cy="84" r="4" />
          <circle className="mgnv__s-ink" cx="186" cy="40" r="4" />
          <rect className="mgnv__s-panel" x="14" y="14" width="64" height="30" rx="4" />
          <rect className="mgnv__s-ink" x="22" y="22" width="34" height="4" rx="2" />
          <rect className="mgnv__s-mute" x="22" y="31" width="46" height="4" rx="2" />
        </g>
      )}
      {kind === "chart" && (
        <g>
          {[46, 70, 38, 88, 62, 96, 74].map((h, i) => (
            <rect key={i} className={i === 5 ? "mgnv__s-acc" : "mgnv__s-ink"} x={22 + i * 22} y={112 - h} width="12" height={h} rx="2" opacity={i === 5 ? 1 : 0.75} />
          ))}
          <path className="mgnv__s-line" d="M20 112h200" />
          <rect className="mgnv__s-mute" x="20" y="14" width="56" height="5" rx="2.5" />
        </g>
      )}
      {kind === "flow" && (
        <g>
          <path className="mgnv__s-line" d="M62 40h28M62 40v52h28M150 40h28v26M150 92h28V66" />
          <rect className="mgnv__s-box" x="18" y="28" width="44" height="24" rx="5" />
          <rect className="mgnv__s-box" x="90" y="28" width="60" height="24" rx="5" />
          <rect className="mgnv__s-box" x="90" y="80" width="60" height="24" rx="5" />
          <rect className="mgnv__s-acc" x="178" y="54" width="44" height="24" rx="5" />
          <rect className="mgnv__s-ink" x="26" y="38" width="26" height="4" rx="2" />
          <rect className="mgnv__s-ink" x="98" y="38" width="36" height="4" rx="2" />
          <rect className="mgnv__s-ink" x="98" y="90" width="30" height="4" rx="2" />
        </g>
      )}
      {kind === "list" && (
        <g>
          {[18, 42, 66, 90].map((y, i) => (
            <g key={y}>
              <rect className={i === 1 ? "mgnv__s-acc" : "mgnv__s-box"} x="20" y={y + 2} width="12" height="12" rx="3" />
              <rect className="mgnv__s-ink" x="42" y={y + 4} width={[96, 120, 70, 104][i]} height="5" rx="2.5" />
              <rect className="mgnv__s-mute" x="176" y={y + 4} width="44" height="5" rx="2.5" />
              <path className="mgnv__s-line" d={`M20 ${y + 22}h200`} opacity="0.5" />
            </g>
          ))}
        </g>
      )}
      {kind === "code" && (
        <g>
          {[[20, 40, 60], [36, 70, 30], [36, 48, 52], [52, 90, 0], [36, 30, 40], [20, 24, 0]].map(([x, w1, w2], i) => (
            <g key={i}>
              <rect className={i === 3 ? "mgnv__s-acc" : "mgnv__s-ink"} x={x} y={20 + i * 16} width={w1} height="5" rx="2.5" opacity={i === 3 ? 1 : 0.8} />
              {w2 > 0 && <rect className="mgnv__s-mute" x={x + w1 + 8} y={20 + i * 16} width={w2} height="5" rx="2.5" />}
            </g>
          ))}
        </g>
      )}
      {kind === "people" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle className={i === 0 ? "mgnv__s-acc" : "mgnv__s-box"} cx={44 + i * 50} cy="52" r="16" />
              <rect className="mgnv__s-ink" x={28 + i * 50} y="80" width="32" height="5" rx="2.5" />
              <rect className="mgnv__s-mute" x={32 + i * 50} y="91" width="24" height="4" rx="2" />
            </g>
          ))}
        </g>
      )}
      {kind === "doc" && (
        <g>
          <rect className="mgnv__s-ink" x="20" y="20" width="110" height="8" rx="3" />
          {[42, 54, 66, 78].map((y, i) => (
            <rect key={y} className="mgnv__s-mute" x="20" y={y} width={[150, 138, 156, 96][i]} height="5" rx="2.5" />
          ))}
          <rect className="mgnv__s-box" x="20" y="94" width="96" height="22" rx="4" />
          <rect className="mgnv__s-acc" x="186" y="20" width="34" height="34" rx="6" />
        </g>
      )}
    </svg>
  );
}
