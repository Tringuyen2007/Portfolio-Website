"use client";

import { ArrowRight, Award } from "lucide-react";
import { useMemo, useRef, type CSSProperties } from "react";

import { ProjectCoverArt } from "@/components/project-art";
import type { TreeProject } from "@/lib/tree/types";

export const PREVIEW_W = 250;
export const PREVIEW_H = 236;
const GAP = 18;
const PAD = 12;

export type PreviewPlacement = {
  left: number;
  top: number;
  origin: string;
};

export function placePreview(anchor: DOMRect): PreviewPlacement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = anchor.left + anchor.width / 2;
  const cy = anchor.top + anchor.height / 2;
  const roomRight = vw - anchor.right;
  const roomLeft = anchor.left;
  const roomAbove = anchor.top;

  let left: number;
  let top: number;
  let origin: string;

  if (roomRight >= PREVIEW_W + GAP + PAD) {
    left = anchor.right + GAP;
    top = cy - PREVIEW_H / 2;
    origin = "left center";
  } else if (roomLeft >= PREVIEW_W + GAP + PAD) {
    left = anchor.left - GAP - PREVIEW_W;
    top = cy - PREVIEW_H / 2;
    origin = "right center";
  } else if (roomAbove >= PREVIEW_H + GAP + PAD) {
    left = cx - PREVIEW_W / 2;
    top = anchor.top - GAP - PREVIEW_H;
    origin = "center bottom";
  } else {
    left = cx - PREVIEW_W / 2;
    top = anchor.bottom + GAP;
    origin = "center top";
  }

  left = Math.min(vw - PREVIEW_W - PAD, Math.max(PAD, left));
  top = Math.min(vh - PREVIEW_H - PAD, Math.max(PAD + 72, top));
  return { left, top, origin };
}

type FruitPreviewProps = {
  project: TreeProject;
  anchor: DOMRect;
  mode: "hover" | "touch" | "keyboard";
  open: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onExplore: () => void;
};

/**
 * Apple-shaped preview that grows out of the hovered fruit. The silhouette is
 * an SVG apple behind a rounded content inset, so text never wraps awkwardly.
 */
export function FruitPreview({
  project,
  anchor,
  mode,
  open,
  onPointerEnter,
  onPointerLeave,
  onExplore,
}: FruitPreviewProps) {
  const placement = useMemo(() => placePreview(anchor), [anchor]);
  const ref = useRef<HTMLDivElement>(null);
  const golden = project.fruit === "golden";

  const style: CSSProperties = {
    left: placement.left,
    top: placement.top,
    width: PREVIEW_W,
    height: PREVIEW_H + 22,
    transformOrigin: placement.origin,
    transform: open ? "scale(1)" : "scale(0.55)",
    opacity: open ? 1 : 0,
    transition: "transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease-out",
  };

  return (
    <div
      aria-live="polite"
      className="fixed z-[60] select-none"
      data-fruit-preview
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      ref={ref}
      role="dialog"
      aria-label={`${project.title} preview`}
      style={style}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
        preserveAspectRatio="none"
        viewBox="0 0 220 222"
      >
        <defs>
          <linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1c221b" />
            <stop offset="100%" stopColor="#141913" />
          </linearGradient>
          <linearGradient id="preview-gold-stroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f0d27a" />
            <stop offset="100%" stopColor="#a9822a" />
          </linearGradient>
        </defs>
        <g transform="translate(0 22)">
          <path
            d="M110 12 C 134 -6, 196 -4, 212 46 C 226 92, 206 160, 160 190 C 140 203, 120 200, 110 194 C 100 200, 80 203, 60 190 C 14 160, -6 92, 8 46 C 24 -4, 86 -6, 110 12 Z"
            fill="url(#preview-fill)"
            stroke={golden ? "url(#preview-gold-stroke)" : "var(--border)"}
            strokeWidth={golden ? 1.6 : 1}
          />
        </g>
        <rect fill="var(--bark-deep)" height="22" rx="2" width="4" x="108" y="4" />
        <ellipse
          cx="124"
          cy="12"
          fill="var(--leaf)"
          rx="13"
          ry="5.5"
          transform="rotate(-28 124 12)"
        />
      </svg>

      <div className="relative flex h-full flex-col items-center px-9 pb-8 pt-11 text-center">
        <p className="font-heading text-[20px] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
          {project.title}
        </p>
        <div className="mt-2 h-16 w-full overflow-hidden rounded-xl border border-border/70 bg-bg-soft/70">
          <ProjectCoverArt className="h-full w-full" slug={project.slug} />
        </div>
        {project.award ? (
          <p className="mt-1.5 inline-flex items-center gap-1 font-medium text-[9.5px] uppercase tracking-[0.14em] text-gold">
            <Award className="size-3" />
            <span className="line-clamp-1">{project.award}</span>
          </p>
        ) : (
          <p className="mt-1.5 font-medium text-[9.5px] uppercase tracking-[0.14em] text-text-muted">
            {project.event ?? project.year}
          </p>
        )}
        <p className="mt-1 line-clamp-2 px-2 text-[11px] leading-[1.35] text-text-secondary">
          {project.summary}
        </p>
        {mode === "touch" ? (
          <button
            className="mt-auto inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-bg"
            onClick={onExplore}
            type="button"
          >
            Explore
            <ArrowRight className="size-3" />
          </button>
        ) : (
          <p className="mt-auto inline-flex items-center gap-1 text-[11px] text-text-muted">
            Click to explore
            <ArrowRight className="size-3" />
          </p>
        )}
      </div>
    </div>
  );
}
