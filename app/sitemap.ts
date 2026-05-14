import type { MetadataRoute } from "next";

import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = ["", "/about", "/projects", "/writing", "/contact"];
  const projects = getAllProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(),
  }));

  return [
    ...coreRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date(),
    })),
    ...projects,
  ];
}
