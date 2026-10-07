export type Period = "month" | "year";

export type Feature = { label: string; info?: string; accent?: boolean };

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  /** Price per month when billed monthly. */
  monthly: number;
  /** Credits included per month. */
  credits: number;
  featured?: boolean;
};

/** Yearly billing takes this share off the monthly price. */
export const YEARLY_DISCOUNT = 0.2;

/** Shown price per month for a period, rounded to whole currency units. */
export function price(tier: Pick<Tier, "monthly">, period: Period, discount = YEARLY_DISCOUNT): number {
  return period === "year" ? Math.round(tier.monthly * (1 - discount)) : tier.monthly;
}

/** Cost of 100 credits at the shown price, as "$1.40". */
export function per100(tier: Pick<Tier, "monthly" | "credits">, period: Period, currency = "$", discount = YEARLY_DISCOUNT): string {
  if (tier.credits <= 0) return `${currency}0.00`;
  const v = (price(tier, period, discount) / tier.credits) * 100;
  return `${currency}${v.toFixed(2)}`;
}

/** Arrow-key movement in a two-option radio group: any arrow flips, Home/End jump. */
export function flip(current: Period, key: string): Period | null {
  if (key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown") return current === "month" ? "year" : "month";
  if (key === "Home") return "month";
  if (key === "End") return "year";
  return null;
}
