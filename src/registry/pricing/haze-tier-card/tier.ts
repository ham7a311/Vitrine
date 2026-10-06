/** Split a price into the whole part and any cents, so the cents can be set smaller. 18 → ["18", ""], 18.5 → ["18", ".50"]. */
export function splitPrice(amount: number): [string, string] {
  const v = Math.max(0, Math.round(amount * 100) / 100);
  const whole = Math.floor(v);
  const cents = Math.round((v - whole) * 100);
  return [String(whole), cents ? `.${String(cents).padStart(2, "0")}` : ""];
}

/** The muted line under the price: "Billed yearly or $24 billed monthly". */
export function billingLine(monthly: number, currency = "$"): string {
  const [w, c] = splitPrice(monthly);
  return `Billed yearly or ${currency}${w}${c} billed monthly`;
}

/** Percent saved by paying yearly, rounded down: (24, 18) → 25. */
export function yearlySaving(monthly: number, yearlyPerMonth: number): number {
  if (monthly <= 0 || yearlyPerMonth >= monthly) return 0;
  return Math.floor(((monthly - yearlyPerMonth) / monthly) * 100);
}
