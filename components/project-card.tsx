import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2 } from "lucide-react";

import type { Project } from "@/lib/content/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="surface group overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_18rem),linear-gradient(180deg,#1f2329,#171a1f)]">
        {project.cover ? (
          <Image
            alt={project.title}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            src={project.cover}
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-6">
            <span className="text-sm uppercase tracking-[0.2em] text-text-muted">
              {project.year}
            </span>
            <div>
              <p className="max-w-[14rem] text-2xl font-semibold tracking-tight text-text-primary">
                {project.title}
              </p>
              <p className="mt-3 text-sm text-text-secondary">
                {project.stack.slice(0, 3).join(" • ")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight text-text-primary">
              {project.title}
            </h3>
            <span className="text-sm text-text-muted">{project.year}</span>
          </div>
          <p className="text-sm leading-7 text-text-secondary">{project.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span className="pill text-xs" key={item}>
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            className="inline-flex items-center gap-2 text-text-primary hover:text-accent-strong"
            href={`/projects/${project.slug}`}
          >
            Full details
            <ArrowUpRight className="size-4" />
          </Link>

          {project.repo ? (
            <a
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary"
              href={project.repo}
              rel="noreferrer"
              target="_blank"
            >
              <FolderGit2 className="size-4" />
              Repository
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
