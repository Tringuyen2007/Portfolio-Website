"use client";

import Link from "next/link";

import { useZoom } from "@/components/transitions/zoom-provider";
import { APPLE_COLORS, APPLE_SPRITES, type AppleKind, type FRUIT_COLORS } from "@/lib/tree/types";

export function BackToTree({
  slug,
  fruit,
  apple,
  className = "",
}: {
  slug: string;
  /** Legacy fruit kind; used to pick the apple colour when `apple` is absent. */
  fruit?: keyof typeof FRUIT_COLORS;
  apple?: AppleKind;
  className?: string;
}) {
  const { zoomBack } = useZoom();
  const kind: AppleKind = apple ?? (fruit === "golden" ? "golden" : "red");

  return (
    <Link
      className={`inline-flex min-h-11 items-center gap-3 font-label text-[9px] uppercase leading-[1.6] tracking-[0.04em] text-text-secondary hover:text-accent-strong sm:text-[10px] ${className}`}
      href="/projects"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        try {
          sessionStorage.setItem("tree:return", JSON.stringify({ slug, scrollY: 0 }));
        } catch {
          /* ignore */
        }
        zoomBack("/projects", `[data-apple="${slug}"]`, APPLE_COLORS[kind], APPLE_SPRITES[kind]);
      }}
    >
      <span aria-hidden="true">◀</span>
      Back to the tree
    </Link>
  );
}
