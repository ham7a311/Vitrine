"use client";
import { useState } from "react";

/** Controlled values remain caller-owned; otherwise keep the selection locally. */
export function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void): [T, (value: T) => void] {
  const [local, setLocal] = useState(initial);
  return [value === undefined ? local : value, (next: T) => {
    if (value === undefined) setLocal(next);
    onChange?.(next);
  }];
}
