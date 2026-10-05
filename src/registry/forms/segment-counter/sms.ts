/**
 * How a text message is billed. Plain text uses the 7-bit GSM alphabet (160
 * characters, or 153 per part once split); a single character outside it,
 * such as an emoji or a curly quote, switches the whole message to UCS-2
 * (70, or 67 per part). A few GSM characters cost two units.
 */
const BASIC = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const EXTENDED = "^{}\\[~]|€\f";
const basic = new Set(BASIC), extended = new Set(EXTENDED);

export type Encoding = "GSM-7" | "UCS-2";
export type Segment = { start: number; end: number; units: number };
export type Analysis = {
  encoding: Encoding;
  /** Characters (by code point) that forced UCS-2, with their positions. */
  culprits: { char: string; index: number }[];
  /** GSM characters that cost two units. */
  doubles: { char: string; index: number }[];
  units: number;
  perSegment: number;
  segments: Segment[];
  /** Units left before another segment starts. */
  remaining: number;
};

export function analyse(text: string): Analysis {
  const chars = [...text];
  const culprits: Analysis["culprits"] = [], doubles: Analysis["doubles"] = [];
  let index = 0;
  for (const c of chars) {
    if (!basic.has(c) && !extended.has(c)) culprits.push({ char: c, index });
    else if (extended.has(c)) doubles.push({ char: c, index });
    index += c.length;
  }
  const encoding: Encoding = culprits.length ? "UCS-2" : "GSM-7";
  const cost = (c: string) => (encoding === "GSM-7" ? (extended.has(c) ? 2 : 1) : c.length);
  const units = chars.reduce((a, c) => a + cost(c), 0);
  const single = encoding === "GSM-7" ? 160 : 70, multi = encoding === "GSM-7" ? 153 : 67;
  const perSegment = units <= single ? single : multi;
  // Split without breaking a two-unit character across parts.
  const segments: Segment[] = [];
  let start = 0, used = 0, pos = 0;
  for (const c of chars) {
    const u = cost(c);
    if (used + u > perSegment) { segments.push({ start, end: pos, units: used }); start = pos; used = 0; }
    used += u; pos += c.length;
  }
  if (used || !segments.length) segments.push({ start, end: pos, units: used });
  return { encoding, culprits, doubles, units, perSegment, segments, remaining: perSegment - (segments[segments.length - 1]?.units ?? 0) };
}

/** A GSM-safe spelling for common culprits, so one stray character needn't halve the limit. */
export const SWAPS: Record<string, string> = { "’": "'", "‘": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", " ": " " };
export const fixable = (c: string) => c in SWAPS;
