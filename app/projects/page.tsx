import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ProjectsShowcase } from "@/components/project-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ViewportLock } from "@/components/viewport-lock";
import { getAllProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Tri Nguyen, including detailed case studies and the thinking behind each build.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="flex h-full min-h-0 flex-col py-6 sm:py-8">
      <ViewportLock />
      <Container className="flex h-full min-h-0 flex-col gap-4">
        <div className="shrink-0 space-y-2 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-2xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>

        <div className="min-h-0 flex-1 pt-12">
          <ScrollReveal className="block h-full">
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
