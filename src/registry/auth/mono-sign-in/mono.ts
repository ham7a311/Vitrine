/** A practical email check: something@something.tld, no spaces. */
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** Why a provider attempt failed, in words a person can act on. */
export function providerError(name: string, reason?: string) {
  if (reason === "closed") return `The ${name} window was closed before you finished. Try again.`;
  if (reason === "denied") return `${name} didn't share your account. Allow access to continue.`;
  return `Couldn't reach ${name}. Check your connection and try again.`;
}
