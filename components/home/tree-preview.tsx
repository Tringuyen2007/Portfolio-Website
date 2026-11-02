"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useRef } from "react";

import { useZoom } from "@/components/transitions/zoom-provider";
import { TreeSvg } from "@/components/tree/tree-svg";
import { buildTreeLayout, DESKTOP_FRAME } from "@/lib/tree/layout";
import type { TreeProject } from "@/lib/tree/types";

/**
 * Homepage introduction to the tree: the same layout as /projects, rendered
 * non-interactive. The whole card is one link that zooms into the tree page.
 */
export function TreePreview({ projects }: { projects: TreeProject[] }) {
  const { zoomTo } = useZoom();
  const ref = useRef<HTMLAnchorElement>(null);
  const layout = useMemo(() => buildTreeLayout(projects, DESKTOP_FRAME), [projects]);

  return (
    <a
      aria-label="Explore the tree of projects and events"
      className="surface group relative block overflow-hidden focus-visible:outline-accent"
      href="/projects"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        zoomTo({
          kind: "tree",
          href: "/projects",
          rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
          colors: ["#1a2119", "#101410"],
        });
      }}
      ref={ref}
    >
      <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]">
        <TreeSvg className="h-auto w-full" interactive={false} labels={{}} layout={layout} showLabels={false} />
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-bg via-bg/70 to-transparent px-6 pb-6 pt-20 sm:px-8">
        <span className="space-y-1">
          <span className="eyebrow-plain block">Projects &amp; events</span>
          <span className="font-heading text-2xl text-text-primary sm:text-3xl">Step into the orchard</span>
        </span>
        <span className="btn-primary">
          Explore the tree
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  );
}
