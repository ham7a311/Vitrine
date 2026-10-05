import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/site/LegalPage";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "Privacy", description: "What Vitrine collects when you visit (very little), which outside services the pages call, and how to reach the person responsible.", path: "/privacy" });

const email = site.contact.email;
const Mail = () => <a href={`mailto:${email}`}>{email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "who",
    title: "Who is responsible",
    body: (
      <>
        <p>
          {site.name} is an independent project run by <strong>{site.owner}</strong> in {site.location}. For anything in this policy, write to <Mail />.
        </p>
      </>
    ),
  },
  {
    id: "collected",
    title: "What the site collects",
    body: (
      <>
        <p>There are no accounts, forms, comments or ads, so there is nothing you type into the site that the site stores. What does happen when you visit:</p>
        <ul>
          <li>
            <strong>Hosting.</strong> The site is served by <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel</a>. To deliver a page and protect against abuse, the host processes technical details of each request: your IP address, the address you asked for, your browser and device type, and the time.
          </li>
          <li>
            <strong>Visit statistics.</strong> Gallery pages use <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Web Analytics</a> to count page views, where visitors came from (referrer and country) and which browsers and devices are used. It sets no cookies and does not follow you across other sites. The full-screen component previews do not load it.
          </li>
          <li>
            <strong>GitHub star count.</strong> The server asks GitHub for the repository&rsquo;s star count. That request is made by the server, not your browser, and carries nothing about you.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "fonts",
    title: "Fonts from Google",
    body: (
      <>
        <p>
          The site&rsquo;s own typefaces are served from this site. But the pages that show components running (the home page, the component list and every component preview) load the fonts those components use from <strong>Google Fonts</strong>. Your browser asks Google&rsquo;s servers for them, so Google receives your IP address and browser details, as with any request. Google describes what it does with this in its <a href="https://developers.google.com/fonts/docs/privacy" target="_blank" rel="noreferrer">Fonts privacy FAQ</a>. Pages such as About, Terms, Privacy and Contact make no request to Google.
        </p>
      </>
    ),
  },
  {
    id: "device",
    title: "What stays on your device",
    body: (
      <>
        <p>
          Vitrine sets <strong>no cookies</strong>. A couple of demo components remember their own settings in your browser&rsquo;s local storage so they feel real when you come back; this never leaves your device, and you can clear it in your browser settings at any time.
        </p>
        <p>Search, copying source or prompts, and switching variants all happen in your browser. None of it is sent anywhere.</p>
      </>
    ),
  },
  {
    id: "email",
    title: "If you write to me",
    body: (
      <>
        <p>
          When you email <Mail /> or open an issue on GitHub, I receive what you send: your address or username, and your message. I use it to reply and, for issues, to improve the project. I don&rsquo;t add you to any list and I don&rsquo;t share your message. Email passes through my mail provider, and issues are public on GitHub, so don&rsquo;t put anything private in an issue.
        </p>
      </>
    ),
  },
  {
    id: "basis",
    title: "Why, and for how long",
    body: (
      <>
        <p>
          Running the site, keeping it secure and learning which pages are useful is a legitimate interest of the project, and the amount of data involved is deliberately small. I don&rsquo;t keep any of it myself: server logs and statistics are held by Vercel under its own retention rules, and emails are kept for as long as the conversation needs, then deleted when I no longer need them.
        </p>
        <p>These services process data in several countries, including the United States, under their own safeguards.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your choices",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to see, correct or delete personal data held about you, to object to how it&rsquo;s used, and to complain to your local data protection authority. I hold almost nothing that identifies a visitor, but if you want to ask, write to <Mail /> and I&rsquo;ll answer.
        </p>
        <p>
          To avoid the requests to Google and the visit statistics altogether, block them in your browser or with a content blocker; the site keeps working. Links to other sites, such as GitHub, are governed by their own policies.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <>
        <p>
          If this changes in a way that matters, the date at the top changes with it. The <Link href="/terms">Terms</Link> explain how the components themselves may be used.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Very little, on purpose."
      updated={site.legalUpdated}
      summary={
        <p>
          Vitrine has no accounts, no forms and no cookies. It counts page views without following anyone, it loads fonts from Google on the pages that show live components, and it keeps nothing you type. The rest of this page says exactly what that means.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
