"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { StagePlaceholder } from "@/components/pixel/stage-placeholder";
import { useZoom } from "@/components/transitions/zoom-provider";
import { whenPageIdle } from "@/lib/pixel/assets";
import type { TreeProject } from "@/lib/tree/types";

const OrchardStage = dynamic(
  () => import("@/components/pixel/orchard-stage").then((m) => m.OrchardStage),
  { ssr: false, loading: () => <StagePlaceholder unit={3} /> },
);

/**
 * Homepage introduction to the tree: the same orchard as /projects in a quiet
 * preview mode (sway only, no previews). The whole card is one link that zooms
 * into the tree page.
 */
export function TreePreview({ projects }: { projects: TreeProject[] }) {
  const { zoomTo } = useZoom();
  const ref = useRef<HTMLAnchorElement | null>(null);
  // Below the fold: fetch Pixi and mount the stage only once the card nears the
  // viewport (and the page is idle). The static tree placeholder fills in until then.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let live = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void whenPageIdle().then(() => live && setNear(true));
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      live = false;
      io.disconnect();
    };
  }, []);

  return (
    <Link
      aria-label="Explore the tree of projects and events"
      className="panel group relative block overflow-hidden focus-visible:outline-accent"
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
          colors: ["#161a2f", "#0a0e24"],
        });
      }}
      ref={ref}
    >
      <div className="pointer-events-none">
        {near ? <OrchardStage mode="preview" projects={projects} unit={3} /> : <StagePlaceholder unit={3} />}
      </div>
      <span className="pointer-events-none relative flex flex-col items-start gap-4 border-t-4 border-border bg-bg px-6 py-6 sm:absolute sm:inset-x-0 sm:bottom-0 sm:flex-row sm:items-end sm:justify-between sm:border-t-0 sm:bg-transparent sm:bg-gradient-to-t sm:from-bg sm:via-bg/80 sm:to-transparent sm:px-8 sm:pb-6 sm:pt-24">
        <span className="space-y-2">
          <span className="eyebrow-plain block">Projects &amp; events</span>
          <span className="block font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            Step into the orchard
          </span>
        </span>
        <span className="btn-primary">Explore the tree ▸</span>
      </span>
    </Link>
  );
}
