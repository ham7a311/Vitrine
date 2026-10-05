import type { KeyboardEvent } from "react";

/** Arrow/Home/End navigation with automatic activation for a tab or radio group. */
export function rovingFocus(event: KeyboardEvent<HTMLElement>) {
  const role = event.currentTarget.getAttribute("role") === "tablist" ? "tab" : "radio";
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(`[role="${role}"]`));
  const at = items.indexOf(event.target as HTMLButtonElement);
  if (at < 0) return;
  let next: number;
  if (event.key === "Home") next = 0;
  else if (event.key === "End") next = items.length - 1;
  else if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (at + 1) % items.length;
  else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (at - 1 + items.length) % items.length;
  else return;
  event.preventDefault(); items[next].focus(); items[next].click();
}
