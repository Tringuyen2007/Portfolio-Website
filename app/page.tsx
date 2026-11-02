import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Container } from "@/components/container";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { Hero } from "@/components/home/hero";
import { TreePreview } from "@/components/home/tree-preview";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TreeLegend } from "@/components/tree/tree-legend";
import { experience } from "@/content/experience";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { toTreeProject } from "@/lib/tree/projects";

function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="eyebrow-plain flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-border" />
        {eyebrow}
      </p>
      <h2 className="max-w-2xl font-heading text-4xl font-semibold tracking-[-0.04em] text-text-primary sm:text-5xl">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function HomePage() {
  const projects = getAllProjects()
    .filter((project) => !project.archived)
    .map(toTreeProject);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    sameAs: [siteConfig.githubUrl, siteConfig.linkedinUrl],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.school,
    },
  };

  return (
    <>
      <JsonLd data={personJsonLd} />

      <Hero />

      {/* Tree preview */}
      <section className="scroll-mt-24 py-20 sm:py-28" id="tree">
        <Container className="space-y-10">
          <ScrollReveal>
            <div className="space-y-8">
              <SectionHeading eyebrow="The fruit tree" index="01" title="What grew from it.">
                <p className="max-w-xl text-base leading-8 text-text-secondary">
                  Each fruit on this tree is a project, a hackathon, or an event. Golden apples are
                  the ones that came home with an award. The tree keeps growing as I do.
                </p>
              </SectionHeading>
              <TreeLegend compact />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <TreePreview projects={projects} />
          </ScrollReveal>
        </Container>
      </section>

      {/* Experience preview */}
      <section className="scroll-mt-24 border-t border-border py-20 sm:py-28" id="experience">
        <Container className="space-y-12">
          <ScrollReveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Growth rings" index="02" title="Where the vine has climbed." />
              <Link className="btn-secondary shrink-0" href="/experience">
                Full experience
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </ScrollReveal>
          <ExperienceTimeline compact entries={experience} />
        </Container>
      </section>

      {/* Contact invitation */}
      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="surface grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <SectionHeading eyebrow="Plant something" index="03" title="Have a seed of an idea?">
                <p className="max-w-xl text-base leading-8 text-text-secondary">
                  Internships, collaborations, hackathon teams, or a good conversation about AI and
                  software. My inbox is always in season.
                </p>
              </SectionHeading>
              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary" href="/contact">
                  <Mail className="size-4" />
                  Say hello
                </Link>
                <Link className="btn-secondary" href="/contact#resume">
                  Resume
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Closing quote */}
      <section className="relative overflow-hidden border-t border-border py-28 sm:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(217,181,90,0.16),transparent_70%)]"
        />
        <Container>
          <ScrollReveal>
            <figure className="mx-auto max-w-3xl text-center">
              <svg aria-hidden="true" className="mx-auto mb-8 size-8 text-leaf" viewBox="0 0 32 32">
                <path
                  d="M16 28c0-9 4-16 12-20-2 9-6 15-12 20Zm0 0C16 19 12 12 4 8c2 9 6 15 12 20Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
              <blockquote className="font-heading text-3xl italic leading-tight tracking-[-0.02em] text-text-primary sm:text-5xl">
                &ldquo;Tri quote in progress&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                {siteConfig.name} · still growing
              </figcaption>
            </figure>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
