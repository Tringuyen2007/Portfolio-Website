import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

import { Container } from "@/components/container";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { ScrollReveal } from "@/components/scroll-reveal";
import { experience, skillGroups } from "@/content/experience";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional, leadership, and technical experience of Tri Nguyen: software engineering internships, web development, and ACM leadership at UTSA.",
  alternates: {
    canonical: "/experience",
  },
};

export default function ExperiencePage() {
  return (
    <section className="py-18 sm:py-24">
      <Container className="space-y-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <h1 className="font-heading text-5xl font-semibold tracking-[-0.045em] text-text-primary sm:text-6xl">
              Where the roots went down.
            </h1>
            <p className="max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
              The roles that shaped how I build: shipping production sites, working inside cloud
              infrastructure, and keeping a 2000-member student organization running.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link className="btn-primary" href="/contact#resume">
              <FileText className="size-4" />
              View resume
            </Link>
            <Link className="btn-secondary" href="/projects">
              Explore the tree
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <ExperienceTimeline entries={experience} />

        <ScrollReveal>
          <div className="space-y-8 border-t border-border pt-12">
            <div className="space-y-2">
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                Tech &amp; tools
              </h2>
              <p className="max-w-xl text-sm leading-7 text-text-secondary">
                What I reach for most often across {siteConfig.name.split(" ")[0]}&apos;s projects
                and roles.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group) => (
                <div className="surface p-5" key={group.label}>
                  <dt className="eyebrow-plain">{group.label}</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span className="pill" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
