import type { Kind } from "./layout";

/** Each sticker in a 40×40 box: the die-cut outline, then its artwork. Fills use classes the theme colours. */
export const ART: Record<Kind, { cut: string; art: string }> = {
  star: {
    cut: "M20 3.5l4.9 10.4 11.3 1.4-8.3 7.8 2.1 11.2L20 28.8l-10 5.5 2.1-11.2-8.3-7.8 11.3-1.4z",
    art: '<path class="k-a" d="M20 3.5l4.9 10.4 11.3 1.4-8.3 7.8 2.1 11.2L20 28.8l-10 5.5 2.1-11.2-8.3-7.8 11.3-1.4z"/><circle class="k-ink" cx="16.6" cy="19" r="1.4"/><circle class="k-ink" cx="23.4" cy="19" r="1.4"/><path class="k-line" d="M17.2 23.2q2.8 2.2 5.6 0"/>',
  },
  bolt: {
    cut: "M23.5 2.5 8 22.5h9.5l-3.5 15 17-21.5h-9.8z",
    art: '<path class="k-b" d="M23.5 2.5 8 22.5h9.5l-3.5 15 17-21.5h-9.8z"/><path class="k-hi" d="M21 8.5 13.6 19"/>',
  },
  heart: {
    cut: "M20 35S4.5 25.5 4.5 14.6A8.3 8.3 0 0 1 20 10.2a8.3 8.3 0 0 1 15.5 4.4C35.5 25.5 20 35 20 35z",
    art: '<path class="k-c" d="M20 35S4.5 25.5 4.5 14.6A8.3 8.3 0 0 1 20 10.2a8.3 8.3 0 0 1 15.5 4.4C35.5 25.5 20 35 20 35z"/><path class="k-hi" d="M9.6 13.4a4.4 4.4 0 0 1 4-3"/>',
  },
  badge: {
    cut: "M20 2l3.6 4.4 5.5-1.6 1 5.6 5.6 1-1.6 5.5L38 20l-4.4 3.6 1.6 5.5-5.6 1-1 5.6-5.5-1.6L20 38l-3.6-4.4-5.5 1.6-1-5.6-5.6-1 1.6-5.5L2 20l4.4-3.6-1.6-5.5 5.6-1 1-5.6 5.5 1.6z",
    art: '<path class="k-d" d="M20 2l3.6 4.4 5.5-1.6 1 5.6 5.6 1-1.6 5.5L38 20l-4.4 3.6 1.6 5.5-5.6 1-1 5.6-5.5-1.6L20 38l-3.6-4.4-5.5 1.6-1-5.6-5.6-1 1.6-5.5L2 20l4.4-3.6-1.6-5.5 5.6-1 1-5.6 5.5 1.6z"/><text class="k-txt" x="20" y="23.6" text-anchor="middle">NEW</text>',
  },
  smiley: {
    cut: "M20 3a17 17 0 1 0 0 34a17 17 0 1 0 0-34z",
    art: '<circle class="k-a" cx="20" cy="20" r="17"/><ellipse class="k-ink" cx="14.5" cy="16" rx="1.8" ry="2.6"/><ellipse class="k-ink" cx="25.5" cy="16" rx="1.8" ry="2.6"/><path class="k-line k-thick" d="M12 22.5q8 8.5 16 0"/>',
  },
  rainbow: {
    cut: "M3 30a17 17 0 0 1 34 0v3h-9v-3a8 8 0 0 0-16 0v3H3z",
    art: '<path class="k-c" d="M3 31a17 17 0 0 1 34 0h-3.2a13.8 13.8 0 0 0-27.6 0z"/><path class="k-a" d="M6.2 31a13.8 13.8 0 0 1 27.6 0h-3a10.8 10.8 0 0 0-21.6 0z"/><path class="k-e" d="M9.2 31a10.8 10.8 0 0 1 21.6 0h-2.8a8 8 0 0 0-16 0z"/><path class="k-cloud" d="M3 33a3.6 3.6 0 0 1 6-3.4 3.4 3.4 0 0 1 4 3.4zM27 33a3.4 3.4 0 0 1 4-3.4 3.6 3.6 0 0 1 6 3.4z"/>',
  },
  check: {
    cut: "M20 3a17 17 0 1 0 0 34a17 17 0 1 0 0-34z",
    art: '<circle class="k-e" cx="20" cy="20" r="17"/><path class="k-tick" d="M12.5 20.5l5 5 10-11"/>',
  },
};
