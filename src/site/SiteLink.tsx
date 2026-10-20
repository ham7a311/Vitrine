"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/*
 * Navbar and footer links prefetch their pages as they come into view. On a component page that was most of what
 * a visit downloaded (/, /components, /categories, /workshop and the legal pages, about 0.8 MB of route data) for
 * links rarely followed from there, so on /components/[slug] they load when clicked instead. Elsewhere: unchanged.
 */
const COMPONENT_PAGE = /^\/components\/[^/]+\/?$/;

export function SiteLink({ prefetch, ...props }: ComponentProps<typeof Link>) {
  const onComponentPage = COMPONENT_PAGE.test(usePathname());
  return <Link {...props} prefetch={onComponentPage ? false : prefetch} />;
}
