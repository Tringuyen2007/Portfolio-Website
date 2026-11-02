import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";

import { branches, getBranchForCategory } from "@/content/branches";
import type { TreeProject } from "@/lib/tree/types";
import { FRUIT_LABELS } from "@/lib/tree/types";

/**
 * Semantic, screen-reader-first path to every fruit on the tree. Always
 * rendered under the tree so nothing depends on hover or SVG hit-testing.
 */
export function ProjectList({ projects }: { projects: TreeProject[] }) {
  const groups = branches
    .map((branch) => ({
      branch,
      items: projects
        .filter((p) => (p.tree?.branch ?? getBranchForCategory(p.category).id) === branch.id)
        .sort((a, b) => (b.date ?? `${b.year}`).localeCompare(a.date ?? `${a.year}`)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section aria-labelledby="project-index" className="space-y-10">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary" id="project-index">
          Every fruit, in a list.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-text-secondary">
          The same projects and events, grouped by branch, for anyone who would rather read than climb.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {groups.map(({ branch, items }) => (
          <div className="space-y-4" key={branch.id}>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
              <h3 className="font-heading text-xl text-text-primary">{branch.label}</h3>
              <span className="text-xs text-text-muted">{items.length}</span>
            </div>
            <ul className="space-y-2">
              {items.map((project) => (
                <li key={project.slug}>
                  <Link
                    className="surface group flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-bg-soft"
                    href={project.href}
                  >
                    <span className="min-w-0 space-y-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-text-primary group-hover:text-accent-strong">
                          {project.title}
                        </span>
                        <span className="text-[11px] text-text-muted">{project.year}</span>
                        <span className="sr-only">{FRUIT_LABELS[project.fruit].label}</span>
                      </span>
                      {project.award ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[11px] uppercase tracking-[0.12em] text-gold">
                          <Award className="size-3" />
                          {project.award}
                        </span>
                      ) : null}
                      <span className="line-clamp-2 block text-sm leading-6 text-text-secondary">
                        {project.summary}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-text-muted group-hover:text-accent-strong" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
