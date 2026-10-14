import type { Animal } from "./gait";

/** Each print drawn pointing up (forward), 24 × 24, in currentColor. */
export const PRINT: Record<Animal, string> = {
  pup: `<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="currentColor"><path d="M12 22.2c-3.4 0-6-1.8-6-4.3 0-2.4 2.6-5.2 6-5.2s6 2.8 6 5.2c0 2.5-2.6 4.3-6 4.3Z"/><ellipse cx="5.2" cy="10.4" rx="2.1" ry="2.7" transform="rotate(-24 5.2 10.4)"/><ellipse cx="9.3" cy="6.3" rx="2.1" ry="2.8" transform="rotate(-8 9.3 6.3)"/><ellipse cx="14.7" cy="6.3" rx="2.1" ry="2.8" transform="rotate(8 14.7 6.3)"/><ellipse cx="18.8" cy="10.4" rx="2.1" ry="2.7" transform="rotate(24 18.8 10.4)"/><path d="M3.9 7.2 4.2 5l1.4 1.7ZM8.6 3.1 9.2 1l1 2ZM15.4 3.1 14.8 1l-1 2ZM20.1 7.2 19.8 5l-1.4 1.7Z"/></g></svg>`,
  cat: `<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="currentColor"><path d="M12 21.5c-3 0-5.4-1.5-5.4-3.8 0-1.4.8-2.3 1.6-3.2.9-1 1.9-2 3.8-2s2.9 1 3.8 2c.8.9 1.6 1.8 1.6 3.2 0 2.3-2.4 3.8-5.4 3.8Z"/><circle cx="6.4" cy="10.6" r="2.1"/><circle cx="10" cy="7.2" r="2.2"/><circle cx="14" cy="7.2" r="2.2"/><circle cx="17.6" cy="10.6" r="2.1"/></g></svg>`,
  bird: `<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V13M12 13 12 2.5M12 13 4.8 6.2M12 13l7.2-6.8"/></g></svg>`,
};
