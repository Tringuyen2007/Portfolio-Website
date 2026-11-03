"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, CalendarDays } from "lucide-react";

import { AppleIcon } from "@/components/tree/apple-icon";
import { branches, getBranchForCategory } from "@/content/branches";
import type { TreeProject } from "@/lib/tree/types";
import { FRUIT_COLORS, FRUIT_LABELS } from "@/lib/tree/types";

type Filter = "all" | (typeof branches)[number]["id"];

/**
 * One lively section for every fruit on the tree: hackathons, competitions,
 * and the projects that grew between them. Filter chips narrow by branch.
 * Always rendered under the tree so nothing depends on hover or SVG hit-testing.
 */
export function ProjectList({ projects }: { projects: TreeProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const branchOf = (p: TreeProject) => p.tree?.branch ?? getBranchForCategory(p.category).id;
  const sorted = [...projects].sort((a, b) =>
    (b.date ?? `${b.year}`).localeCompare(a.date ?? `${a.year}`),
  );
  const visible = filter === "all" ? sorted : sorted.filter((p) => branchOf(p) === filter);
  const counts = Object.fromEntries(branches.map((b) => [b.id, sorted.filter((p) => branchOf(p) === b.id).length]));

  return (
    <section aria-labelledby="project-index" className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl" id="project-index">
            Hackathons &amp; competitions
          </h2>
          <p className="max-w-xl text-sm leading-7 text-text-secondary">
            Every fruit on the tree, newest first: the weekends, the wins, and the projects that
            grew between them.
          </p>
        </div>

        <div aria-label="Filter by branch" className="flex flex-wrap gap-2" role="group">
          <FilterChip active={filter === "all"} count={sorted.length} onClick={() => setFilter("all")}>
            All
          </FilterChip>
          {branches
            .filter((b) => counts[b.id] > 0)
            .map((b) => (
              <FilterChip active={filter === b.id} count={counts[b.id]} key={b.id} onClick={() => setFilter(b.id)}>
                {b.shortLabel}
              </FilterChip>
            ))}
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => {
          const [light, deep] = FRUIT_COLORS[project.fruit];
          const branch = branches.find((b) => b.id === branchOf(project));
          return (
            <li
              className="motion-safe:animate-[leaf-breathe_0.5s_ease-out_both]"
              key={project.slug}
              style={{ animationDelay: `${index * 40}ms`, animationIterationCount: 1 }}
            >
              <Link
                className="surface group relative flex h-full flex-col gap-3 overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:bg-bg-soft"
                href={project.href}
                style={{ ["--fruit" as string]: light, ["--fruit-deep" as string]: deep }}
              >
                {/* fruit-colored glow on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: light }}
                />

                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-heading text-xl font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent-strong">
                      {project.title}
                    </span>
                    <span className="mt-1 block text-xs text-text-muted">
                      {project.year}
                      {branch ? <> · {branch.shortLabel}</> : null}
                    </span>
                  </span>
                  <AppleIcon className="size-8 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" kind={project.fruit} />
                  <span className="sr-only">{FRUIT_LABELS[project.fruit].label}</span>
                </span>

                {project.award ? (
                  <span className="inline-flex items-center gap-1.5 self-start rounded-md bg-gold/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-gold">
                    <Award className="size-3" />
                    {project.award}
                  </span>
                ) : project.event ? (
                  <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
                    <CalendarDays className="size-3" />
                    {project.event}
                  </span>
                ) : null}

                <span className="line-clamp-3 text-sm leading-6 text-text-secondary">{project.summary}</span>

                <span
                  aria-hidden="true"
                  className="mt-auto h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${light}, ${deep})` }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FilterChip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={active}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-bg"
          : "border-border bg-bg-elevated text-text-secondary hover:border-text-muted hover:text-text-primary"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span className={active ? "text-bg/70" : "text-text-muted"}>{count}</span>
    </button>
  );
}
