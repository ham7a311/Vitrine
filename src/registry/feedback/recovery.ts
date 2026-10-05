import type { ReactNode } from "react";
export type RecoveryLink = { label: string; href: string };
/** Ordinary links keep recovery pages portable across routers. */
export type RecoveryProps = {
  title?: string;
  description?: ReactNode;
  home?: RecoveryLink;
  destinations?: RecoveryLink[];
  className?: string;
};
