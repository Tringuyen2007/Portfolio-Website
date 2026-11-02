import { applePath } from "@/lib/tree/layout";
import { FRUIT_LABELS } from "@/lib/tree/types";

const ORDER = ["golden", "ripe", "green", "blossom"] as const;

export function TreeLegend({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      aria-label="What the fruits mean"
      className={`flex flex-wrap gap-x-6 gap-y-3 ${compact ? "text-xs" : "text-sm"}`}
    >
      {ORDER.map((kind) => (
        <li className="inline-flex items-center gap-2.5" key={kind}>
          <svg aria-hidden="true" className="size-6 shrink-0" viewBox="-14 -14 28 28">
            <defs>
              <radialGradient id={`legend-${kind}`} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor={kind === "golden" ? "#f6dd8a" : kind === "ripe" ? "#e2695c" : kind === "green" ? "#a1c484" : "#f5d4dc"} />
                <stop offset="100%" stopColor={kind === "golden" ? "#9a7322" : kind === "ripe" ? "#7a2621" : kind === "green" ? "#35502f" : "#a06a7c"} />
              </radialGradient>
            </defs>
            <path d={applePath(10)} fill={`url(#legend-${kind})`} />
            <rect fill="var(--bark-deep)" height="6" rx="1" width="2" x="-1" y="-13" />
          </svg>
          <span>
            <span className="text-text-primary">{FRUIT_LABELS[kind].label}</span>
            <span className="text-text-muted"> · {FRUIT_LABELS[kind].meaning}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
