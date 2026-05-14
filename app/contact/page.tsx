import type { Metadata } from "next";
import { ArrowUpRight, FolderGit2, Mail } from "lucide-react";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Tri Nguyen for collaboration, student projects, or technical conversations.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const hasEmail = Boolean(siteConfig.contactEmail);

  return (
    <section className="py-18 sm:py-24">
      <Container className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="eyebrow">Contact</span>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
            Open to thoughtful conversations and ambitious builds.
          </h1>
          <p className="text-base leading-8 text-text-secondary sm:text-lg">
            If you want to talk about a project, collaboration, hackathon idea, or
            just compare notes on AI and software, reach out. I&apos;m keeping the
            contact flow intentionally light.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface p-6">
            <div className="flex items-center gap-3 text-text-primary">
              <Mail className="size-5" />
              <h2 className="text-lg font-semibold">Direct contact</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              {hasEmail
                ? "Email is the fastest route if you want a direct reply."
                : "A direct email link can drop in here as soon as you decide which address you want to publish."}
            </p>
            {hasEmail ? (
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm text-text-primary hover:text-accent-strong"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                {siteConfig.contactEmail}
                <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <p className="mt-5 text-sm text-text-muted">.</p>
            )}
          </div>

          <div className="surface p-6">
            <div className="flex items-center gap-3 text-text-primary">
              <FolderGit2 className="size-5" />
              <h2 className="text-lg font-semibold">GitHub</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Check out my GitHub to browse my repos and see the code behind the work.
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 text-sm text-text-primary hover:text-accent-strong"
              href={siteConfig.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <FolderGit2 className="size-4" />
              {siteConfig.githubHandle}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
