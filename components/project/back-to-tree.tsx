"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useZoom } from "@/components/transitions/zoom-provider";
import { FRUIT_COLORS } from "@/lib/tree/types";

export function BackToTree({
  slug,
  fruit,
  className = "",
}: {
  slug: string;
  fruit: keyof typeof FRUIT_COLORS;
  className?: string;
}) {
  const { zoomBack } = useZoom();

  return (
    <Link
      className={`inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary ${className}`}
      href="/projects"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        try {
          sessionStorage.setItem("tree:return", JSON.stringify({ slug, scrollY: 0 }));
        } catch {
          /* ignore */
        }
        zoomBack("/projects", `[data-fruit="${slug}"] .fruit-body`, FRUIT_COLORS[fruit]);
      }}
    >
      <ArrowLeft className="size-4" />
      Back to the tree
    </Link>
  );
}
