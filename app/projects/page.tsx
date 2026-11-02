import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ProjectList } from "@/components/tree/project-list";
import { TreeLegend } from "@/components/tree/tree-legend";
import { TreeStage } from "@/components/tree/tree-stage";
import { getAllProjects } from "@/lib/content/projects";
import { toTreeProject } from "@/lib/tree/projects";

export const metadata: Metadata = {
  title: "Projects & Events",
  description:
    "An interactive tree of Tri Nguyen's projects, hackathons, competitions, and achievements. Every fruit is a story; golden apples are the wins.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects()
    .filter((project) => !project.archived)
    .map(toTreeProject);
  const golden = projects.filter((p) => p.fruit === "golden").length;

  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-6xl">
              Every fruit is a story.
            </h1>
            <p className="max-w-xl text-base leading-8 text-text-secondary">
              Branches are the areas I have grown in. Fruits are projects, hackathons, and events.
              Hover or tap a fruit for a glimpse, then click to step inside.
            </p>
          </div>
          <dl className="flex gap-8 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
            <div>
              <dt>Fruits</dt>
              <dd className="mt-1 font-heading text-3xl normal-case tracking-normal text-text-primary">
                {projects.length}
              </dd>
            </div>
            <div>
              <dt>Golden</dt>
              <dd className="mt-1 font-heading text-3xl normal-case tracking-normal text-gold">{golden}</dd>
            </div>
          </dl>
        </div>

        <TreeStage projects={projects} />

        <TreeLegend />

        <div className="hairline" />

        <ProjectList projects={projects} />
      </Container>
    </section>
  );
}
