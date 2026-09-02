import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2, Star } from "lucide-react";

import type { Project } from "@/lib/content/projects";
import { ProjectCoverArt } from "@/components/project-art";

type ProjectCardProps = {
  project: Project;
};

const MAX_VISIBLE_STACK_ITEMS = 4;

export function ProjectCard({ project }: ProjectCardProps) {
  const visibleStack = project.stack.slice(0, MAX_VISIBLE_STACK_ITEMS);
  const hiddenStackCount = project.stack.length - visibleStack.length;

  return (
    <article
      className={`surface group flex h-full flex-col overflow-hidden ${
        project.highlight ? "border-accent/50 shadow-[0_0_0_1px_rgba(199,203,209,0.15),0_0_32px_-8px_rgba(199,203,209,0.35)]" : ""
      }`}
    >
      <div className="relative min-h-20 flex-1 overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_18rem),linear-gradient(180deg,#1f2329,#171a1f)]">
        {project.highlight ? (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-bg/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-accent-strong backdrop-blur">
            <Star className="size-3 fill-current" />
            {project.highlight}
          </span>
        ) : null}
        {project.cover ? (
          <Image
            alt={project.title}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            src={project.cover}
          />
        ) : (
          <div className="relative flex h-full flex-col p-5 transition duration-500 group-hover:scale-[1.02]">
            <ProjectCoverArt
              className="absolute inset-0 h-full w-full"
              slug={project.slug}
            />
            <span className="relative text-sm uppercase tracking-[0.2em] text-text-muted">
              {project.year}
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col space-y-3 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              {project.title}
            </h3>
            <span className="text-sm text-text-muted">{project.year}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{project.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleStack.map((item) => (
            <span className="pill text-xs" key={item}>
              {item}
            </span>
          ))}
          {hiddenStackCount > 0 ? (
            <span className="pill text-xs text-text-muted">+{hiddenStackCount}</span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 text-sm">
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
              <FolderGit2 className="size-2" />
              Repository
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
