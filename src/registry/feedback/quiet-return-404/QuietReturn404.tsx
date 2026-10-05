import type { RecoveryProps } from "../recovery";
import "./quiet-return-404.css";
export function QuietReturn404({ title = "This page isn't here.", description = "Check the address, or return to a place you know.", home = { label: "Go home", href: "/" }, destinations = [], className = "" }: RecoveryProps) {
 return <section className={`qr404 ${className}`} aria-label="Page not found"><div className="qr404__content"><p className="qr404__status"><span aria-hidden="true"/>404 / NOT FOUND</p><h1>{title}</h1><p className="qr404__description">{description}</p><a className="qr404__home" href={home.href}>{home.label}<span aria-hidden="true">↗</span></a>{destinations.length>0&&<nav aria-label="Other destinations">{destinations.map((d,i)=><a key={`${d.href}-${i}`} href={d.href}>{d.label}</a>)}</nav>}</div><span className="qr404__foot" aria-hidden="true">A SMALL DETOUR.</span></section>;
}
