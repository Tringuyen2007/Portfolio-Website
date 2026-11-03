"use client";

import { useState } from "react";
import Link from "next/link";

import { AppleSprite } from "@/components/project/apple-sprite";
import { branches } from "@/content/branches";
import { branchIdFor } from "@/lib/pixel/orchard";
import type { TreeProject } from "@/lib/tree/types";
import { APPLE_COLORS, APPLE_LABELS } from "@/lib/tree/types";

type Filter = "all" | (typeof branches)[number]["id"];

/**
 * Every apple on the tree as a plain list: hackathons, competitions, and the
 * projects that grew between them. Always rendered under the tree so nothing
 * depends on hover or canvas hit-testing.
 */
export function ProjectList({ projects }: { projects: TreeProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...projects].sort((a, b) =>
    (b.date ?? `${b.year}`).localeCompare(a.date ?? `${a.year}`),
  );
  const visible = filter === "all" ? sorted : sorted.filter((p) => branchIdFor(p) === filter);
  const counts = Object.fromEntries(
    branches.map((b) => [b.id, sorted.filter((p) => branchIdFor(p) === b.id).length]),
  );

  return (
    <section aria-labelledby="project-index" className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl" id="project-index">
            Hackathons &amp; competitions
          </h2>
          <p className="max-w-xl text-[15px] leading-7 text-text-secondary">
            Every apple on the tree, newest first: the weekends, the wins, and the projects that
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
        {visible.map((project) => {
          const [hi] = APPLE_COLORS[project.apple];
          const branch = branches.find((b) => b.id === branchIdFor(project));
          const awardColor =
            project.apple === "golden" ? "text-gold" : project.apple === "enchanted" ? "text-ench-hi" : "text-text-muted";
          return (
            <li key={project.slug}>
              <Link
                className="panel group relative flex h-full flex-col gap-3 p-5 transition-colors hover:bg-bg-soft"
                href={project.href}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-heading text-xl font-bold leading-tight text-text-primary transition-colors group-hover:text-accent-strong">
                      {project.title}
                    </span>
                    <span className="mt-1.5 block font-label text-[7px] uppercase text-text-muted">
                      {project.year}
                      {branch ? <> · {branch.shortLabel}</> : null}
                    </span>
                  </span>
                  <AppleSprite className="transition-transform duration-200 group-hover:-translate-y-1" kind={project.apple} size={8} />
                  <span className="sr-only">{APPLE_LABELS[project.apple].label}</span>
                </span>

                {project.award ?? project.event ? (
                  <span className={`font-label text-[7px] uppercase leading-[1.6] ${awardColor}`}>
                    {project.award ?? project.event}
                  </span>
                ) : null}

                <span className="line-clamp-3 text-[15px] leading-6 text-text-secondary">{project.summary}</span>

                <span
                  aria-hidden="true"
                  className="mt-auto block h-[var(--unit)] w-10 transition-all duration-300 group-hover:w-full"
                  style={{ background: hi }}
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
      className={`pill cursor-pointer transition-colors ${active ? "pill-active" : "hover:bg-bg-soft"}`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span className="ml-2 font-label text-[7px] opacity-70">{count}</span>
    </button>
  );
}
