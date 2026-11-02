import type { Metadata } from "next";
import Link from "next/link";
import { MDXContent } from "@content-collections/mdx/react";
import { ArrowRight, ArrowUpRight, Award, FolderGit2, Globe, Newspaper, Trophy } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { ProjectGallery } from "@/components/gallery/project-gallery";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { BackToTree } from "@/components/project/back-to-tree";
import { ProjectCoverArt } from "@/components/project-art";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StackIconGrid } from "@/components/stack-icon-grid";
import { getBranchForCategory } from "@/content/branches";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { FRUIT_LABELS } from "@/lib/tree/types";

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

const linkIcon = {
  github: FolderGit2,
  devpost: Trophy,
  live: Globe,
  article: Newspaper,
  event: Globe,
  other: ArrowUpRight,
} as const;

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
  const golden = project.fruit === "golden";

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
        <section
          className={`relative overflow-hidden border-b border-border ${
            golden ? "bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(233,195,92,0.14),transparent_70%)]" : "bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(200,70,60,0.10),transparent_70%)]"
          }`}
          data-zoom-target
        >
          <Container className="space-y-10 py-12 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BackToTree fruit={project.fruit} slug={project.slug} />
              <span className="eyebrow-plain">
                {branch.shortLabel} · {FRUIT_LABELS[project.fruit].label}
              </span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                {project.award ? (
                  <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-medium text-[11px] uppercase tracking-[0.18em] text-gold">
                    <Award className="size-3.5" />
                    {project.award}
                  </p>
                ) : null}
                <h1 className="font-heading text-5xl font-semibold tracking-[-0.045em] text-text-primary sm:text-7xl">
                  {project.title}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-text-secondary">{project.summary}</p>
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => {
                    const Icon = linkIcon[link.kind];
                    return (
                      <a
                        className={link.kind === "github" ? "btn-secondary" : link.kind === "live" ? "btn-primary" : "btn-secondary"}
                        href={link.href}
                        key={link.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Icon className="size-4" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div
                className={`surface relative aspect-[4/3] overflow-hidden p-6 ${
                  golden ? "border-gold/40 shadow-[0_0_80px_-30px_rgba(233,195,92,0.6)]" : ""
                }`}
              >
                <ProjectCoverArt className="h-full w-full" slug={project.slug} />
                <span className="absolute bottom-4 left-5 font-medium text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  Fig. 01 · {project.year}
                </span>
              </div>
            </div>
          </Container>
        </section>

        <Container className="space-y-16 pt-12">
          <ScrollReveal>
            <dl className="grid gap-x-8 gap-y-6 border-b border-border pb-10 sm:grid-cols-3 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="eyebrow-plain">{fact.label}</dt>
                  <dd className="mt-2 text-sm text-text-primary">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          <div className="grid gap-12 lg:grid-cols-[1fr_16rem]">
            <ScrollReveal>
              <div data-prose>
                <MDXContent code={project.body} components={mdxComponents} />
              </div>
            </ScrollReveal>

            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <div>
                <p className="eyebrow-plain">Built with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span className="pill text-xs" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <StackIconGrid stack={project.stack} />
            </aside>
          </div>

          {project.gallery.length ? (
            <ScrollReveal>
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary">
                    From the build.
                  </h2>
                </div>
                <ProjectGallery images={project.gallery} title={project.title} />
              </section>
            </ScrollReveal>
          ) : null}

          <ScrollReveal>
            <div className="flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
              <BackToTree fruit={project.fruit} slug={project.slug} />
              {next ? (
                <Link
                  className="group inline-flex items-center gap-3 text-right"
                  href={`/projects/${next.slug}`}
                >
                  <span>
                    <span className="eyebrow-plain block">Next fruit</span>
                    <span className="font-heading text-2xl text-text-primary group-hover:text-accent-strong">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRight className="size-5 text-text-muted group-hover:text-accent-strong" />
                </Link>
              ) : null}
            </div>
          </ScrollReveal>
        </Container>
      </article>
    </>
  );
}
