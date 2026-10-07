export type Plan = { id: string; name: string; blurb: string; monthly: number; features: string[]; cta: string; glow: string };

/** Yearly billing takes this share off. */
export const SAVE = 0.2;

/** Shown price per month: whole currency units, yearly rounded to the nearest unit. */
export function shown(monthly: number, yearly: boolean, save = SAVE): number {
  return yearly ? Math.round(monthly * (1 - save)) : monthly;
}

/** "Save 20%" style label for the switch. */
export function saveLabel(save = SAVE): string {
  return `Save ${Math.round(save * 100)}%`;
}
