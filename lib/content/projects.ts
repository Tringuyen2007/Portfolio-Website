import { cache } from "react";

import { allProjects } from "content-collections";

export type Project = (typeof allProjects)[number];

function sortProjects(projects: Project[]) {
  return [...projects].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.year !== right.year) {
      return right.year - left.year;
    }

    return left.title.localeCompare(right.title);
  });
}

export const getAllProjects = cache(() => sortProjects([...allProjects]));

export const getFeaturedProjects = cache(() =>
  getAllProjects().filter((project) => project.featured && !project.archived),
);

export const getProjectBySlug = cache((slug: string) =>
  getAllProjects().find((project) => project.slug === slug),
);
