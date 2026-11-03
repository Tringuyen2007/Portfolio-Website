"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { StagePlaceholder } from "@/components/pixel/stage-placeholder";
import { branches } from "@/content/branches";
import { whenPageIdle } from "@/lib/pixel/assets";
import { branchIdFor } from "@/lib/pixel/orchard";
import type { TreeProject } from "@/lib/tree/types";

const OrchardStage = dynamic(
  () => import("@/components/pixel/orchard-stage").then((m) => m.OrchardStage),
  { ssr: false, loading: () => <StagePlaceholder /> },
);

/**
 * Branch filter chips + the interactive Pixi tree. Client-only so the chips can
 * dim apples on the canvas; the full project list below stays server-rendered.
 */
export function OrchardExplorer({ projects }: { projects: TreeProject[] }) {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  // Mount the Pixi stage once the page is idle; the same-size static tree
  // placeholder stands in until then, so first paint never waits on WebGL.
  const [stageReady, setStageReady] = useState(false);
  useEffect(() => {
    let live = true;
    void whenPageIdle().then(() => live && setStageReady(true));
    return () => {
      live = false;
    };
  }, []);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      const id = branchIdFor(p);
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  return (
    <div className="space-y-6">
      <div aria-label="Highlight a branch" className="flex flex-wrap gap-2" role="group">
        <button
          aria-pressed={activeBranch === null}
          className={`pill cursor-pointer ${activeBranch === null ? "pill-active" : ""}`}
          onClick={() => setActiveBranch(null)}
          type="button"
        >
          All branches
          <span className="ml-2 font-label text-[7px] opacity-70">{projects.length}</span>
        </button>
        {branches.map((branch) => {
          const count = counts.get(branch.id) ?? 0;
          const active = activeBranch === branch.id;
          return (
            <button
              aria-pressed={active}
              className={`pill cursor-pointer ${active ? "pill-active" : ""} ${count === 0 && !active ? "text-text-muted" : ""}`}
              key={branch.id}
              onClick={() => setActiveBranch((current) => (current === branch.id ? null : branch.id))}
              type="button"
            >
              {branch.shortLabel}
              <span className="ml-2 font-label text-[7px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="-mx-6 sm:mx-0">
        {stageReady ? <OrchardStage activeBranch={activeBranch} projects={projects} /> : <StagePlaceholder />}
      </div>
    </div>
  );
}
