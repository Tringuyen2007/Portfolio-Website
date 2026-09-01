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
    <section className="py-18 sm:py-24">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>

        <ScrollReveal>
          <ProjectsShowcase projects={projects} />
        </ScrollReveal>
      </Container>
    </section>
  );
}
