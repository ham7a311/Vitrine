export type RecoveryCode = { code: string; used?: boolean };

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o, 1/l/i to misread

/** One code like "k7m2-9fqa", from a random source returning 0–1. */
export function makeCode(rand: () => number) {
  const pick = () => ALPHABET[Math.floor(rand() * ALPHABET.length) % ALPHABET.length];
  return `${pick()}${pick()}${pick()}${pick()}-${pick()}${pick()}${pick()}${pick()}`;
}

/** The text file people save: a header, the unused codes one per line, used ones marked. */
export function asText(codes: RecoveryCode[], account: string, issued: string) {
  return [
    `Recovery codes for ${account}`,
    `Issued ${issued}. Each code works once. Keep them somewhere safe.`,
    "",
    ...codes.map((c, i) => `${String(i + 1).padStart(2, " ")}. ${c.code}${c.used ? "  (used)" : ""}`),
    "",
  ].join("\n");
}

export const remaining = (codes: RecoveryCode[]) => codes.filter((c) => !c.used).length;
