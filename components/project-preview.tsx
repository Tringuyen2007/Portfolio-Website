import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Project } from "@/lib/content/projects";

type ProjectPreviewProps = {
  project: Project;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <Link
      className="surface group flex flex-col gap-4 px-6 py-5 hover:bg-bg-elevated transition-colors"
      href={`/projects/${project.slug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="block text-base font-semibold tracking-tight text-text-primary group-hover:text-accent-strong transition-colors">
            {project.title}
          </span>
          <span className="text-sm text-text-muted">{project.year}</span>
        </div>
        <ArrowRight className="size-4 shrink-0 mt-1 text-text-muted group-hover:text-accent-strong transition-colors" />
      </div>

      <p className="text-sm leading-7 text-text-secondary">{project.summary}</p>

      <div className="flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((tag) => (
          <span className="pill text-xs" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
