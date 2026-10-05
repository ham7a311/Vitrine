import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/site/LegalPage";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "Terms", description: "How the Vitrine components, prompts and website may be used: MIT licensed, provided as they are, with the one thing the licence doesn't cover.", path: "/terms" });

const external = { target: "_blank", rel: "noreferrer" } as const;

const SECTIONS: LegalSection[] = [
  {
    id: "using",
    title: "Using the components",
    body: (
      <>
        <p>
          The components, styles, source files and written prompts in the <a href={site.github} {...external}>{site.name} repository</a> are released under the <a href={`${site.github}/blob/main/LICENSE`} {...external}>MIT licence</a>. In plain terms: copy them, change them, and use them in personal or commercial work, with no fee and no need to ask.
        </p>
        <p>
          The one condition is the licence&rsquo;s own: keep the copyright notice and licence text with any substantial copy of the code. If the summary here and the licence ever differ, the licence wins.
        </p>
      </>
    ),
  },
  {
    id: "name",
    title: "The name and logo",
    body: (
      <>
        <p>
          The licence covers the code, not the name. Please don&rsquo;t use the {site.name} name or logo in a way that suggests your project or product is made, endorsed or sold by {site.name}. Saying &ldquo;built with components from {site.name}&rdquo; is fine.
        </p>
      </>
    ),
  },
  {
    id: "demos",
    title: "Demos are demonstrations",
    body: (
      <>
        <p>All names, companies, figures and messages in the demos are invented. Any resemblance to a real person or business is a coincidence.</p>
        <p>
          Components that show sign-in, payments, card details, transfers or other sensitive flows are <strong>visual examples with simulated services</strong>. They do not authenticate anyone, move money or protect any data. Connect them to your own verified backend, and never treat a result produced in the browser as proof of anything.
        </p>
      </>
    ),
  },
  {
    id: "asis",
    title: "As is, with no warranty",
    body: (
      <>
        <p>
          Everything here is provided <strong>as it is</strong>, without warranty of any kind. I work to make each component accessible and well behaved, but you are responsible for testing it in your own product, with your own content, devices and users, before you rely on it.
        </p>
        <p>To the fullest extent the law allows, I am not liable for any loss or damage that arises from using the site or anything copied from it. This is the same disclaimer the MIT licence makes, repeated here so it&rsquo;s in one place.</p>
      </>
    ),
  },
  {
    id: "fonts",
    title: "Fonts and other people’s work",
    body: (
      <>
        <p>
          Components name the fonts they were designed with. Fonts are not part of the MIT licence: each keeps its own licence (the ones used here are free to use, but check before you ship). Add the font files to your project; they are not included in the copied source.
        </p>
        <p>
          The site links to other sites, such as GitHub. They are not mine, and I am not responsible for what they say or do.
        </p>
      </>
    ),
  },
  {
    id: "site",
    title: "Using the website",
    body: (
      <>
        <p>Browse, search and read freely. Please don&rsquo;t try to break the site, overload it with automated requests, or access anything you haven&rsquo;t been shown.</p>
        <p>Contributions to the repository are licensed under the same MIT terms; <a href={`${site.github}/blob/main/CONTRIBUTING.md`} {...external}>CONTRIBUTING.md</a> has the details.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <>
        <p>
          I may change these terms as the project changes; the date at the top will change with them. Components you already copied stay under the licence they had when you copied them. Questions about any of this: <Link href="/contact">get in touch</Link>. How the site handles visitor data is explained in the <Link href="/privacy">Privacy</Link> page.
        </p>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Take it, keep it, make it yours."
      updated={site.legalUpdated}
      summary={
        <p>
          The code is MIT licensed: use it however you like, commercially too. The name isn&rsquo;t part of that. Demos are only demos, so don&rsquo;t ship a pretend sign-in. Everything is as it is, with no warranty.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
