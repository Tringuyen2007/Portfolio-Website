import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderGit2 } from "lucide-react";

import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { ProjectPreview } from "@/components/project-preview";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function HomePage() {
  const selectedSlugs = ["vision", "vending-machine-robot"];
  const selectedProjects = getAllProjects().filter((p) =>
    selectedSlugs.includes(p.slug),
  ).sort((a, b) => selectedSlugs.indexOf(a.slug) - selectedSlugs.indexOf(b.slug));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    sameAs: [siteConfig.githubUrl],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.school,
    },
  };

  return (
    <>
      <JsonLd data={personJsonLd} />

      <section className="py-18 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div className="space-y-7">
              <span className="eyebrow">{siteConfig.role}</span>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-balance text-text-primary sm:text-6xl">
                  Thoughtful software with an AI and data science core.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                  I&apos;m {siteConfig.name}, a builder focused on calm interfaces,
                  solid technical foundations, and projects that explain their
                  thinking as clearly as they show their code.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:bg-accent-strong"
                  href="/projects"
                >
                  View work
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary hover:bg-bg-soft"
                  href="/about"
                >
                  About me
                </Link>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary"
                  href={siteConfig.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FolderGit2 className="size-4" />
                  GitHub
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {siteConfig.skills.map((skill) => (
                  <span className="pill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface overflow-hidden">
              <div className="grid gap-6 p-6 sm:p-8">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-border bg-bg-soft">
                  <Image
                    alt="Portrait of Tri Nguyen"
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    src="/images/profile.jpg"
                  />
                </div>

                <div className="grid gap-4 text-sm">
                  <div className="rounded-2xl border border-border bg-bg-soft p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                      Current focus
                    </p>
                    <p className="mt-2 text-base text-text-primary">
                      Building AI and ML projects, shipping software, and always finding something new to learn.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-bg-soft p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                      Building around
                    </p>
                    <p className="mt-2 text-base text-text-primary">
                      AI, data science, computer vision, and pragmatic product design.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-bg-soft p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                      Based in
                    </p>
                    <p className="mt-2 text-base text-text-primary">UT San Antonio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-18 sm:pb-24">
        <Container className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <span className="eyebrow">Selected work</span>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                Selected work
              </h2>
            </div>

            <Link
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
              href="/projects"
            >
              See all projects
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {selectedProjects.map((project) => (
              <ProjectPreview key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
