// The statuses a product usually needs, each with a tone and a mark.
export type Tone = "red" | "green" | "amber" | "grey" | "blue" | "violet";
export type Mark = "pulse" | "dot" | "ring" | "minus" | "moon" | "check" | "spin" | "cross" | "alert" | "spark";
export type Status = "live" | "online" | "away" | "busy" | "offline" | "confirmed" | "pending" | "cancelled" | "warning" | "failed" | "beta" | "new";

export const STATUS: Record<Status, { label: string; tone: Tone; mark: Mark }> = {
  live: { label: "Live", tone: "red", mark: "pulse" },
  online: { label: "Online", tone: "green", mark: "dot" },
  away: { label: "Away", tone: "amber", mark: "moon" },
  busy: { label: "Busy", tone: "red", mark: "minus" },
  offline: { label: "Offline", tone: "grey", mark: "ring" },
  confirmed: { label: "Confirmed", tone: "green", mark: "check" },
  pending: { label: "Pending", tone: "blue", mark: "spin" },
  cancelled: { label: "Cancelled", tone: "grey", mark: "cross" },
  warning: { label: "Warning", tone: "amber", mark: "alert" },
  failed: { label: "Failed", tone: "red", mark: "cross" },
  beta: { label: "Beta", tone: "violet", mark: "spark" },
  new: { label: "New", tone: "blue", mark: "spark" },
};

export const ALL = Object.keys(STATUS) as Status[];

/** Statuses that describe something still changing are announced politely when they change. */
export const isTransient = (s: Status) => s === "pending" || s === "live";
