import { site } from "@/site.config";

/** A GitHub "new issue" link with the title and body already filled in. */
export function issueUrl({ title, body }: { title: string; body?: string }) {
  const url = new URL(site.contact.issues);
  url.searchParams.set("title", title);
  if (body) url.searchParams.set("body", body);
  return url.toString();
}

/** A mailto link with a subject and optional body. */
export function mailtoUrl({ subject, body }: { subject: string; body?: string }) {
  const q = new URLSearchParams({ subject, ...(body ? { body } : {}) }).toString().replace(/\+/g, "%20");
  return `mailto:${site.contact.email}?${q}`;
}

/** A WhatsApp chat link with the message already written. */
export function whatsappUrl(text: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
