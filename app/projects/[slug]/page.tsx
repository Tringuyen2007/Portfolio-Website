import type { Metadata } from "next";
import Link from "next/link";
import { MDXContent } from "@content-collections/mdx/react";
import { ArrowLeft, ArrowUpRight, FolderGit2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    dateCreated: String(project.year),
    keywords: project.stack,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    codeRepository: project.repo,
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />

      <section className="py-18 sm:py-24">
        <Container className="space-y-10">
          <Link
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
            href="/projects"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
            <div className="space-y-6">
              <span className="eyebrow">{project.year}</span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
                  {project.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                  {project.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span className="pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.repo ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary hover:bg-bg-soft"
                    href={project.repo}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FolderGit2 className="size-4" />
                    Repository
                  </a>
                ) : null}

                {project.liveUrl ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg hover:bg-accent-strong"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live site
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>

            <aside className="surface p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                Quick read
              </p>
              <dl className="mt-5 space-y-5 text-sm">
                <div>
                  <dt className="text-text-muted">Year</dt>
                  <dd className="mt-1 text-text-primary">{project.year}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Primary themes</dt>
                  <dd className="mt-1 text-text-primary">{project.stack.slice(0, 3).join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Format</dt>
                  <dd className="mt-1 text-text-primary">Case study</dd>
                </div>
              </dl>
            </aside>
          </div>

          <article className="surface p-6 sm:p-8 lg:p-10">
            <div data-prose>
              <MDXContent code={project.body} components={mdxComponents} />
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
