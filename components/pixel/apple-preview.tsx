"use client";

import { useEffect, useMemo, type CSSProperties } from "react";

import { PixelImg } from "@/components/pixel/pixel-img";
import { Scene } from "@/components/pixel/scene";
import { APPLE_COLORS, type TreeProject } from "@/lib/tree/types";

export const PREVIEW_W = 300;
export const PREVIEW_H = 320;
const GAP = 18;
const PAD = 12;

export type PreviewPlacement = {
  left: number;
  top: number;
  origin: string;
};

/** Viewport-aware placement: beside the apple when there is room, else above / below. */
export function placePreview(anchor: DOMRect, w = PREVIEW_W, h = PREVIEW_H): PreviewPlacement {
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

  if (roomRight >= w + GAP + PAD) {
    left = anchor.right + GAP;
    top = cy - h / 2;
    origin = "left center";
  } else if (roomLeft >= w + GAP + PAD) {
    left = anchor.left - GAP - w;
    top = cy - h / 2;
    origin = "right center";
  } else if (roomAbove >= h + GAP + PAD) {
    left = cx - w / 2;
    top = anchor.top - GAP - h;
    origin = "center bottom";
  } else {
    left = cx - w / 2;
    top = anchor.bottom + GAP;
    origin = "center top";
  }

  left = Math.min(vw - w - PAD, Math.max(PAD, left));
  top = Math.min(vh - h - PAD, Math.max(PAD + 72, top));
  return { left, top, origin };
}

function awardClass(kind: TreeProject["apple"]) {
  if (kind === "golden") return "text-gold";
  if (kind === "enchanted") return "text-ench-hi";
  return "text-text-muted";
}

function AwardLine({ project, className = "" }: { project: TreeProject; className?: string }) {
  const text = project.award ?? project.event ?? String(project.year);
  return (
    <p className={`font-label text-[8px] uppercase leading-[1.6] ${awardClass(project.apple)} ${className}`}>
      {text}
    </p>
  );
}

function Hint({ project }: { project: TreeProject }) {
  const enchanted = project.apple === "enchanted";
  return (
    <p
      className={`font-label inline-flex items-center gap-2 whitespace-nowrap uppercase leading-none text-text-muted ${
        enchanted ? "text-[6px]" : "text-[7px]"
      }`}
    >
      <PixelImg art={{ w: 7, h: 9 }} src="/pixel/cursor.png" style={{ width: 14, height: 18 }} />
      <span>
        Click to explore
        {enchanted && project.articleHref ? (
          <>
            {" · "}
            <a
              className="text-ench-hi underline-offset-2 hover:underline"
              href={project.articleHref}
              onClick={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              Read the article ↗
            </a>
          </>
        ) : null}
      </span>
    </p>
  );
}

type ApplePreviewProps = {
  project: TreeProject;
  anchor: DOMRect;
  mode: "hover" | "touch" | "keyboard";
  open: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onExplore: () => void;
};

/**
 * Desktop preview: an apple-shaped shell (shell-<kind>.png scaled ×5) that grows out of
 * the hovered apple, with the project's two-frame pixel scene inside.
 */
export function ApplePreview({
  project,
  anchor,
  mode,
  open,
  onPointerEnter,
  onPointerLeave,
  onExplore,
}: ApplePreviewProps) {
  const placement = useMemo(() => placePreview(anchor), [anchor]);
  const enchanted = project.apple === "enchanted";

  const style: CSSProperties = {
    left: placement.left,
    top: placement.top,
    width: PREVIEW_W,
    height: PREVIEW_H,
    backgroundImage: `url(/pixel/shell-${project.apple}.png)`,
    transformOrigin: placement.origin,
    transform: open ? "scale(1)" : "scale(0.55)",
    opacity: open ? 1 : 0,
    transition: "transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease-out",
  };

  return (
    <div
      aria-label={`${project.title} preview`}
      aria-live="polite"
      className={`apple-preview-shell fixed z-[60] select-none ${enchanted ? "apple-preview-enchanted" : ""}`}
      data-apple-preview
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="dialog"
      style={style}
    >
      <div className="flex h-full flex-col items-center px-8 pb-7 pt-9 text-center">
        <p className="font-pixel text-[22px] leading-none text-text-primary">{project.title}</p>
        <Scene className="mt-2.5" scale={4} slug={project.slug} />
        <AwardLine className="mt-2 line-clamp-2 px-1" project={project} />
        <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-text-secondary">{project.summary}</p>
        <div className="mt-auto">
          {mode === "touch" ? (
            <button className="btn-primary px-4 py-2 text-sm" onClick={onExplore} type="button">
              Explore ▸
            </button>
          ) : (
            <Hint project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

type AppleSheetProps = {
  project: TreeProject;
  open: boolean;
  onClose: () => void;
  /** Scrim tap at a viewport point: lets a second tap on the apple open it. */
  onScrimTap?: (x: number, y: number) => void;
  onExplore: () => void;
};

/**
 * Mobile preview (≤767 px): a bottom sheet with an apple-coloured top border.
 * Tapping the scrim closes; "Explore" opens the project.
 */
export function AppleSheet({ project, open, onClose, onScrimTap, onExplore }: AppleSheetProps) {
  const [hi] = APPLE_COLORS[project.apple];
  const enchanted = project.apple === "enchanted";

  // Lock body scroll while the sheet is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]" data-apple-preview>
      <button
        aria-label="Close preview"
        className="absolute inset-0 bg-bg transition-opacity duration-200"
        onClick={(event) => (onScrimTap ? onScrimTap(event.clientX, event.clientY) : onClose())}
        style={{ opacity: open ? 0.6 : 0 }}
        type="button"
      />
      <div
        aria-label={`${project.title} preview`}
        className={`panel absolute inset-x-0 bottom-0 flex h-[300px] flex-col px-5 pb-5 pt-3 ${
          enchanted ? "apple-preview-enchanted" : ""
        }`}
        role="dialog"
        style={{
          borderTop: `var(--unit) solid ${hi}`,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <span aria-hidden="true" className="mx-auto mb-3 block h-[3px] w-10 bg-border" />
        <div className="flex gap-4">
          <Scene className="shrink-0" scale={3} slug={project.slug} />
          <div className="min-w-0 flex-1">
            <p className="font-pixel text-[20px] leading-none text-text-primary">{project.title}</p>
            <AwardLine className="mt-1.5 line-clamp-2" project={project} />
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.5] text-text-secondary">{project.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          {enchanted && project.articleHref ? (
            <a
              className="font-label inline-flex min-h-11 items-center text-[8px] uppercase text-ench-hi"
              href={project.articleHref}
              rel="noreferrer"
              target="_blank"
            >
              Read the article ↗
            </a>
          ) : (
            <span />
          )}
          <button className="btn-primary min-h-11 px-4 py-2 text-base" onClick={onExplore} type="button">
            Explore ▸
          </button>
        </div>
      </div>
    </div>
  );
}
