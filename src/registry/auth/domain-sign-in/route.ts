export type Org = { domain: string; name: string; color: string; idp: string };
export type Route =
  | { kind: "invalid" }
  | { kind: "sso"; org: Org }
  | { kind: "google" }
  | { kind: "microsoft" }
  | { kind: "password" };

const GOOGLE = ["gmail.com", "googlemail.com"];
const MICROSOFT = ["outlook.com", "hotmail.com", "live.com", "msn.com"];

export const domainOf = (email: string) => {
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/.exec(email.trim().toLowerCase());
  return m ? m[1] : null;
};

/** Where an email should go next: its company's single sign-on, a consumer provider, or a password. */
export function route(email: string, orgs: Org[]): Route {
  const d = domainOf(email);
  if (!d) return { kind: "invalid" };
  const org = orgs.find((o) => d === o.domain || d.endsWith(`.${o.domain}`));
  if (org) return { kind: "sso", org };
  if (GOOGLE.includes(d)) return { kind: "google" };
  if (MICROSOFT.includes(d)) return { kind: "microsoft" };
  return { kind: "password" };
}

/** While typing: the org whose domain the address already ends with, if any. */
export function hint(email: string, orgs: Org[]) {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const typed = email.slice(at + 1).toLowerCase();
  if (typed.length < 3) return null;
  return orgs.find((o) => o.domain === typed) ?? null;
}
