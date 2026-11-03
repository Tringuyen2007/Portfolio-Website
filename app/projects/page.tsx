import type { Metadata } from "next";

import { Container } from "@/components/container";
import { OrchardExplorer } from "@/components/pixel/orchard-explorer";
import { ProjectList } from "@/components/tree/project-list";
import { TreeLegend } from "@/components/tree/tree-legend";
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
  const golden = projects.filter((p) => p.apple === "golden").length;
  const enchanted = projects.filter((p) => p.apple === "enchanted").length;

  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <p className="eyebrow-plain">Projects &amp; events</p>
            <h1 className="font-heading text-4xl font-bold leading-[1.05] text-text-primary sm:text-6xl">
              Every apple is a story.
            </h1>
            <p className="max-w-xl text-base leading-8 text-text-secondary">
              Branches are the areas I have grown in. Apples are projects, hackathons, and events;
              golden ones came home with an award. Hover or tap an apple for a glimpse, then click
              to step inside.
            </p>
          </div>
          <dl className="flex gap-8">
            <div>
              <dt className="eyebrow-plain">Apples</dt>
              <dd className="mt-1 font-pixel text-3xl text-text-primary">{projects.length}</dd>
            </div>
            <div>
              <dt className="eyebrow-plain">Golden</dt>
              <dd className="mt-1 font-pixel text-3xl text-gold">{golden}</dd>
            </div>
            <div>
              <dt className="eyebrow-plain">Enchanted</dt>
              <dd className="mt-1 font-pixel text-3xl text-ench-hi">{enchanted}</dd>
            </div>
          </dl>
        </div>

        <OrchardExplorer projects={projects} />

        <TreeLegend />

        <div className="section-rule" />

        <ProjectList projects={projects} />
      </Container>
    </section>
  );
}
