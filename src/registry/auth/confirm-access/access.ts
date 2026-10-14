export type Method = "passkey" | "code" | "password";
export const METHOD_LABEL: Record<Method, string> = { passkey: "Passkey", code: "Authenticator", password: "Password" };

/** Digits only, at most `n`. */
export const digits = (raw: string, n = 6) => raw.replace(/\D/g, "").slice(0, n);

/** Next tab for arrow-key navigation across the method tabs. */
export function nextTab(list: Method[], at: Method, key: string): Method {
  const i = list.indexOf(at);
  if (key === "ArrowRight") return list[(i + 1) % list.length];
  if (key === "ArrowLeft") return list[(i - 1 + list.length) % list.length];
  if (key === "Home") return list[0];
  if (key === "End") return list[list.length - 1];
  return at;
}

/** Words for how many tries are left. */
export const triesLeft = (n: number) => (n <= 0 ? "No tries left — use another method." : n === 1 ? "1 try left." : `${n} tries left.`);
