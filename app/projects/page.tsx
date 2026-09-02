import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ProjectsShowcase } from "@/components/project-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    <section className="flex flex-col py-6 sm:py-8">
      <Container className="flex flex-col gap-4">
        <div className="space-y-2 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-2xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>

        <div className="pt-12 pb-6">
          <ScrollReveal className="block">
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
