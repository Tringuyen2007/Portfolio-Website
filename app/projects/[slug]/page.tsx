import type { Metadata } from "next";
import Link from "next/link";
import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { ProjectGallery } from "@/components/gallery/project-gallery";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { AppleSprite } from "@/components/project/apple-sprite";
import { AwardChip } from "@/components/project/award-chip";
import { BackToTree } from "@/components/project/back-to-tree";
import { SceneArt } from "@/components/project/scene-art";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getBranchForCategory } from "@/content/branches";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { APPLE_LABELS } from "@/lib/tree/types";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const imagePath = `/projects/${project.slug}/opengraph-image`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `/projects/${project.slug}`,
      images: [imagePath],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [imagePath],
    },
  };
}

const labelClass = "font-label text-[8px] uppercase leading-[1.6] tracking-[0.04em] text-text-muted sm:text-[9px]";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const all = getAllProjects().filter((p) => !p.archived);
  const position = all.findIndex((p) => p.slug === project.slug);
  const next = all[(position + 1) % all.length];
  const branch = getBranchForCategory(project.category);
  const enchanted = project.apple === "enchanted";
  const article = project.links.find((link) => link.kind === "article");
  // The article is surfaced inside the enchanted award chip; keep it out of the button row there.
  const buttonLinks = project.links.filter((link) => !(enchanted && link.kind === "article" && project.award));

  const facts: { label: string; value: string }[] = [
    { label: "Year", value: project.date ?? String(project.year) },
    ...(project.event ? [{ label: "Event", value: project.event }] : []),
    ...(project.location ? [{ label: "Where", value: project.location }] : []),
    ...(project.role ? [{ label: "My role", value: project.role }] : []),
    ...(project.team?.length ? [{ label: "Team", value: project.team.join(", ") }] : []),
    { label: "Branch", value: branch.label },
    {
      label: "Status",
      value:
        project.status === "completed"
          ? "Completed"
          : project.status === "ongoing"
            ? "Ongoing"
            : "In progress",
    },
  ];

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    dateCreated: String(project.year),
    keywords: project.stack,
    award: project.award,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    codeRepository: project.repo,
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />

      <article className="pb-20">
        {/* Hero: the zoom clone cross-fades into this band. */}
        <section className="relative" data-zoom-target>
          <Container className="space-y-10 py-12 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BackToTree fruit={project.fruit} slug={project.slug} />
              <span className={`${labelClass} inline-flex items-center gap-2`}>
                <AppleSprite kind={project.apple} size={3} />
                {branch.shortLabel} · {APPLE_LABELS[project.apple].label}
              </span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                {project.award ? (
                  <AwardChip apple={project.apple} articleHref={article?.href} award={project.award} />
                ) : null}
                <h1 className="font-heading text-5xl font-bold leading-[0.95] text-text-primary sm:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
                <p className="max-w-xl text-[17px] leading-[29px] text-text-secondary">{project.summary}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {buttonLinks.map((link) => (
                    <a
                      className={`${link.kind === "live" ? "btn-primary" : "btn-secondary"} justify-center`}
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>

              <figure
                className="panel relative mx-auto flex w-full max-w-[350px] flex-col items-center justify-center gap-3 px-4 py-6 lg:mx-0 lg:max-w-none lg:py-8"
                style={enchanted ? { borderColor: "var(--ench)" } : undefined}
              >
                <span className={`${labelClass} absolute left-4 top-3`}>Hero art</span>
                <SceneArt slug={project.slug} title={project.title} />
                <figcaption className={`${labelClass} absolute bottom-3 right-4`}>
                  Fig. 01 · {project.year}
                </figcaption>
              </figure>
            </div>
          </Container>
        </section>

        <div className="section-rule" />

        <Container className="space-y-16 pt-12">
          <ScrollReveal>
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className={labelClass}>{fact.label}</dt>
                  <dd className="mt-2 text-[15px] leading-6 text-text-primary">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          <div className="section-rule" />

          <div className="grid gap-12 lg:grid-cols-[1fr_17rem]">
            <ScrollReveal>
              <div data-prose>
                <MDXContent code={project.body} components={mdxComponents} />
              </div>
            </ScrollReveal>

            <aside className="panel space-y-8 self-start p-5 lg:sticky lg:top-28">
              <div>
                <p className={labelClass}>Built with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span className="pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {project.links.length ? (
                <div>
                  <p className={labelClass}>Links</p>
                  <ul className="mt-2">
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a
                          className="inline-flex min-h-11 items-center gap-2 text-[15px] leading-6 text-text-primary underline decoration-border underline-offset-4 hover:decoration-accent"
                          href={link.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.label}
                          <span aria-hidden="true" className="text-text-muted">
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <ScrollReveal>
            <section className="space-y-6">
              <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">From the build.</h2>
              <ProjectGallery images={project.gallery} title={project.title} />
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <div className="section-rule" />
            <div className="flex flex-col gap-6 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <BackToTree fruit={project.fruit} slug={project.slug} />
              {next ? (
                <Link
                  className="group inline-flex min-h-11 items-center gap-3 font-label text-[9px] uppercase leading-[1.6] tracking-[0.04em] text-text-secondary hover:text-accent-strong sm:text-[10px]"
                  href={`/projects/${next.slug}`}
                >
                  <AppleSprite kind={next.apple} size={4} />
                  <span>
                    Next apple · <span className="text-text-primary group-hover:text-accent-strong">{next.title}</span>
                  </span>
                  <span aria-hidden="true">▸</span>
                </Link>
              ) : null}
            </div>
          </ScrollReveal>
        </Container>
      </article>
    </>
  );
}
