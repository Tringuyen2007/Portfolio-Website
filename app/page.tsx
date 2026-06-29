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
        <Container className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
            <div className="space-y-7">
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-balance text-text-primary sm:text-6xl">
                  Thoughtful software with an AI and data science core.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                  Hello, I&apos;m {siteConfig.name}, a builder focused on machine
                  learning and AI-driven projects that combine intelligent systems
                  with thoughtful user experiences. I&apos;m passionate about
                  learning, building, and exploring how technology can solve
                  real-world problems through practical and impactful solutions.
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
            </div>

            <div className="surface overflow-hidden">
              <div className="p-6 sm:p-8">
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
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-18 sm:pb-24">
        <Container className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
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
