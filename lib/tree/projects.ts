import type { Project } from "@/lib/content/projects";
import type { TreeProject } from "@/lib/tree/types";

/** Shrink a full project record to the serializable subset the tree needs. */
export function toTreeProject(project: Project): TreeProject {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    category: project.category,
    fruit: project.fruit,
    apple: project.apple,
    status: project.status,
    year: project.year,
    date: project.date,
    award: project.award,
    event: project.event,
    tree: project.tree,
    href: `/projects/${project.slug}`,
    articleHref: project.links.find((link) => link.kind === "article")?.href,
  };
}
