"use client";

import { AppleIcon } from "@/components/tree/apple-icon";
import { FRUIT_LABELS } from "@/lib/tree/types";

const ORDER = ["golden", "ripe", "green", "blossom"] as const;

/** The apple itself is the symbol; only its meaning is spelled out. */
export function TreeLegend({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      aria-label="What the fruits mean"
      className={`flex flex-wrap gap-x-7 gap-y-3 ${compact ? "text-xs" : "text-sm"}`}
    >
      {ORDER.map((kind) => (
        <li className="inline-flex items-center gap-2.5" key={kind}>
          <AppleIcon className={compact ? "size-5" : "size-6"} kind={kind} />
          <span className="sr-only">{FRUIT_LABELS[kind].label}: </span>
          <span className="text-text-secondary">{FRUIT_LABELS[kind].meaning}</span>
        </li>
      ))}
    </ul>
  );
}
