import type { Metadata } from "next";
import { ArrowUpRight, Download, FolderGit2, Mail } from "lucide-react";

import { Container } from "@/components/container";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Resume",
  description:
    "Get in touch with Tri Nguyen for collaborations, hackathons, internships, or technical conversations, and view or download his resume.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const hasEmail = Boolean(siteConfig.contactEmail);

  return (
    <section className="py-18 sm:py-24">
      <Container className="space-y-16">
        <div className="max-w-3xl space-y-5">
          <span className="eyebrow">Contact &amp; Resume</span>
          <h1 className="font-heading text-5xl font-semibold tracking-[-0.045em] text-text-primary sm:text-6xl">
            Let&apos;s grow something together.
          </h1>
          <p className="text-base leading-8 text-text-secondary sm:text-lg">
            If you want to talk about a project, a collaboration, a hackathon idea, or just compare
            notes on AI and software, reach out. I keep the contact flow intentionally light.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ScrollReveal>
            <div className="surface h-full p-6">
              <div className="flex items-center gap-3 text-text-primary">
                <Mail className="size-5 text-accent" />
                <h2 className="text-lg font-semibold">Email</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {hasEmail
                  ? "The fastest route if you want a direct reply."
                  : "A direct email link will appear here once an address is published."}
              </p>
              {hasEmail ? (
                <a
                  className="mt-5 inline-flex items-center gap-2 break-all text-sm text-text-primary hover:text-accent-strong"
                  href={`mailto:${siteConfig.contactEmail}`}
                >
                  {siteConfig.contactEmail}
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="surface h-full p-6">
              <div className="flex items-center gap-3 text-text-primary">
                <FolderGit2 className="size-5 text-accent" />
                <h2 className="text-lg font-semibold">GitHub</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Browse the repositories and the code behind every fruit on the tree.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm text-text-primary hover:text-accent-strong"
                href={siteConfig.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                {siteConfig.githubHandle}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="surface h-full p-6">
              <div className="flex items-center gap-3 text-text-primary">
                <LinkedinIcon className="size-5 text-accent" />
                <h2 className="text-lg font-semibold">LinkedIn</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Connect to keep in touch or learn more about my background.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm text-text-primary hover:text-accent-strong"
                href={siteConfig.linkedinUrl}
                rel="noreferrer"
                target="_blank"
              >
                Connect on LinkedIn
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div className="scroll-mt-28 space-y-6" id="resume">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <span className="eyebrow">Resume</span>
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                The one-page version.
              </h2>
            </div>
            <a className="btn-primary" download href={siteConfig.resumePath}>
              <Download className="size-4" />
              Download PDF
            </a>
          </div>
          <ScrollReveal>
            <div className="surface overflow-hidden p-2 sm:p-3">
              <iframe
                className="h-[70vh] min-h-[32rem] w-full rounded-[1.2rem] border border-border bg-bg-soft"
                src={`${siteConfig.resumePath}#view=FitH`}
                title="Tri Nguyen resume"
              />
            </div>
            <p className="mt-3 text-sm text-text-muted">
              If the preview does not load in your browser,{" "}
              <a className="text-text-primary underline underline-offset-4" href={siteConfig.resumePath}>
                open the PDF directly
              </a>
              .
            </p>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
