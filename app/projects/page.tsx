import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
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
        <div className="space-y-4">
          <span className="eyebrow">Projects</span>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
            A small set of projects with enough detail to be useful.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
            I care about the narrative as much as the build itself. Each project page
            is meant to show what was made, why it mattered, and where the interesting
            technical decisions lived.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
