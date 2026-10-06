// A badge shows up to 99, then "99+".
export const badge = (n: number) => (n > 99 ? "99+" : String(Math.max(0, n)));
