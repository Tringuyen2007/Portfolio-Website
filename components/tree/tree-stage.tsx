"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ProjectCoverArt } from "@/components/project-art";
import { useZoom, TREE_RETURN_KEY } from "@/components/transitions/zoom-provider";
import { FruitPreview } from "@/components/tree/fruit-preview";
import { TreeSvg } from "@/components/tree/tree-svg";
import { buildTreeLayout, DESKTOP_FRAME, MOBILE_FRAME } from "@/lib/tree/layout";
import { FRUIT_COLORS, type TreeProject } from "@/lib/tree/types";

type PreviewState = {
  slug: string;
  anchor: DOMRect;
  mode: "hover" | "touch" | "keyboard";
};

const OPEN_DELAY = 70;
const CLOSE_GRACE = 170;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

export function TreeStage({ projects }: { projects: TreeProject[] }) {
  const router = useRouter();
  const { zoomTo } = useZoom();
  const mobile = useIsMobile();
  const frame = mobile ? MOBILE_FRAME : DESKTOP_FRAME;
  const layout = useMemo(() => buildTreeLayout(projects, frame), [projects, frame]);
  const bySlug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [projects]);
  const labels = useMemo(
    () =>
      Object.fromEntries(
        projects.map((p) => [
          p.slug,
          `${p.title}${p.award ? `, ${p.award}` : ""}. ${p.summary}`,
        ]),
      ),
    [projects],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [highlightedBranch, setHighlightedBranch] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [returnedSlug, setReturnedSlug] = useState<string | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const overPreview = useRef(false);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const anchorFor = useCallback((slug: string) => {
    const node = containerRef.current?.querySelector<SVGGElement>(`[data-fruit="${slug}"] .fruit-body`);
    return node?.getBoundingClientRect() ?? null;
  }, []);

  const show = useCallback(
    (slug: string, mode: PreviewState["mode"]) => {
      const anchor = anchorFor(slug);
      if (!anchor) return;
      clearTimers();
      setPreview({ slug, anchor, mode });
      // Let the element mount at scale(0.55) before opening.
      requestAnimationFrame(() => setPreviewOpen(true));
    },
    [anchorFor],
  );

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => {
      if (overPreview.current) return;
      setPreviewOpen(false);
      window.setTimeout(() => setPreview((p) => (previewOpen ? p : null)), 200);
      setPreview(null);
    }, CLOSE_GRACE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHoverStart = useCallback(
    (slug: string) => {
      clearTimers();
      if (preview && preview.slug !== slug) {
        // Swap content in place: no close/open flicker.
        show(slug, "hover");
        return;
      }
      openTimer.current = window.setTimeout(() => show(slug, "hover"), OPEN_DELAY);
    },
    [preview, show],
  );

  const navigate = useCallback(
    (slug: string) => {
      const project = bySlug.get(slug);
      const anchor = anchorFor(slug);
      if (!project) return;
      setPreviewOpen(false);
      setPreview(null);
      if (!anchor) {
        router.push(project.href);
        return;
      }
      zoomTo({
        kind: "fruit",
        href: project.href,
        slug,
        rect: { x: anchor.left, y: anchor.top, width: anchor.width, height: anchor.height },
        colors: FRUIT_COLORS[project.fruit],
        art: (
          <div className="h-[22vh] w-[40vw] max-w-md opacity-90">
            <ProjectCoverArt className="h-full w-full" slug={slug} />
          </div>
        ),
      });
    },
    [anchorFor, bySlug, router, zoomTo],
  );

  const handleActivate = useCallback(
    (slug: string, pointerType: string) => {
      if (pointerType === "touch") {
        if (preview?.slug === slug && preview.mode === "touch") {
          navigate(slug);
        } else {
          show(slug, "touch");
        }
        return;
      }
      navigate(slug);
    },
    [navigate, preview, show],
  );

  // Escape closes; tap/click outside closes; scroll closes (position would drift).
  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewOpen(false);
        setPreview(null);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-fruit-preview]") || target?.closest("[data-fruit]")) return;
      setPreviewOpen(false);
      setPreview(null);
    };
    const onScroll = () => {
      const anchor = anchorFor(preview.slug);
      if (anchor) setPreview((p) => (p ? { ...p, anchor } : p));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [preview, anchorFor]);

  // Pause ambient motion when offscreen or when the tab is hidden.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let visible = true;
    let onScreen = true;
    const apply = () => setPaused(!(visible && onScreen));
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    const onVisibility = () => {
      visible = !document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Returning from a project: restore scroll and pulse the fruit once.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(TREE_RETURN_KEY);
      if (!raw) return;
      sessionStorage.removeItem(TREE_RETURN_KEY);
      const saved = JSON.parse(raw) as { slug?: string; scrollY?: number };
      if (typeof saved.scrollY === "number") window.scrollTo({ top: saved.scrollY, behavior: "instant" });
      if (saved.slug) {
        const slug = saved.slug;
        window.setTimeout(() => setReturnedSlug(slug), 0);
        window.setTimeout(() => setReturnedSlug(null), 1600);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const previewProject = preview ? bySlug.get(preview.slug) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Highlight a branch">
        <button
          className={`pill text-xs transition ${highlightedBranch === null ? "border-accent text-text-primary" : ""}`}
          onClick={() => setHighlightedBranch(null)}
          type="button"
        >
          All branches
        </button>
        {layout.branches.map((branch) => (
          <button
            aria-pressed={highlightedBranch === branch.id}
            className={`pill text-xs transition ${
              highlightedBranch === branch.id ? "border-accent text-text-primary" : ""
            } ${branch.young ? "text-text-muted" : ""}`}
            key={branch.id}
            onClick={() => setHighlightedBranch((current) => (current === branch.id ? null : branch.id))}
            type="button"
          >
            {branch.shortLabel}
            <span className="ml-1.5 font-medium text-[10px] text-text-muted">{branch.fruits.length}</span>
          </button>
        ))}
      </div>

      <div
        className="relative mx-auto w-full max-w-5xl"
        data-tree-paused={paused ? "" : undefined}
        ref={containerRef}
      >
        <TreeSvg
          className={`h-auto w-full ${returnedSlug ? "[&_[data-fruit='" + returnedSlug + "']_.fruit-body]:animate-[pulse-ring_0s]" : ""}`}
          highlightedBranch={highlightedBranch}
          labels={labels}
          layout={layout}
          onActivate={handleActivate}
          onBlur={() => scheduleClose()}
          onFocus={(slug) => show(slug, "keyboard")}
          onHoverEnd={() => scheduleClose()}
          onHoverStart={handleHoverStart}
          selectedSlug={preview?.slug ?? returnedSlug}
        />
        <Fireflies count={mobile ? 5 : 9} />
      </div>

      {preview && previewProject ? (
        <FruitPreview
          anchor={preview.anchor}
          key={preview.slug}
          mode={preview.mode}
          onExplore={() => navigate(preview.slug)}
          onPointerEnter={() => {
            overPreview.current = true;
            clearTimers();
          }}
          onPointerLeave={() => {
            overPreview.current = false;
            scheduleClose();
          }}
          open={previewOpen}
          project={previewProject}
        />
      ) : null}
    </div>
  );
}

function Fireflies({ count }: { count: number }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: 12 + ((i * 37) % 76),
        top: 20 + ((i * 53) % 55),
        delay: (i * 1.3) % 6,
        duration: 5 + (i % 4),
      })),
    [count],
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {flies.map((fly, index) => (
        <span
          className="firefly absolute size-1.5 rounded-full bg-accent-strong shadow-[0_0_10px_3px_rgba(240,210,122,0.45)]"
          key={index}
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            ["--ff-delay" as string]: `${fly.delay}s`,
            ["--ff-duration" as string]: `${fly.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
